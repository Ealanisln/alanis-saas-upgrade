import { redirect } from "@/lib/navigation";

// The redesign folds Contact into the single-page portfolio (/#contact);
// this route survives only to keep old indexed URLs working.
export default async function ContactRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect({ href: "/#contact", locale });
}
