export interface CsvContactRow {
  phone: string;
  name?: string;
}

const PHONE_HEADER_ALIASES = [
  'phone',
  'mobile',
  'phone_number',
  'phonenumber',
  'whatsapp',
  'tel',
  'telephone',
  'contact',
  'number',
];

function normalizePhone(raw: string): string {
  return raw.replace(/["']/g, '').trim().replace(/[\s\-()]/g, '');
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (const char of line) {
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function findPhoneColumnIndex(headers: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i].toLowerCase().replace(/[^a-z0-9_]/g, '');
    if (PHONE_HEADER_ALIASES.includes(h)) return i;
  }
  return -1;
}

function looksLikePhone(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 8 && digits.length <= 15;
}

/**
 * Parse a CSV file into phone/name contact rows for broadcast audiences.
 * Supports a header row with phone/mobile/phone_number columns, or a
 * single-column phone-only file with no header.
 */
export function parseCsvContacts(text: string): CsvContactRow[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) return [];

  const firstValues = parseCsvLine(lines[0]);
  const firstHeader = firstValues[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') ?? '';
  const hasHeader = PHONE_HEADER_ALIASES.includes(firstHeader) || firstHeader === 'name';

  let phoneIdx: number;
  let nameIdx: number;
  let startRow: number;

  if (hasHeader) {
    const headers = firstValues.map((h) =>
      h.trim().toLowerCase().replace(/["']/g, ''),
    );
    phoneIdx = findPhoneColumnIndex(headers);
    nameIdx = headers.findIndex((h) => h.replace(/[^a-z0-9_]/g, '') === 'name');
    startRow = 1;
    if (phoneIdx === -1) return [];
  } else if (firstValues.length === 1 && looksLikePhone(firstValues[0])) {
    phoneIdx = 0;
    nameIdx = -1;
    startRow = 0;
  } else {
    return [];
  }

  const rows: CsvContactRow[] = [];
  const seen = new Set<string>();

  for (let i = startRow; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const phone = normalizePhone(values[phoneIdx] ?? '');
    if (!phone || !looksLikePhone(phone)) continue;
    if (seen.has(phone)) continue;
    seen.add(phone);

    const name =
      nameIdx >= 0
        ? values[nameIdx]?.replace(/["']/g, '').trim() || undefined
        : values.length > 1 && phoneIdx === 0
          ? values[1]?.replace(/["']/g, '').trim() || undefined
          : undefined;

    rows.push({ phone, name });
  }

  return rows;
}
