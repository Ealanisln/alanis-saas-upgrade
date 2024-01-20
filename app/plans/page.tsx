import Pricing from "@/components/Pricing";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Alanis | Web Developer",
};

export default function DonatePage(): JSX.Element {
  return (
    <Pricing />
  );
}
