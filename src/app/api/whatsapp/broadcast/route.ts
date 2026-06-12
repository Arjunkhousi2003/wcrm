import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendTemplateMessage } from '@/lib/whatsapp/meta-api'
import { decrypt } from '@/lib/whatsapp/encryption'
import {
  sanitizePhoneForMeta,
  isValidE164,
  phoneVariants,
  isRecipientNotAllowedError,
} from '@/lib/whatsapp/phone-utils'
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit'
import { mirrorOutboundToInbox } from '@/lib/whatsapp/inbox-mirror'
import {
  isValidTemplateMediaUrl,
  templateNeedsMediaHeader,
  type TemplateHeaderMedia,
} from '@/lib/whatsapp/template-utils'

interface BroadcastResult {
  phone: string
  status: 'sent' | 'failed'
  whatsapp_message_id?: string
  error?: string
}

/**
 * Two input shapes are accepted:
 *
 *   NEW (preferred — supports per-recipient variable substitution):
 *     {
 *       recipients: Array<{ phone: string; params: string[] }>,
 *       template_name, template_language
 *     }
 *
 *   LEGACY (all phones receive the same params — kept so existing
 *   callers don't break):
 *     {
 *       phone_numbers: string[],
 *       template_params: string[],
 *       template_name, template_language
 *     }
 *
 * Previous implementation only supported the legacy shape, and the
 * sending hook was forced to ship every batch with `templateParams[0]`
 * — meaning every recipient got contact-0's personalization. The new
 * shape is what actually fixes that.
 */
interface NewRecipient {
  phone: string
  params?: string[]
  /** When set, the sent template is mirrored into the inbox thread. */
  contact_id?: string
  /** Rendered template body for inbox display (with {{n}} substituted). */
  content_text?: string
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      broadcast_id,
      recipients: newRecipients,
      phone_numbers,
      template_name,
      template_language,
      template_params,
      header_media_url,
      header_media_type,
    } = body

    // In-flight campaigns send one API call per ~10 recipients. Rate-
    // limit per campaign (generous) vs per-user campaign starts (strict).
    if (broadcast_id) {
      const { data: campaign, error: campaignError } = await supabase
        .from('broadcasts')
        .select('id')
        .eq('id', broadcast_id)
        .eq('user_id', user.id)
        .maybeSingle()

      if (campaignError || !campaign) {
        return NextResponse.json(
          { error: 'Broadcast not found' },
          { status: 404 },
        )
      }

      const batchLimit = checkRateLimit(
        `broadcast:batch:${user.id}:${broadcast_id}`,
        RATE_LIMITS.broadcastBatch,
      )
      if (!batchLimit.success) {
        return rateLimitResponse(batchLimit)
      }
    } else {
      const startLimit = checkRateLimit(
        `broadcast:start:${user.id}`,
        RATE_LIMITS.broadcastStart,
      )
      if (!startLimit.success) {
        return rateLimitResponse(startLimit)
      }
    }

    // Normalize to a list of {phone, params} regardless of shape.
    let recipients: NewRecipient[]
    if (Array.isArray(newRecipients) && newRecipients.length > 0) {
      recipients = newRecipients
    } else if (Array.isArray(phone_numbers) && phone_numbers.length > 0) {
      const shared: string[] = Array.isArray(template_params)
        ? template_params
        : []
      recipients = phone_numbers.map((phone: string) => ({
        phone,
        params: shared,
      }))
    } else {
      return NextResponse.json(
        {
          error:
            'Provide either `recipients` (preferred) or `phone_numbers` — must be a non-empty array',
        },
        { status: 400 }
      )
    }

    if (!template_name) {
      return NextResponse.json(
        { error: 'template_name is required' },
        { status: 400 }
      )
    }

    let headerMedia: TemplateHeaderMedia | undefined
    if (header_media_type && templateNeedsMediaHeader(header_media_type)) {
      if (
        typeof header_media_url !== 'string' ||
        !isValidTemplateMediaUrl(header_media_url)
      ) {
        return NextResponse.json(
          {
            error: `This template requires a public HTTPS ${header_media_type} URL in the header.`,
          },
          { status: 400 },
        )
      }
      headerMedia = {
        type: header_media_type,
        url: header_media_url.trim(),
      }
    }

    const { data: config, error: configError } = await supabase
      .from('whatsapp_config')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (configError || !config) {
      return NextResponse.json(
        {
          error:
            'WhatsApp not configured. Please set up your WhatsApp integration first.',
        },
        { status: 400 }
      )
    }

    const accessToken = decrypt(config.access_token)

    const results: BroadcastResult[] = []
    let sentCount = 0
    let failedCount = 0

    for (const recipient of recipients) {
      const sanitized = sanitizePhoneForMeta(recipient.phone)

      if (!isValidE164(sanitized)) {
        results.push({
          phone: recipient.phone,
          status: 'failed',
          error: 'Invalid phone number format',
        })
        failedCount++
        continue
      }

      // Retry with phone variants on "not in allowed list" so numbers
      // that differ only in a trunk-prefix 0 still reach recipients.
      const variants = phoneVariants(sanitized)
      let sentMessageId: string | null = null
      let lastError: string | null = null

      for (const variant of variants) {
        try {
          const result = await sendTemplateMessage({
            phoneNumberId: config.phone_number_id,
            accessToken,
            to: variant,
            templateName: template_name,
            language: template_language || 'en_US',
            params: recipient.params ?? [],
            headerMedia,
          })
          sentMessageId = result.messageId
          lastError = null
          break
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error'
          if (!isRecipientNotAllowedError(errorMessage)) {
            lastError = errorMessage
            break
          }
          lastError = errorMessage
          // retry with next variant
        }
      }

      if (sentMessageId) {
        results.push({
          phone: recipient.phone,
          status: 'sent',
          whatsapp_message_id: sentMessageId,
        })
        sentCount++

        if (recipient.contact_id) {
          try {
            await mirrorOutboundToInbox(supabase, {
              userId: user.id,
              contactId: recipient.contact_id,
              contentType: 'template',
              contentText: recipient.content_text ?? null,
              templateName: template_name,
              whatsappMessageId: sentMessageId,
            })
          } catch (mirrorErr) {
            console.error(
              `[broadcast] inbox mirror failed for ${recipient.phone}:`,
              mirrorErr instanceof Error ? mirrorErr.message : mirrorErr,
            )
          }
        }
      } else {
        console.error(
          `Failed to send broadcast to ${recipient.phone}:`,
          lastError
        )
        results.push({
          phone: recipient.phone,
          status: 'failed',
          error: lastError || 'Unknown error',
        })
        failedCount++
      }
    }

    return NextResponse.json({
      success: true,
      total: recipients.length,
      sent: sentCount,
      failed: failedCount,
      results,
    })
  } catch (error) {
    console.error('Error in WhatsApp broadcast POST:', error)
    return NextResponse.json(
      { error: 'Failed to process broadcast' },
      { status: 500 }
    )
  }
}
