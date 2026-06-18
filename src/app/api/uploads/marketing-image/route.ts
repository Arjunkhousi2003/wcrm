import { writeFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  MARKETING_IMAGE_MAX_BYTES,
  MARKETING_IMAGE_MIME,
  buildMarketingFileName,
  buildMarketingPublicUrl,
  buildMarketingStoragePath,
  ensureMarketingUploadDir,
} from '@/lib/uploads/marketing-media'
import {
  checkRateLimit,
  rateLimitResponse,
  RATE_LIMITS,
} from '@/lib/rate-limit'

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

    const limit = checkRateLimit(
      `marketing-upload:${user.id}`,
      RATE_LIMITS.marketingUpload,
    )
    if (!limit.success) {
      return rateLimitResponse(limit)
    }

    const form = await request.formData()
    const file = form.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'file is required' }, { status: 400 })
    }

    if (!MARKETING_IMAGE_MIME.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported image type. Use JPEG, PNG, or WebP.' },
        { status: 400 },
      )
    }

    if (file.size > MARKETING_IMAGE_MAX_BYTES) {
      return NextResponse.json(
        { error: 'Image is too large. Maximum 5 MB.' },
        { status: 400 },
      )
    }

    const fileName = buildMarketingFileName(file.type)
    await ensureMarketingUploadDir(user.id)
    const storagePath = buildMarketingStoragePath(user.id, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(storagePath, buffer)

    const publicUrl = buildMarketingPublicUrl(user.id, fileName)

    const { data: row, error: insertError } = await supabase
      .from('marketing_media')
      .insert({
        user_id: user.id,
        file_name: fileName,
        storage_path: storagePath,
        public_url: publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
      })
      .select('id, public_url, file_name, mime_type, created_at')
      .single()

    if (insertError || !row) {
      console.error('[marketing-image] DB insert failed:', insertError?.message)
      return NextResponse.json(
        { error: 'Image saved but failed to record in database' },
        { status: 500 },
      )
    }

    return NextResponse.json({
      id: row.id,
      url: row.public_url,
      file_name: row.file_name,
      mime_type: row.mime_type,
      created_at: row.created_at,
    })
  } catch (error) {
    console.error('[marketing-image] upload failed:', error)
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 },
    )
  }
}
