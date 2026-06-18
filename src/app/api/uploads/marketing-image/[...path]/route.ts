import { readFile, stat } from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'
import {
  MARKETING_IMAGE_MIME,
  resolveMarketingFilePath,
} from '@/lib/uploads/marketing-media'

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
}

/**
 * Public file serving for marketing images. Meta fetches template
 * header URLs server-side — this route must stay unauthenticated.
 * On production, nginx can serve the same files directly from
 * /var/www/techdigicrm/uploads/images when MARKETING_UPLOAD_PUBLIC_URL
 * points at that static location instead.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path: segments } = await params
    if (!segments?.length || segments.length > 2) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const relativePath = segments.join('/')
    const filePath = resolveMarketingFilePath(relativePath)
    if (!filePath) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const info = await stat(filePath)
    if (!info.isFile()) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const ext = path.extname(filePath).toLowerCase()
    const contentType = MIME_BY_EXT[ext]
    if (!contentType || !MARKETING_IMAGE_MIME.has(contentType)) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const buffer = await readFile(filePath)
    return new Response(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
