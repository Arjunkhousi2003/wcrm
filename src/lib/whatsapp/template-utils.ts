/**
 * Replace Meta template placeholders {{1}}, {{2}}, … with resolved values.
 */
export function renderTemplateBody(body: string, params: string[]): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, raw) => {
    const idx = Number(raw) - 1
    return params[idx] ?? `{{${raw}}}`
  })
}

export type TemplateMediaHeaderType = 'image' | 'video' | 'document'

export function templateNeedsMediaHeader(
  headerType?: string | null,
): headerType is TemplateMediaHeaderType {
  return (
    headerType === 'image' ||
    headerType === 'video' ||
    headerType === 'document'
  )
}

export interface TemplateHeaderMedia {
  type: TemplateMediaHeaderType
  url: string
  /** Shown as the attachment name for document headers. */
  filename?: string
}

/**
 * Build Meta `template.components` for send requests. Media headers must
 * include a publicly reachable HTTPS URL — Meta fetches it at send time.
 */
export function buildTemplateComponents(args: {
  bodyParams?: string[]
  headerMedia?: TemplateHeaderMedia
  headerTextParams?: string[]
}): Record<string, unknown>[] | undefined {
  const components: Record<string, unknown>[] = []

  if (args.headerMedia) {
    const mediaPayload: Record<string, unknown> = { link: args.headerMedia.url }
    if (args.headerMedia.type === 'document' && args.headerMedia.filename) {
      mediaPayload.filename = args.headerMedia.filename
    }
    components.push({
      type: 'header',
      parameters: [
        {
          type: args.headerMedia.type,
          [args.headerMedia.type]: mediaPayload,
        },
      ],
    })
  } else if (args.headerTextParams && args.headerTextParams.length > 0) {
    components.push({
      type: 'header',
      parameters: args.headerTextParams.map((p) => ({
        type: 'text',
        text: String(p),
      })),
    })
  }

  if (args.bodyParams && args.bodyParams.length > 0) {
    components.push({
      type: 'body',
      parameters: args.bodyParams.map((p) => ({
        type: 'text',
        text: String(p),
      })),
    })
  }

  return components.length > 0 ? components : undefined
}

/** Meta requires HTTPS and must be able to fetch the asset server-side. */
export function isValidTemplateMediaUrl(url: string): boolean {
  try {
    const parsed = new URL(url.trim())
    return parsed.protocol === 'https:'
  } catch {
    return false
  }
}
