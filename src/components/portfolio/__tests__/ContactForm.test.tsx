import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ContactForm from "../ContactForm";

// next-intl is mocked in vitest.setup.ts: t(key) echoes the key, so notes
// render as "fNotePlain" / "fSuccess" / "errSend" / "errVerify".

const { mockSubmitContact, turnstileProps, mockTurnstileReset } = vi.hoisted(
  () => ({
    mockSubmitContact: vi.fn(),
    // Latest props the mocked Turnstile widget rendered with, so tests can
    // drive onSuccess/onExpire and observe the ref wiring
    turnstileProps: { current: null as Record<string, unknown> | null },
    mockTurnstileReset: vi.fn(),
  }),
);

vi.mock("@/app/actions/contact", () => ({
  submitContact: mockSubmitContact,
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ resolvedTheme: "light" }),
}));

vi.mock("@marsidev/react-turnstile", () => ({
  // React 19 passes ref as a regular prop to function components
  Turnstile: (props: Record<string, unknown>) => {
    turnstileProps.current = props;
    const ref = props.ref as { current: unknown } | undefined;
    if (ref) ref.current = { reset: mockTurnstileReset };
    return <div data-testid="turnstile-widget" />;
  },
}));

async function fillAndSubmit() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("fName"), "Jane Doe");
  await user.type(screen.getByLabelText("fEmail"), "jane@example.com");
  await user.type(screen.getByLabelText("fMessage"), "Hello there");
  await user.click(screen.getByRole("button", { name: "fSend" }));
  return user;
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the fields and the idle note", () => {
    render(<ContactForm />);
    expect(screen.getByLabelText("fName")).toBeInTheDocument();
    expect(screen.getByLabelText("fEmail")).toBeInTheDocument();
    expect(screen.getByLabelText("fMessage")).toBeInTheDocument();
    // No site key in the test env, so the honest no-Turnstile note renders
    expect(screen.getByText("fNotePlain")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "fSend" })).toBeEnabled();
  });

  it("hides the Turnstile widget when no site key is configured", () => {
    render(<ContactForm />);
    expect(screen.queryByTestId("turnstile-widget")).not.toBeInTheDocument();
  });

  it("submits through the server action, resets the form, and shows success", async () => {
    mockSubmitContact.mockResolvedValue({ ok: true });
    render(<ContactForm />);

    await fillAndSubmit();

    expect(mockSubmitContact).toHaveBeenCalledWith({
      name: "Jane Doe",
      email: "jane@example.com",
      message: "Hello there",
      locale: "en",
      turnstileToken: undefined,
    });
    expect(await screen.findByText("fSuccess")).toBeInTheDocument();
    expect(screen.getByLabelText("fName")).toHaveValue("");
    expect(screen.getByLabelText("fEmail")).toHaveValue("");
    expect(screen.getByLabelText("fMessage")).toHaveValue("");
  });

  it("shows the sending label and disables the button while in flight", async () => {
    let resolveSubmit: (value: { ok: true }) => void = () => {};
    mockSubmitContact.mockReturnValue(
      new Promise((resolve) => {
        resolveSubmit = resolve;
      }),
    );
    render(<ContactForm />);

    await fillAndSubmit();

    const button = screen.getByRole("button", { name: "fSending" });
    expect(button).toBeDisabled();

    resolveSubmit({ ok: true });
    expect(await screen.findByText("fSuccess")).toBeInTheDocument();
  });

  it("shows the send error and keeps the input when the action reports a failure", async () => {
    mockSubmitContact.mockResolvedValue({ ok: false, code: "send" });
    render(<ContactForm />);

    await fillAndSubmit();

    expect(await screen.findByText("errSend")).toBeInTheDocument();
    // A failed submission must not wipe what the visitor typed
    expect(screen.getByLabelText("fMessage")).toHaveValue("Hello there");
  });

  it("shows the verification error when the action reports a Turnstile failure", async () => {
    mockSubmitContact.mockResolvedValue({ ok: false, code: "verification" });
    render(<ContactForm />);

    await fillAndSubmit();

    expect(await screen.findByText("errVerify")).toBeInTheDocument();
  });

  it("shows the send error when the server action throws", async () => {
    mockSubmitContact.mockRejectedValue(new Error("network"));
    render(<ContactForm />);

    await fillAndSubmit();

    expect(await screen.findByText("errSend")).toBeInTheDocument();
  });

  it("ignores a second submit while one is in flight", async () => {
    let resolveSubmit: (value: { ok: true }) => void = () => {};
    mockSubmitContact.mockReturnValue(
      new Promise((resolve) => {
        resolveSubmit = resolve;
      }),
    );
    render(<ContactForm />);

    await fillAndSubmit();
    // Enter-key submits bypass the disabled button, so hit the form directly
    fireEvent.submit(
      screen.getByRole("button", { name: "fSending" }).closest("form")!,
    );

    expect(mockSubmitContact).toHaveBeenCalledTimes(1);
    resolveSubmit({ ok: true });
    expect(await screen.findByText("fSuccess")).toBeInTheDocument();
  });

  it("recovers from an error state on a successful retry", async () => {
    mockSubmitContact.mockResolvedValueOnce({ ok: false, code: "send" });
    mockSubmitContact.mockResolvedValueOnce({ ok: true });
    render(<ContactForm />);

    const user = await fillAndSubmit();
    expect(await screen.findByText("errSend")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "fSend" }));
    expect(await screen.findByText("fSuccess")).toBeInTheDocument();
  });
});

describe("ContactForm with Turnstile configured", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    turnstileProps.current = null;
    // The site key is read into a module-level const, so re-import the
    // component after stubbing the env
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "test-site-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  async function renderConfigured() {
    const { default: ConfiguredForm } = await import("../ContactForm");
    render(<ConfiguredForm />);
  }

  it("renders the widget and the Turnstile note", async () => {
    await renderConfigured();

    expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    expect(screen.getByText("fNote")).toBeInTheDocument();
  });

  it("blocks submission without a token and never calls the action", async () => {
    await renderConfigured();

    await fillAndSubmit();

    expect(await screen.findByText("errVerify")).toBeInTheDocument();
    expect(mockSubmitContact).not.toHaveBeenCalled();
  });

  it("passes the solved token to the action and resets the widget after", async () => {
    mockSubmitContact.mockResolvedValue({ ok: true });
    await renderConfigured();

    act(() => {
      (turnstileProps.current?.onSuccess as (t: string) => void)("tok-42");
    });
    await fillAndSubmit();

    expect(mockSubmitContact).toHaveBeenCalledWith(
      expect.objectContaining({ turnstileToken: "tok-42" }),
    );
    expect(await screen.findByText("fSuccess")).toBeInTheDocument();
    // Tokens are single-use — the widget must reissue after a submission
    expect(mockTurnstileReset).toHaveBeenCalled();
  });
});
