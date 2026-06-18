import { describe, expect, it } from 'vitest'
import {
  buildMarketingPublicUrl,
  buildMarketingStoragePath,
  marketingImageExtension,
  resolveMarketingFilePath,
} from './marketing-media'

describe('marketing-media', () => {
  it('maps mime types to extensions', () => {
    expect(marketingImageExtension('image/jpeg')).toBe('jpg')
    expect(marketingImageExtension('image/png')).toBe('png')
    expect(marketingImageExtension('image/webp')).toBe('webp')
  })

  it('builds storage paths under the upload dir', () => {
    const p = buildMarketingStoragePath('user-1', 'abc.jpg')
    expect(p).toContain('user-1')
    expect(p.endsWith('abc.jpg')).toBe(true)
  })

  it('builds public URLs with user segment', () => {
    const url = buildMarketingPublicUrl('user-1', 'abc.jpg')
    expect(url).toContain('/user-1/abc.jpg')
    expect(url.startsWith('https://')).toBe(true)
  })

  it('rejects path traversal', () => {
    expect(resolveMarketingFilePath('../etc/passwd')).toBeNull()
    expect(resolveMarketingFilePath('user-1/../../secret.jpg')).toBeNull()
  })
})
