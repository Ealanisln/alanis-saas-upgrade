// Section header pattern: numbered accent eyebrow + display H2.
export const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-accent md:text-[13px]">
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
