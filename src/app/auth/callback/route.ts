import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    `https://${request.headers.get("x-forwarded-host") || request.headers.get("host")}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${siteUrl}/dashboard`);
    }
  }

  return NextResponse.redirect(`${siteUrl}/login?error=auth`);
}
