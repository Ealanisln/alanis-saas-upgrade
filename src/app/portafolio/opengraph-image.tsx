import { generateOGImage, routeConfigs, size, contentType } from "@/lib/og-utils";

// Route segment config
export const runtime = "edge";

// Image metadata
export const alt = "portafolio - Alanis Dev";
export { size, contentType };

// Image generation
export default function Image() {
  return generateOGImage(routeConfigs.portafolio);
} 