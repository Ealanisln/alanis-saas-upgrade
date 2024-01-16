import { formatAmountForDisplay } from "@/lib/utils/stripe-helpers";

export default function CustomDonationInput({
  name,
  currency,
  onChange,
  value,
  className,
}: {
  name: string;
  min: number;
  max: number;
  currency: string;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: number;
  className?: string;
}): JSX.Element {
  return (
    <label>
      <input
        type="range"
        name={name}
        onChange={onChange}
        value={value}
        className={className}
      ></input>
    </label>
  );
}
