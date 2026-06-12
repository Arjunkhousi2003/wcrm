import type { SupabaseClient } from '@supabase/supabase-js'
import { normalizePhone, phonesMatch } from '@/lib/whatsapp/phone-utils'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContactRow = Record<string, any>

export interface ContactOutcome {
  contact: ContactRow
  wasCreated: boolean
}

/**
 * Resolve the CRM contact for an inbound WhatsApp message.
 *
 * Broadcast replies were landing in a second conversation because
 * `message.from` (digits-only Meta wa_id) didn't always match the
 * phone string stored on the contact row from CSV/import. Prefer a
 * recent broadcast recipient whose contact phone matches the sender.
 */
export async function resolveInboundContact(
  db: SupabaseClient,
  userId: string,
  senderPhone: string,
  contactName: string,
): Promise<ContactOutcome | null> {
  const senderDigits = normalizePhone(senderPhone)
  if (!senderDigits) return null

  const fromBroadcast = await findBroadcastContact(
    db,
    userId,
    senderDigits,
  )
  if (fromBroadcast) {
    await maybeUpdateContactName(db, fromBroadcast, contactName)
    await canonicalizeContactPhone(db, fromBroadcast, senderDigits)
    return { contact: fromBroadcast, wasCreated: false }
  }

  return findOrCreateContactByPhone(db, userId, senderDigits, contactName)
}

async function findBroadcastContact(
  db: SupabaseClient,
  userId: string,
  senderDigits: string,
): Promise<ContactRow | null> {
  const { data, error } = await db
    .from('broadcast_recipients')
    .select(
      'contact_id, created_at, contact:contacts(id, user_id, phone, name), broadcasts!inner(user_id)',
    )
    .eq('broadcasts.user_id', userId)
    .not('contact_id', 'is', null)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('[webhook] broadcast contact lookup failed:', error.message)
    return null
  }

  for (const row of data ?? []) {
    const contact = row.contact as ContactRow | null
    if (!contact?.phone) continue
    if (phonesMatch(contact.phone, senderDigits)) {
      return contact
    }
  }

  return null
}

async function findOrCreateContactByPhone(
  db: SupabaseClient,
  userId: string,
  senderDigits: string,
  contactName: string,
): Promise<ContactOutcome | null> {
  const { data: contacts, error: contactsError } = await db
    .from('contacts')
    .select('*')
    .eq('user_id', userId)

  if (contactsError) {
    console.error('Error fetching contacts:', contactsError)
    return null
  }

  const existingContact = contacts?.find((c: ContactRow) =>
    phonesMatch(c.phone, senderDigits),
  )

  if (existingContact) {
    await maybeUpdateContactName(db, existingContact, contactName)
    await canonicalizeContactPhone(db, existingContact, senderDigits)
    return { contact: existingContact, wasCreated: false }
  }

  const { data: newContact, error: createError } = await db
    .from('contacts')
    .insert({
      user_id: userId,
      phone: senderDigits,
      name: contactName || senderDigits,
    })
    .select()
    .single()

  if (createError) {
    console.error('Error creating contact:', createError)
    return null
  }

  return { contact: newContact, wasCreated: true }
}

async function maybeUpdateContactName(
  db: SupabaseClient,
  contact: ContactRow,
  name: string,
) {
  if (!name || name === contact.name) return
  await db
    .from('contacts')
    .update({ name, updated_at: new Date().toISOString() })
    .eq('id', contact.id)
}

async function canonicalizeContactPhone(
  db: SupabaseClient,
  contact: ContactRow,
  senderDigits: string,
) {
  if (normalizePhone(contact.phone) === senderDigits) return
  await db
    .from('contacts')
    .update({ phone: senderDigits, updated_at: new Date().toISOString() })
    .eq('id', contact.id)
}
