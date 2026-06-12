import type { SupabaseClient } from '@supabase/supabase-js'

export interface MirrorOutboundInput {
  userId: string
  contactId: string
  contentType: 'text' | 'template'
  contentText?: string | null
  templateName?: string | null
  whatsappMessageId: string
  /** Defaults to now — pass the original send time for backfills. */
  createdAt?: string
}

/**
 * Persist an outbound WhatsApp message into the inbox thread so broadcast
 * (and other API-only sends) appear alongside customer replies.
 */
export async function mirrorOutboundToInbox(
  supabase: SupabaseClient,
  input: MirrorOutboundInput,
): Promise<void> {
  const conversationId = await findOrCreateConversation(
    supabase,
    input.userId,
    input.contactId,
  )
  if (!conversationId) return

  const { data: existing } = await supabase
    .from('messages')
    .select('id')
    .eq('message_id', input.whatsappMessageId)
    .maybeSingle()

  if (existing) return

  const preview =
    input.contentText?.trim() ||
    input.templateName ||
    `[${input.contentType}]`

  const createdAt = input.createdAt ?? new Date().toISOString()

  const { error: msgError } = await supabase.from('messages').insert({
    conversation_id: conversationId,
    sender_type: 'agent',
    content_type: input.contentType,
    content_text: input.contentText ?? null,
    template_name: input.templateName ?? null,
    message_id: input.whatsappMessageId,
    status: 'sent',
    created_at: createdAt,
  })

  if (msgError) {
    if (msgError.code === '23505') return
    console.error('[inbox-mirror] message insert failed:', msgError.message)
    return
  }

  // Only advance the conversation preview when this mirrored message is
  // newer than what's already stored (backfills must not rewind the list).
  const { data: convRow } = await supabase
    .from('conversations')
    .select('last_message_at')
    .eq('id', conversationId)
    .maybeSingle()

  const shouldAdvancePreview =
    !convRow?.last_message_at ||
    new Date(createdAt) >= new Date(convRow.last_message_at)

  const { error: convError } = await supabase
    .from('conversations')
    .update({
      ...(shouldAdvancePreview
        ? {
            last_message_text: preview,
            last_message_at: createdAt,
          }
        : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', conversationId)

  if (convError) {
    console.error('[inbox-mirror] conversation update failed:', convError.message)
  }
}

async function findOrCreateConversation(
  supabase: SupabaseClient,
  userId: string,
  contactId: string,
): Promise<string | null> {
  const { data: existing, error: findError } = await supabase
    .from('conversations')
    .select('id')
    .eq('user_id', userId)
    .eq('contact_id', contactId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (findError) {
    console.error('[inbox-mirror] conversation lookup failed:', findError.message)
    return null
  }

  if (existing) return existing.id

  const { data: created, error: createError } = await supabase
    .from('conversations')
    .insert({ user_id: userId, contact_id: contactId })
    .select('id')
    .single()

  if (createError) {
    // Unique index race — another request may have created the row.
    const { data: retry } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('contact_id', contactId)
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle()
    if (retry) return retry.id
    console.error('[inbox-mirror] conversation create failed:', createError.message)
    return null
  }

  return created.id
}
