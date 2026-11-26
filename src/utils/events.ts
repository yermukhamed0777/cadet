/**
 * Content-free local event harness for the validation plan.
 *
 * Only allowlisted event names are recorded, each with a timestamp. There is no
 * payload, no user text and no network transmission. Events are kept in memory
 * only so a facilitator can read counts during a session; they are never
 * persisted or sent anywhere. See tests/unit/events.test.ts for the automated
 * assertion that no journal or account content can be emitted.
 */
export const ALLOWED_EVENTS = [
  'app_opened',
  'path_stage_completed',
  'checklist_item_toggled',
  'reference_viewed',
  'backup_exported',
  'backup_imported',
] as const;

export type EventName = (typeof ALLOWED_EVENTS)[number];

export interface TelemetryEvent {
  name: EventName;
  at: string;
}

const buffer: TelemetryEvent[] = [];

/** Record an allowlisted, content-free event. Unknown names are ignored. */
export function emit(name: EventName, now: () => string = () => new Date().toISOString()): void {
  if (!ALLOWED_EVENTS.includes(name)) return;
  // Only the name and timestamp are stored — deliberately no extra arguments.
  buffer.push({ name, at: now() });
}

/** Return and clear recorded events (for local counting or tests). */
export function drainEvents(): TelemetryEvent[] {
  return buffer.splice(0);
}

/** Read-only view of the current buffer. */
export function peekEvents(): readonly TelemetryEvent[] {
  return buffer;
}
