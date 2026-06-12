import { describe, expect, it } from 'vitest'
import {
  buildTemplateComponents,
  isValidTemplateMediaUrl,
  templateNeedsMediaHeader,
} from './template-utils'

describe('templateNeedsMediaHeader', () => {
  it('detects image, video, and document headers', () => {
    expect(templateNeedsMediaHeader('image')).toBe(true)
    expect(templateNeedsMediaHeader('video')).toBe(true)
    expect(templateNeedsMediaHeader('document')).toBe(true)
    expect(templateNeedsMediaHeader('text')).toBe(false)
    expect(templateNeedsMediaHeader(null)).toBe(false)
  })
})

describe('isValidTemplateMediaUrl', () => {
  it('accepts HTTPS URLs only', () => {
    expect(isValidTemplateMediaUrl('https://cdn.example.com/a.jpg')).toBe(true)
    expect(isValidTemplateMediaUrl('http://cdn.example.com/a.jpg')).toBe(false)
    expect(isValidTemplateMediaUrl('not-a-url')).toBe(false)
  })
})

describe('buildTemplateComponents', () => {
  it('builds body-only components', () => {
    expect(buildTemplateComponents({ bodyParams: ['Alice'] })).toEqual([
      {
        type: 'body',
        parameters: [{ type: 'text', text: 'Alice' }],
      },
    ])
  })

  it('builds image header + body components', () => {
    expect(
      buildTemplateComponents({
        headerMedia: { type: 'image', url: 'https://cdn.example.com/p.jpg' },
        bodyParams: ['Hi'],
      }),
    ).toEqual([
      {
        type: 'header',
        parameters: [
          {
            type: 'image',
            image: { link: 'https://cdn.example.com/p.jpg' },
          },
        ],
      },
      {
        type: 'body',
        parameters: [{ type: 'text', text: 'Hi' }],
      },
    ])
  })
})
