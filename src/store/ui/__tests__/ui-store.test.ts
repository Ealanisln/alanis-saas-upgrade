import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "../ui-store";

describe("useUIStore", () => {
  // Reset store state before each test
  beforeEach(() => {
    // Get the store and reset to initial state
    const store = useUIStore.getState();
    store.closeSideMenu();
  });

  describe("initial state", () => {
    it("should have isSideMenuOpen as false initially", () => {
      const state = useUIStore.getState();
      expect(state.isSideMenuOpen).toBe(false);
    });

    it("should have openSideMenu action defined", () => {
      const state = useUIStore.getState();
      expect(typeof state.openSideMenu).toBe("function");
    });

    it("should have closeSideMenu action defined", () => {
      const state = useUIStore.getState();
      expect(typeof state.closeSideMenu).toBe("function");
    });
  });

  describe("openSideMenu action", () => {
    it("should set isSideMenuOpen to true", () => {
      const store = useUIStore.getState();
      expect(store.isSideMenuOpen).toBe(false);

      store.openSideMenu();

      const updatedState = useUIStore.getState();
      expect(updatedState.isSideMenuOpen).toBe(true);
    });

    it("should remain true when called multiple times", () => {
      const store = useUIStore.getState();

      store.openSideMenu();
      store.openSideMenu();
      store.openSideMenu();

      const updatedState = useUIStore.getState();
      expect(updatedState.isSideMenuOpen).toBe(true);
    });
  });

  describe("closeSideMenu action", () => {
    it("should set isSideMenuOpen to false", () => {
      const store = useUIStore.getState();
      store.openSideMenu();
      expect(useUIStore.getState().isSideMenuOpen).toBe(true);

      store.closeSideMenu();

      const updatedState = useUIStore.getState();
      expect(updatedState.isSideMenuOpen).toBe(false);
    });

    it("should remain false when called on already closed menu", () => {
      const store = useUIStore.getState();
      expect(store.isSideMenuOpen).toBe(false);

      store.closeSideMenu();

      const updatedState = useUIStore.getState();
      expect(updatedState.isSideMenuOpen).toBe(false);
    });
  });

  describe("toggle behavior", () => {
    it("should correctly toggle between open and closed states", () => {
      const store = useUIStore.getState();

      // Start closed
      expect(store.isSideMenuOpen).toBe(false);

      // Open
      store.openSideMenu();
      expect(useUIStore.getState().isSideMenuOpen).toBe(true);

      // Close
      store.closeSideMenu();
      expect(useUIStore.getState().isSideMenuOpen).toBe(false);

      // Open again
      store.openSideMenu();
      expect(useUIStore.getState().isSideMenuOpen).toBe(true);
    });
  });

  describe("store subscription", () => {
    it("should notify subscribers when state changes", () => {
      const states: boolean[] = [];

      // Subscribe to store changes
      const unsubscribe = useUIStore.subscribe((state) => {
        states.push(state.isSideMenuOpen);
      });

      const store = useUIStore.getState();
      store.openSideMenu();
      store.closeSideMenu();
      store.openSideMenu();

      unsubscribe();

      // Should have recorded all state changes
      expect(states).toEqual([true, false, true]);
    });
  });

  describe("store export", () => {
    it("should be importable from store index", async () => {
      const storeModule = await import("@/store");
      expect(storeModule.useUIStore).toBeDefined();
      expect(typeof storeModule.useUIStore).toBe("function");
    });
  });
});
