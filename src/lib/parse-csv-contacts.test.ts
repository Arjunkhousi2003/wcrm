import { describe, expect, it } from 'vitest';
import { parseCsvContacts } from './parse-csv-contacts';

describe('parseCsvContacts', () => {
  it('parses CSV with phone header', () => {
    const csv = 'phone,name\n+1234567890,Alice\n+0987654321,Bob';
    const rows = parseCsvContacts(csv);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toEqual({ phone: '+1234567890', name: 'Alice' });
  });

  it('parses mobile column alias', () => {
    const csv = 'mobile\n919876543210';
    const rows = parseCsvContacts(csv);
    expect(rows).toHaveLength(1);
    expect(rows[0].phone).toBe('919876543210');
  });

  it('parses phone-only file without header', () => {
    const csv = '919876543210\n918765432109';
    const rows = parseCsvContacts(csv);
    expect(rows).toHaveLength(2);
  });

  it('deduplicates by phone', () => {
    const csv = 'phone\n919876543210\n919876543210';
    const rows = parseCsvContacts(csv);
    expect(rows).toHaveLength(1);
  });
});
