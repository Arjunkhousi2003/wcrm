import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseAdmin } from '@/lib/flows/admin-client'

const MAX_FIELD_LENGTH = 255
const MAX_MESSAGE_LENGTH = 5000

type UserMessageInsert = {
  full_name: string
  email: string
  phone: string | null
  subject: string
  message: string
}

function normalizeText(value: unknown, maxLength = MAX_FIELD_LENGTH): string {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, maxLength)
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const payload: UserMessageInsert = {
      full_name: normalizeText(body.full_name),
      email: normalizeText(body.email).toLowerCase(),
      phone: normalizeText(body.phone),
      subject: normalizeText(body.subject),
      message: normalizeText(body.message, MAX_MESSAGE_LENGTH),
    }

    if (!payload.full_name || !payload.email || !payload.subject || !payload.message) {
      return NextResponse.json(
        { error: 'full_name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const { error } = await supabaseAdmin().from('user_messages').insert(payload)
    if (error) {
      console.error('[user-messages] insert failed:', error.message)
      return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[user-messages] POST failed:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data, error } = await supabaseAdmin()
      .from('user_messages')
      .select('id, full_name, email, phone, subject, message, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[user-messages] GET failed:', error.message)
      return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
    }

    return NextResponse.json({ messages: data ?? [] })
  } catch (error) {
    console.error('[user-messages] GET exception:', error)
    return NextResponse.json({ error: 'Failed to load messages' }, { status: 500 })
  }
}
