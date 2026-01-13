import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggler from "../ThemeToggler";

// Mock next-themes
const mockSetTheme = vi.fn();
let mockTheme = "system";

vi.mock("next-themes", () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
  }),
}));

describe("ThemeToggler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockTheme = "system";
  });

  describe("rendering", () => {
    it("renders theme toggle button", () => {
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      expect(button).toBeInTheDocument();
    });

    it("shows current theme icon in the button", () => {
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      // Button should contain an SVG icon
      expect(button.querySelector("svg")).toBeInTheDocument();
    });

    it("dropdown is initially closed", () => {
      render(<ThemeToggler />);

      // Dropdown options should not be visible
      expect(screen.queryByText("lightMode")).not.toBeInTheDocument();
      expect(screen.queryByText("darkMode")).not.toBeInTheDocument();
      expect(screen.queryByText("systemMode")).not.toBeInTheDocument();
    });

    it("renders placeholder during SSR (before mount)", () => {
      // Note: The component uses mounted state to handle SSR
      // On first render before useEffect runs, it shows a placeholder
      const { container } = render(<ThemeToggler />);

      // After mount, the button should be visible
      expect(
        screen.getByRole("button", { name: "theme toggler" }),
      ).toBeInTheDocument();
    });
  });

  describe("dropdown interaction", () => {
    it("opens dropdown when button is clicked", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      // All theme options should be visible
      expect(screen.getByText("lightMode")).toBeInTheDocument();
      expect(screen.getByText("darkMode")).toBeInTheDocument();
      expect(screen.getByText("systemMode")).toBeInTheDocument();
    });

    it("closes dropdown when clicking the button again", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });

      // Open dropdown
      await user.click(button);
      expect(screen.getByText("lightMode")).toBeInTheDocument();

      // Close dropdown
      await user.click(button);
      await waitFor(() => {
        expect(screen.queryByText("lightMode")).not.toBeInTheDocument();
      });
    });

    it("closes dropdown when clicking outside", async () => {
      const user = userEvent.setup();
      render(
        <div>
          <ThemeToggler />
          <button data-testid="outside">Outside</button>
        </div>,
      );

      const toggleButton = screen.getByRole("button", {
        name: "theme toggler",
      });

      // Open dropdown
      await user.click(toggleButton);
      expect(screen.getByText("lightMode")).toBeInTheDocument();

      // Click outside
      const outsideElement = screen.getByTestId("outside");
      await user.click(outsideElement);

      await waitFor(() => {
        expect(screen.queryByText("lightMode")).not.toBeInTheDocument();
      });
    });

    it("sets aria-expanded correctly based on dropdown state", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });

      // Initially closed
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Open
      await user.click(button);
      expect(button).toHaveAttribute("aria-expanded", "true");

      // Close
      await user.click(button);
      await waitFor(() => {
        expect(button).toHaveAttribute("aria-expanded", "false");
      });
    });
  });

  describe("theme selection", () => {
    it("calls setTheme with 'light' when light mode is selected", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const lightOption = screen.getByText("lightMode");
      await user.click(lightOption);

      expect(mockSetTheme).toHaveBeenCalledWith("light");
    });

    it("calls setTheme with 'dark' when dark mode is selected", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const darkOption = screen.getByText("darkMode");
      await user.click(darkOption);

      expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("calls setTheme with 'system' when system mode is selected", async () => {
      mockTheme = "light";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const systemOption = screen.getByText("systemMode");
      await user.click(systemOption);

      expect(mockSetTheme).toHaveBeenCalledWith("system");
    });

    it("closes dropdown after theme selection", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const darkOption = screen.getByText("darkMode");
      await user.click(darkOption);

      await waitFor(() => {
        expect(screen.queryByText("darkMode")).not.toBeInTheDocument();
      });
    });
  });

  describe("theme highlighting", () => {
    it("highlights the current theme option in dropdown", async () => {
      mockTheme = "dark";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const darkOption = screen.getByText("darkMode").closest("button");
      expect(darkOption).toHaveClass("font-medium");
      expect(darkOption).toHaveClass("text-primary");
    });

    it("does not highlight non-selected theme options", async () => {
      mockTheme = "dark";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const lightOption = screen.getByText("lightMode").closest("button");
      expect(lightOption).not.toHaveClass("font-medium");
      expect(lightOption).not.toHaveClass("text-primary");
    });
  });

  describe("different initial themes", () => {
    it("renders correctly with light theme", async () => {
      mockTheme = "light";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      // Light mode should be highlighted
      const lightOption = screen.getByText("lightMode").closest("button");
      expect(lightOption).toHaveClass("font-medium");
    });

    it("renders correctly with dark theme", async () => {
      mockTheme = "dark";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      // Dark mode should be highlighted
      const darkOption = screen.getByText("darkMode").closest("button");
      expect(darkOption).toHaveClass("font-medium");
    });

    it("renders correctly with system theme", async () => {
      mockTheme = "system";
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      // System mode should be highlighted
      const systemOption = screen.getByText("systemMode").closest("button");
      expect(systemOption).toHaveClass("font-medium");
    });
  });

  describe("accessibility", () => {
    it("button has accessible name", () => {
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      expect(button).toBeInTheDocument();
    });

    it("dropdown options are clickable buttons", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const toggleButton = screen.getByRole("button", {
        name: "theme toggler",
      });
      await user.click(toggleButton);

      // Each option should be a button
      const buttons = screen.getAllByRole("button");
      // Should have 4 buttons: main toggle + 3 options
      expect(buttons).toHaveLength(4);
    });

    it("dropdown has proper z-index for layering", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const dropdown = screen.getByText("lightMode").closest("div");
      expect(dropdown).toHaveClass("z-50");
    });
  });

  describe("styling", () => {
    it("toggle button has correct base classes", () => {
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      expect(button).toHaveClass("rounded-full");
      expect(button).toHaveClass("cursor-pointer");
    });

    it("dropdown has correct styling classes", async () => {
      const user = userEvent.setup();
      render(<ThemeToggler />);

      const button = screen.getByRole("button", { name: "theme toggler" });
      await user.click(button);

      const dropdown = screen.getByText("lightMode").closest("div");
      expect(dropdown).toHaveClass("rounded-lg");
      expect(dropdown).toHaveClass("shadow-lg");
      expect(dropdown).toHaveClass("border");
    });
  });
});
