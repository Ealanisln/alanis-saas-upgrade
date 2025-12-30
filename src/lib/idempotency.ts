/**
 * Idempotency store for preventing duplicate webhook processing
 *
 * This implementation uses an in-memory store with TTL for MVP.
 * For production with high traffic, replace with Redis or database storage.
 *
 * @see https://stripe.com/docs/webhooks/best-practices#duplicate-events
 */

interface ProcessedEvent {
  timestamp: number;
  status: "processing" | "completed" | "failed";
}

// In-memory store for processed events
// Note: In serverless, each instance has its own store
// For production, use Redis: SETNX with TTL
const processedEvents = new Map<string, ProcessedEvent>();

// TTL for processed events (24 hours - matches Stripe's retry window)
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

// Cleanup interval (run every hour)
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000;

let cleanupTimer: NodeJS.Timeout | null = null;

/**
 * Start periodic cleanup of expired events
 */
function startCleanupTimer() {
  if (cleanupTimer) return;

  cleanupTimer = setInterval(() => {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [eventId, event] of processedEvents.entries()) {
      if (now - event.timestamp > EVENT_TTL_MS) {
        processedEvents.delete(eventId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.warn(`[Idempotency] Cleaned up ${cleanedCount} expired event(s)`);
    }
  }, CLEANUP_INTERVAL_MS);

  // Don't prevent Node.js from exiting
  cleanupTimer.unref();
}

// Start cleanup timer on module load
startCleanupTimer();

/**
 * Check if an event has already been processed
 * @returns true if event was already processed or is being processed
 */
export function isEventProcessed(eventId: string): boolean {
  const event = processedEvents.get(eventId);

  if (!event) {
    return false;
  }

  // Check if event is expired
  if (Date.now() - event.timestamp > EVENT_TTL_MS) {
    processedEvents.delete(eventId);
    return false;
  }

  return true;
}

/**
 * Mark an event as being processed (acquire lock)
 * @returns true if lock acquired, false if already being processed
 */
export function markEventProcessing(eventId: string): boolean {
  if (isEventProcessed(eventId)) {
    return false;
  }

  processedEvents.set(eventId, {
    timestamp: Date.now(),
    status: "processing",
  });

  return true;
}

/**
 * Mark an event as successfully completed
 */
export function markEventCompleted(eventId: string): void {
  const event = processedEvents.get(eventId);
  if (event) {
    event.status = "completed";
    event.timestamp = Date.now(); // Refresh timestamp
  }
}

/**
 * Mark an event as failed (allows retry)
 */
export function markEventFailed(eventId: string): void {
  // Remove failed events to allow retry
  processedEvents.delete(eventId);
}

/**
 * Get event processing status
 */
export function getEventStatus(
  eventId: string,
): ProcessedEvent["status"] | null {
  const event = processedEvents.get(eventId);
  if (!event) return null;

  // Check if expired
  if (Date.now() - event.timestamp > EVENT_TTL_MS) {
    processedEvents.delete(eventId);
    return null;
  }

  return event.status;
}

/**
 * Get count of tracked events (for monitoring)
 */
export function getProcessedEventCount(): number {
  return processedEvents.size;
}

// For testing purposes only
export function _clearAllEvents(): void {
  processedEvents.clear();
}
