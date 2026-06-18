import { mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export const MARKETING_IMAGE_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

/** WhatsApp template header images are capped at 5 MB by Meta. */
export const MARKETING_IMAGE_MAX_BYTES = 5 * 1024 * 1024

const DEFAULT_LINUX_DIR = '/var/www/techdigicrm/uploads/images'

export function getMarketingUploadDir(): string {
  const configured = process.env.MARKETING_UPLOAD_DIR?.trim()
  if (configured) return configured
  if (process.platform === 'win32') {
    return path.join(process.cwd(), 'uploads', 'images')
  }
  return DEFAULT_LINUX_DIR
}

/**
 * Public HTTPS base used in stored URLs. When nginx serves
 * `/var/www/techdigicrm/uploads/images` at `/uploads/images`, set
 * MARKETING_UPLOAD_PUBLIC_URL=https://your-domain.com/uploads/images.
 * Otherwise files are served via the app's public GET route.
 */
export function getMarketingPublicBaseUrl(): string {
  const configured = process.env.MARKETING_UPLOAD_PUBLIC_URL?.trim()
  if (configured) return configured.replace(/\/$/, '')
  const site =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://wacrm.tech'
  return `${site.replace(/\/$/, '')}/api/uploads/marketing-image`
}

export function marketingImageExtension(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return 'jpg'
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    default:
      return 'bin'
  }
}

export function buildMarketingFileName(mime: string): string {
  return `${randomUUID()}.${marketingImageExtension(mime)}`
}

export function buildMarketingStoragePath(
  userId: string,
  fileName: string,
): string {
  return path.join(getMarketingUploadDir(), userId, fileName)
}

export function buildMarketingPublicUrl(
  userId: string,
  fileName: string,
): string {
  return `${getMarketingPublicBaseUrl()}/${userId}/${fileName}`
}

/** Resolve a relative path (userId/file.jpg) to an absolute file on disk. */
export function resolveMarketingFilePath(relativePath: string): string | null {
  const base = path.resolve(getMarketingUploadDir())
  const resolved = path.resolve(base, relativePath)
  if (!resolved.startsWith(base + path.sep) && resolved !== base) {
    return null
  }
  return resolved
}

export async function ensureMarketingUploadDir(
  userId: string,
): Promise<string> {
  const dir = path.join(getMarketingUploadDir(), userId)
  await mkdir(dir, { recursive: true })
  return dir
}
