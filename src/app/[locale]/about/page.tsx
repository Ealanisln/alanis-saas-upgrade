import { redirect } from "@/lib/navigation";

// The redesign folds About into the single-page portfolio (/#about);
// this route survives only to keep old indexed URLs working.
export default async function AboutRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/#about", locale });
}
