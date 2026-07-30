import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (forwardedHost ? `${proto}://${forwardedHost}` : `${proto}://${host}`);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${siteUrl}/onboarding`);
    }
    console.error("Auth callback error:", error.message);
  }

  return NextResponse.redirect(`${siteUrl}/login?error=auth`);
}
