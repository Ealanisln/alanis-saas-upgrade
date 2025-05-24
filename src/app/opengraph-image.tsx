import { generateOGImage, routeConfigs, size, contentType } from "@/lib/og-utils";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "Alanis - Web Developer";
export { size, contentType };

// Image generation
export default function Image() {
  return generateOGImage(routeConfigs.home);
} 