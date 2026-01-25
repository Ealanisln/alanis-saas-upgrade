import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import {
  isEventProcessed,
  markEventProcessing,
  markEventCompleted,
  markEventFailed,
  getEventStatus,
  getProcessedEventCount,
  _clearAllEvents,
} from "../idempotency";

// TTL constant matching the source (24 hours in milliseconds)
const EVENT_TTL_MS = 24 * 60 * 60 * 1000;

describe("idempotency", () => {
  beforeEach(() => {
    // Clear all events before each test
    _clearAllEvents();
  });

  describe("markEventProcessing", () => {
    it("should mark a new event as processing", () => {
      const eventId = "evt_test_123";

      const result = markEventProcessing(eventId);

      expect(result).toBe(true);
      expect(getEventStatus(eventId)).toBe("processing");
    });

    it("should return false for an event already being processed", () => {
      const eventId = "evt_test_456";

      markEventProcessing(eventId);
      const result = markEventProcessing(eventId);

      expect(result).toBe(false);
    });

    it("should return false for an event already completed", () => {
      const eventId = "evt_test_789";

      markEventProcessing(eventId);
      markEventCompleted(eventId);
      const result = markEventProcessing(eventId);

      expect(result).toBe(false);
    });
  });

  describe("isEventProcessed", () => {
    it("should return false for a new event", () => {
      const eventId = "evt_new_event";

      expect(isEventProcessed(eventId)).toBe(false);
    });

    it("should return true for an event being processed", () => {
      const eventId = "evt_processing";

      markEventProcessing(eventId);

      expect(isEventProcessed(eventId)).toBe(true);
    });

    it("should return true for a completed event", () => {
      const eventId = "evt_completed";

      markEventProcessing(eventId);
      markEventCompleted(eventId);

      expect(isEventProcessed(eventId)).toBe(true);
    });
  });

  describe("markEventCompleted", () => {
    it("should mark an event as completed", () => {
      const eventId = "evt_to_complete";

      markEventProcessing(eventId);
      markEventCompleted(eventId);

      expect(getEventStatus(eventId)).toBe("completed");
    });

    it("should do nothing for non-existent event", () => {
      const eventId = "evt_nonexistent";

      // Should not throw
      markEventCompleted(eventId);

      expect(getEventStatus(eventId)).toBeNull();
    });
  });

  describe("markEventFailed", () => {
    it("should remove a failed event to allow retry", () => {
      const eventId = "evt_to_fail";

      markEventProcessing(eventId);
      markEventFailed(eventId);

      expect(isEventProcessed(eventId)).toBe(false);
      expect(getEventStatus(eventId)).toBeNull();
    });

    it("should allow reprocessing of a failed event", () => {
      const eventId = "evt_retry";

      markEventProcessing(eventId);
      markEventFailed(eventId);

      const result = markEventProcessing(eventId);

      expect(result).toBe(true);
      expect(getEventStatus(eventId)).toBe("processing");
    });
  });

  describe("getEventStatus", () => {
    it("should return null for unknown event", () => {
      expect(getEventStatus("evt_unknown")).toBeNull();
    });

    it("should return processing for event being processed", () => {
      const eventId = "evt_status_processing";
      markEventProcessing(eventId);

      expect(getEventStatus(eventId)).toBe("processing");
    });

    it("should return completed for completed event", () => {
      const eventId = "evt_status_completed";
      markEventProcessing(eventId);
      markEventCompleted(eventId);

      expect(getEventStatus(eventId)).toBe("completed");
    });
  });

  describe("getProcessedEventCount", () => {
    it("should return 0 when no events are tracked", () => {
      expect(getProcessedEventCount()).toBe(0);
    });

    it("should return correct count after adding events", () => {
      markEventProcessing("evt_1");
      markEventProcessing("evt_2");
      markEventProcessing("evt_3");

      expect(getProcessedEventCount()).toBe(3);
    });

    it("should decrease count after failed events are removed", () => {
      markEventProcessing("evt_a");
      markEventProcessing("evt_b");
      markEventFailed("evt_a");

      expect(getProcessedEventCount()).toBe(1);
    });
  });

  describe("concurrent event handling", () => {
    it("should prevent duplicate processing of the same event", () => {
      const eventId = "evt_concurrent";

      // Simulate two concurrent requests
      const firstLock = markEventProcessing(eventId);
      const secondLock = markEventProcessing(eventId);

      expect(firstLock).toBe(true);
      expect(secondLock).toBe(false);
    });

    it("should handle multiple different events independently", () => {
      const events = ["evt_a", "evt_b", "evt_c"];

      const results = events.map((id) => markEventProcessing(id));

      expect(results).toEqual([true, true, true]);
      expect(getProcessedEventCount()).toBe(3);
    });
  });

  describe("TTL expiration", () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    describe("isEventProcessed with expired events", () => {
      it("should return false for expired events", () => {
        const eventId = "evt_expired_check";

        // Mark event as processing
        markEventProcessing(eventId);
        expect(isEventProcessed(eventId)).toBe(true);

        // Advance time past TTL
        vi.advanceTimersByTime(EVENT_TTL_MS + 1000);

        // Expired event should return false and be cleaned up
        expect(isEventProcessed(eventId)).toBe(false);
      });

      it("should clean up expired event when checking", () => {
        const eventId = "evt_cleanup_on_check";

        markEventProcessing(eventId);
        expect(getProcessedEventCount()).toBe(1);

        // Advance time past TTL
        vi.advanceTimersByTime(EVENT_TTL_MS + 1);

        // Check triggers cleanup
        isEventProcessed(eventId);
        expect(getProcessedEventCount()).toBe(0);
      });

      it("should return true for event just before TTL expires", () => {
        const eventId = "evt_almost_expired";

        markEventProcessing(eventId);

        // Advance time to just before TTL
        vi.advanceTimersByTime(EVENT_TTL_MS - 1000);

        // Should still be valid
        expect(isEventProcessed(eventId)).toBe(true);
      });
    });

    describe("getEventStatus with expired events", () => {
      it("should return null for expired events", () => {
        const eventId = "evt_status_expired";

        markEventProcessing(eventId);
        markEventCompleted(eventId);
        expect(getEventStatus(eventId)).toBe("completed");

        // Advance time past TTL
        vi.advanceTimersByTime(EVENT_TTL_MS + 1);

        // Expired event should return null
        expect(getEventStatus(eventId)).toBeNull();
      });

      it("should clean up expired event when getting status", () => {
        const eventId = "evt_status_cleanup";

        markEventProcessing(eventId);
        expect(getProcessedEventCount()).toBe(1);

        // Advance time past TTL
        vi.advanceTimersByTime(EVENT_TTL_MS + 1);

        // Getting status triggers cleanup
        getEventStatus(eventId);
        expect(getProcessedEventCount()).toBe(0);
      });

      it("should return status for event just before TTL expires", () => {
        const eventId = "evt_status_almost_expired";

        markEventProcessing(eventId);
        markEventCompleted(eventId);

        // Advance time to just before TTL
        vi.advanceTimersByTime(EVENT_TTL_MS - 1000);

        // Should still be valid
        expect(getEventStatus(eventId)).toBe("completed");
      });
    });

    describe("TTL boundary conditions", () => {
      it("should expire at exactly TTL", () => {
        const eventId = "evt_exact_ttl";

        markEventProcessing(eventId);

        // Advance time to exactly TTL + 1ms (just past boundary)
        vi.advanceTimersByTime(EVENT_TTL_MS + 1);

        expect(isEventProcessed(eventId)).toBe(false);
      });

      it("should not expire at exactly TTL - 1", () => {
        const eventId = "evt_just_before_ttl";

        markEventProcessing(eventId);

        // Advance time to just before TTL
        vi.advanceTimersByTime(EVENT_TTL_MS - 1);

        expect(isEventProcessed(eventId)).toBe(true);
      });

      it("should refresh timestamp on completion", () => {
        const eventId = "evt_refresh_timestamp";

        markEventProcessing(eventId);

        // Advance time halfway to TTL
        vi.advanceTimersByTime(EVENT_TTL_MS / 2);

        // Complete the event (refreshes timestamp)
        markEventCompleted(eventId);

        // Advance time another half TTL
        vi.advanceTimersByTime(EVENT_TTL_MS / 2);

        // Should still be valid because timestamp was refreshed
        expect(isEventProcessed(eventId)).toBe(true);
        expect(getEventStatus(eventId)).toBe("completed");

        // Now advance past the remaining TTL
        vi.advanceTimersByTime(EVENT_TTL_MS / 2 + 1);

        // Now it should be expired
        expect(isEventProcessed(eventId)).toBe(false);
      });
    });
  });
});
