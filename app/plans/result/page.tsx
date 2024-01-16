import PlanDetails from "@/components/Plans";
import Plans from "@/components/Plans";

export default async function ResultPage({
  searchParams,
}: {
  searchParams: { session_id: string };
}): Promise<JSX.Element> {
  if (!searchParams.session_id)
    throw new Error("Please provide a valid session_id (`cs_test_...`)");

  return (
    <div className="">
      <PlanDetails searchParams={searchParams} />
    </div>
  );
}

