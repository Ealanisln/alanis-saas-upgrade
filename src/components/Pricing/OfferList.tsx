const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-primary dark:text-primary"
  >
    <path
      d="M13.3334 4L6.00002 11.3333L2.66669 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CrossIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    className="text-gray-400 dark:text-gray-500"
  >
    <path
      d="M12 4L4 12M4 4L12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const OfferList = ({
  text,
  status,
}: {
  text: string;
  status: "active" | "inactive";
}) => {
  return (
    <div className="flex items-start gap-3 py-1.5">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
        {status === "active" ? <CheckIcon /> : <CrossIcon />}
      </span>
      <p
        className={`text-sm ${
          status === "active"
            ? "text-gray-700 dark:text-gray-300"
            : "text-gray-400 line-through dark:text-gray-500"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

export default OfferList;
