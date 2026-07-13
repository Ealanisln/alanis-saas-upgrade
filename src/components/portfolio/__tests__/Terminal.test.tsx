import { render, screen, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Terminal from "../Terminal";

// next-intl is mocked in vitest.setup.ts: t(key) echoes the key, so output
// lines render as "term1" etc. — the typed commands themselves are literals.

describe("Terminal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the window chrome before typing starts", () => {
    render(<Terminal />);
    expect(screen.getByText("termUser")).toBeInTheDocument();
    expect(screen.queryByText(/whoami/)).not.toBeInTheDocument();
  });

  it("types the first command after the initial delay", () => {
    render(<Terminal />);
    act(() => {
      // 0ms reset + 600ms start + 6 chars × 52ms
      vi.advanceTimersByTime(600 + 6 * 52 + 100);
    });
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
  });

  it("replays the whole script to the done state with a blinking cursor", () => {
    const { container } = render(<Terminal />);
    act(() => {
      vi.advanceTimersByTime(30_000);
    });
    // All three commands typed
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
    expect(screen.getByText(/cat stack\.txt/)).toBeInTheDocument();
    expect(screen.getByText(/\.\/status --production/)).toBeInTheDocument();
    // All output lines shown (mocked translations echo their keys)
    expect(screen.getByText("term1")).toBeInTheDocument();
    expect(screen.getByText("term2a")).toBeInTheDocument();
    expect(screen.getByText("term2b")).toBeInTheDocument();
    expect(screen.getByText("term3")).toBeInTheDocument();
    // Done state: blinking cursor on the trailing prompt
    expect(container.querySelector(".animate-blink")).not.toBeNull();
  });

  it("leaves no pending timers after unmount", () => {
    const { unmount } = render(<Terminal />);
    act(() => {
      vi.advanceTimersByTime(700); // mid-typing
    });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    // Nothing left to fire → no post-unmount setState
    act(() => {
      vi.runAllTimers();
    });
  });
});
