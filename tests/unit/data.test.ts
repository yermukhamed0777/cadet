import { describe, expect, it } from 'vitest';
import { academies } from '../../src/data/academies';
import { specialties } from '../../src/data/specialties';
import { documents } from '../../src/data/documents';
import { vvkChecklist } from '../../src/data/vvk';
import { fitnessNormSets } from '../../src/data/fitness';
import { admissionFacts } from '../../src/data/requirements';
import { news } from '../../src/data/news';
import { AUDITED_AT, CHECKED_AT, URLS } from '../../src/data/sources';
import type { SourceRef } from '../../src/types';

const refs: { label: string; ref: SourceRef }[] = [
  ...academies.flatMap((a) => [
    { label: `${a.id}.address`, ref: a.address },
    { label: `${a.id}.founded`, ref: a.founded },
    { label: `${a.id}.name`, ref: a.nameRef },
    ...a.contacts.map((c) => ({ label: `${a.id}.contact.${c.label}`, ref: c.ref })),
  ]),
  ...specialties.map((s) => ({ label: `specialty.${s.id}`, ref: s as SourceRef })),
  ...documents.map((d) => ({ label: `document.${d.id}`, ref: d as SourceRef })),
  ...vvkChecklist.map((i) => ({ label: `vvk.${i.id}`, ref: i as SourceRef })),
  ...fitnessNormSets.map((s) => ({ label: `fitness.${s.id}`, ref: s as SourceRef })),
  ...admissionFacts.map((f) => ({ label: `requirement.${f.id}`, ref: f as SourceRef })),
  ...news.map((n) => ({ label: `news.${n.id}`, ref: n as SourceRef })),
];

describe('catalog integrity', () => {
  it('gives every fact a status, a check date and a source URL when verified', () => {
    for (const { label, ref } of refs) {
      expect(['verified', 'archive', 'needs_review'], label).toContain(ref.status);
      expect([CHECKED_AT, AUDITED_AT], label).toContain(ref.checkedAt);
      if (ref.checkedAt === AUDITED_AT)
        expect(
          [
            URLS.annapolisApply,
            URLS.coloradoRequirements,
            URLS.newLondonRequirements,
            URLS.newLondonApply,
            URLS.dodmerb,
          ],
          label,
        ).toContain(ref.sourceUrl);
      if (ref.status === 'verified') expect(ref.sourceUrl, label).toMatch(/^https:\/\//);
    }
  });

  it('uses unique IDs within each catalog', () => {
    const ids = (items: { id: string }[]) => items.map((i) => i.id);
    for (const list of [academies, specialties, documents, vvkChecklist, fitnessNormSets, admissionFacts, news]) {
      expect(new Set(ids(list)).size, list.length.toString()).toBe(list.length);
    }
  });

  it('only publishes reference fitness figures, never tiered passing standards', () => {
    for (const set of fitnessNormSets) {
      for (const ex of set.exercises) {
        expect(ex.referenceOnly, ex.id).toBe(true);
        expect(ex.excellent, ex.id).toBe(ex.good);
        expect(ex.excellent, ex.id).toBe(ex.satisfactory);
      }
    }
  });

  it('keeps every specialty attached to a known academy', () => {
    const academyIds = new Set(academies.map((a) => a.id));
    for (const s of specialties) expect(academyIds.has(s.academyId), s.id).toBe(true);
  });

  it('does not advertise a null value as a confirmed fact', () => {
    expect(academies.every((a) => a.address.value === null || a.address.status === 'verified')).toBe(true);
    expect(vvkChecklist.every((i) => i.status === 'verified' || i.status === 'needs_review')).toBe(true);
  });

  it('records the current manual check date and canonical URLs', () => {
    expect(CHECKED_AT).toBe('2026-11-25');
    expect(Object.values(URLS).every((u) => u.startsWith('https://'))).toBe(true);
  });
});
