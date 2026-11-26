import { beforeEach, describe, expect, it } from 'vitest';
import { ALLOWED_EVENTS, drainEvents, emit, peekEvents, type EventName } from '../../src/utils/events';

const SENSITIVE = [
  'jane.doe@example.com',
  'Jane',
  'Doe',
  '2008-05-01',
  'my private journal entry about the nomination',
  'cadet2026',
  'westpoint',
];

beforeEach(() => drainEvents());

describe('content-free event harness', () => {
  it('records only allowlisted names and a timestamp', () => {
    for (const name of ALLOWED_EVENTS) emit(name, () => '2026-01-01T00:00:00.000Z');
    const events = drainEvents();
    expect(events).toHaveLength(ALLOWED_EVENTS.length);
    for (const e of events) {
      expect(Object.keys(e).sort()).toEqual(['at', 'name']);
      expect(ALLOWED_EVENTS).toContain(e.name);
      expect(e.at).toBe('2026-01-01T00:00:00.000Z');
    }
  });

  it('ignores an unknown name even if it is forced through at runtime', () => {
    emit('unknown_event' as EventName);
    expect(peekEvents()).toHaveLength(0);
  });

  it('never emits journal or account content, even when callers pass extra data', () => {
    // Runtime callers cannot add a payload, but we simulate a hostile call to
    // prove that extra arguments are dropped rather than serialised.
    (emit as (...args: unknown[]) => void)(
      'app_opened',
      () => '2026-01-01T00:00:00.000Z',
      { email: SENSITIVE[0], journal: SENSITIVE[4], password: SENSITIVE[5] },
    );
    const serialised = JSON.stringify(drainEvents());
    for (const value of SENSITIVE) expect(serialised).not.toContain(value);
  });
});
