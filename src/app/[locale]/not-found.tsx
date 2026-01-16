import { PageNotFound } from "@/components/ui/PageNotFound";

export const metadata = {
  title: "Page Not Found | Alanis Dev",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
  return <PageNotFound />;
}
