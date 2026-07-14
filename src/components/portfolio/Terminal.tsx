"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type TermItem = { cmd: string } | { out: string[]; status?: boolean };

// Locale-independent command literals; output lines come from translations.
const COMMANDS = ["whoami", "cat stack.txt", "./status --production"] as const;

interface TermState {
  i: number;
  chars: number;
  done: boolean;
}

const Cursor = ({ blinking }: { blinking: boolean }) => (
  <span
    className={`ml-0.5 inline-block h-3.5 w-[7px] bg-[#5B8AF5] align-text-bottom md:h-[15px] md:w-2 ${
      blinking ? "animate-blink" : ""
    }`}
  />
);

/**
 * Hero terminal card — replays the reference typing script:
 * whoami → stack.txt → ./status --production, 52ms/char, staggered output.
 */
const Terminal = () => {
  const t = useTranslations("portfolio.hero");
  const locale = useLocale();
  const [st, setSt] = useState<TermState>({ i: 0, chars: 0, done: false });
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const script: TermItem[] = [
    { cmd: COMMANDS[0] },
    { out: [t("term1")] },
    { cmd: COMMANDS[1] },
    { out: [t("term2a"), t("term2b")] },
    { cmd: COMMANDS[2] },
    { out: [t("term3")], status: true },
  ];
  const scriptLength = script.length;

  useEffect(() => {
    // Item shapes/lengths are static across locales, so the advance loop only
    // depends on scriptLength; the rendered text swaps live via translations.
    // Commands sit at even indexes; output items type nothing.
    const cmdLengths = COMMANDS.flatMap((cmd) => [cmd.length, 0]);

    const advance = (state: TermState) => {
      if (state.i >= scriptLength) {
        setSt({ ...state, done: true });
        return;
      }
      const isCmd = state.i % 2 === 0;
      if (isCmd && state.chars < cmdLengths[state.i]) {
        const next = { ...state, chars: state.chars + 1 };
        setSt(next);
        timer.current = setTimeout(() => advance(next), 52);
      } else if (isCmd) {
        timer.current = setTimeout(() => {
          const next = { i: state.i + 1, chars: 0, done: false };
          setSt(next);
          timer.current = setTimeout(() => advance(next), 80);
        }, 420);
      } else {
        const next = { i: state.i + 1, chars: 0, done: false };
        setSt(next);
        timer.current = setTimeout(() => advance(next), 300);
      }
    };

    const initial = { i: 0, chars: 0, done: false };
    // async reset so a locale toggle restarts the replay (reference behavior)
    // without a synchronous setState inside the effect body
    timer.current = setTimeout(() => {
      setSt(initial);
      timer.current = setTimeout(() => advance(initial), 600);
    }, 0);
    return () => clearTimeout(timer.current);
  }, [scriptLength, locale]);

  const rows: React.ReactNode[] = [];
  for (let k = 0; k < script.length; k++) {
    const item = script[k];
    if ("cmd" in item) {
      if (k > st.i) break;
      const active = k === st.i && !st.done;
      const text = active ? item.cmd.slice(0, st.chars) : item.cmd;
      rows.push(
        <div key={k}>
          <span className="text-[#5B8AF5]">$ </span>
          {text}
          {active && <Cursor blinking={false} />}
        </div>,
      );
    } else {
      if (k >= st.i) break;
      item.out.forEach((line, j) => {
        rows.push(
          <div key={`${k}-${j}`}>
            {item.status && j === 0 && (
              <span className="text-[#34D399]">● </span>
            )}
            <span className="text-[#F2F4F8]">{line}</span>
          </div>,
        );
      });
    }
  }
  if (st.done) {
    rows.push(
      <div key="end">
        <span className="text-[#5B8AF5]">$ </span>
        <Cursor blinking />
      </div>,
    );
  }

  return (
    <div
      // Decorative: the typed content duplicates the hero/skills copy, and a
      // partially-typed frame is noise for screen readers.
      aria-hidden="true"
      className="fade-up overflow-hidden rounded-[14px] border border-[var(--term-line)] bg-[#0F1115] shadow-[0_18px_40px_rgba(22,24,29,0.16)] md:shadow-[0_24px_48px_rgba(22,24,29,0.18)]"
      style={{ "--fade-delay": "0.32s" } as React.CSSProperties}
    >
      <div className="flex items-center gap-2 border-b border-[#262B36] bg-[#171A21] px-3.5 py-[11px] md:px-4 md:py-3">
        <span className="size-[9px] rounded-full bg-[#F87171] md:size-2.5" />
        <span className="size-[9px] rounded-full bg-[#FBBF24] md:size-2.5" />
        <span className="size-[9px] rounded-full bg-[#34D399] md:size-2.5" />
        <span className="ml-[7px] font-mono text-[11px] text-[#7A8397] md:ml-2 md:text-[11.5px]">
          {t("termUser")}
        </span>
      </div>
      <div className="min-h-[200px] px-[18px] pt-4 pb-5 font-mono text-xs leading-[2.05] text-[#C4CAD6] md:min-h-[224px] md:px-[22px] md:pt-5 md:pb-6 md:text-[13px]">
        {rows}
      </div>
    </div>
  );
};

export default Terminal;
