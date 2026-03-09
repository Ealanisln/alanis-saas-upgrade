interface Props {
  title: string;
  subtitle?: string;
  className?: string;
}

const Title = ({ title, subtitle, className }: Props) => {
  return (
    <div className={`mt-3 ${className}`}>
      <h1 className="my-6 font-heading text-4xl font-semibold text-t-text antialiased">
        {title}
      </h1>
      {subtitle && <h3 className="mb-5 text-xl text-t-muted">{subtitle}</h3>}
    </div>
  );
};

export default Title;
