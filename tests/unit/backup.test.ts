import { describe, expect, it } from 'vitest';
import { BACKUP_SCHEMA, createBackup, parseBackup } from '../../src/utils/backup';
import { documents } from '../../src/data/documents';
import { makeState } from '../helpers/state';

const stamp = () => '2026-11-26T12:00:00.000Z';

describe('backup and restore', () => {
  it('round-trips a full state without losing data', () => {
    const state = makeState({
      profile: {
        lastName: 'Doe',
        firstName: 'Jane',
        middleName: '',
        birthDate: '2008-05-01',
        city: 'Boston',
        gender: 'female',
      },
      selectedAcademy: 'westpoint',
      selectedSpecialty: 'westpoint-majors',
      documentsProgress: { [documents[0].id]: 'ready' },
      vvkProgress: { 'med-dodmerb': true },
      compare: ['annapolis', 'newlondon'],
      myPathProgress: { requirementsViewed: true, manual: { competition: true } },
    });
    const result = parseBackup(createBackup(state, stamp));
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.state).toEqual(state);
  });

  it('is versioned, labelled and does not invent an export date', () => {
    const text = createBackup(makeState(), stamp);
    const parsed = JSON.parse(text);
    expect(parsed.schema).toBe(BACKUP_SCHEMA);
    expect(parsed.app).toBe('cadet');
    expect(parsed.exportedAt).toBe(stamp());
  });

  it.each([
    ['not json', '{'],
    ['wrong app', '{"schema":1,"app":"other","exportedAt":"2026-01-01T00:00:00.000Z","state":{}}'],
    ['wrong version', '{"schema":99,"app":"cadet","exportedAt":"2026-01-01T00:00:00.000Z","state":{}}'],
    ['missing state', '{"schema":1,"app":"cadet","exportedAt":"2026-01-01T00:00:00.000Z"}'],
    ['bad status', '{"schema":1,"app":"cadet","exportedAt":"2026-01-01T00:00:00.000Z","state":{"documentsProgress":{"doc-portal":"done"}}}'],
    ['bad gender', '{"schema":1,"app":"cadet","exportedAt":"2026-01-01T00:00:00.000Z","state":{"profile":{"lastName":"Doe","firstName":"Jane","middleName":"","birthDate":"2008-05-01","city":"Boston","gender":"other"}}}'],
  ])('rejects a malformed backup: %s', (_label, text) => {
    expect(parseBackup(text).ok).toBe(false);
  });

  it('sanitises unknown academy and specialty ids and caps comparison to three', () => {
    const text = JSON.stringify({
      schema: 1,
      app: 'cadet',
      exportedAt: stamp(),
      state: {
        selectedAcademy: 'not-an-academy',
        selectedSpecialty: 'not-a-specialty',
        compare: ['westpoint', 'annapolis', 'coloradosprings', 'newlondon', 'not-an-academy'],
      },
    });
    const result = parseBackup(text);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.state.selectedAcademy).toBeNull();
      expect(result.state.selectedSpecialty).toBeNull();
      expect(result.state.compare).toEqual(['westpoint', 'annapolis', 'coloradosprings']);
    }
  });
});
