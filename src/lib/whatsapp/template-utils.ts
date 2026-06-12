/**
 * Replace Meta template placeholders {{1}}, {{2}}, … with resolved values.
 */
export function renderTemplateBody(body: string, params: string[]): string {
  return body.replace(/\{\{(\d+)\}\}/g, (_, raw) => {
    const idx = Number(raw) - 1
    return params[idx] ?? `{{${raw}}}`
  })
}
