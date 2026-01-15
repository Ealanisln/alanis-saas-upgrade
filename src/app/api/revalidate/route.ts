import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

// Secret to validate requests from Sanity
const SANITY_REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  try {
    // If no secret is configured, reject all requests
    if (!SANITY_REVALIDATE_SECRET) {
      return NextResponse.json(
        { message: "Missing SANITY_REVALIDATE_SECRET environment variable" },
        { status: 500 },
      );
    }

    // Parse and validate the webhook payload
    const { isValidSignature, body } = await parseBody<{
      _type: string;
      slug?: { current?: string };
    }>(req, SANITY_REVALIDATE_SECRET);

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Bad request: missing _type" },
        { status: 400 },
      );
    }

    // Revalidate based on document type
    const revalidatedPaths: string[] = [];

    if (body._type === "post") {
      // Revalidate blog listing pages for all locales
      revalidatePath("/en/blog");
      revalidatePath("/es/blog");
      revalidatedPaths.push("/en/blog", "/es/blog");

      // If we have a slug, also revalidate the specific post page
      if (body.slug?.current) {
        revalidatePath(`/en/blog/${body.slug.current}`);
        revalidatePath(`/es/blog/${body.slug.current}`);
        revalidatedPaths.push(
          `/en/blog/${body.slug.current}`,
          `/es/blog/${body.slug.current}`,
        );
      }
    }

    // Add more document types here as needed
    // if (body._type === "project") { ... }

    return NextResponse.json({
      revalidated: true,
      paths: revalidatedPaths,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 },
    );
  }
}
