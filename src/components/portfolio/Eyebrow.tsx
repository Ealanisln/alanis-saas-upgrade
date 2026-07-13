// Shared 1080px section shell — every portfolio section uses this exact
// padding rhythm (56px mobile / clamp desktop), so keep it in one place.
export const SECTION_CONTAINER =
  "mx-auto max-w-[1080px] px-5 py-14 md:px-6 md:py-[clamp(64px,9vw,112px)]";

// Section header pattern: numbered accent eyebrow + display H2.
export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold tracking-[0.08em] text-accent uppercase md:text-[13px]">
    {children}
  </p>
);

export const SectionTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <h2
    className={`mt-2.5 text-[26px] font-bold tracking-[-0.02em] md:mt-3 md:text-[clamp(28px,3.6vw,38px)] ${className}`}
  >
    {children}
  </h2>
);
