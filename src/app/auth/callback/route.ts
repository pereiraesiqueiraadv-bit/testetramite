import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  const forwardedHost = request.headers.get("x-forwarded-host");
  const host = request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  const origin =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (forwardedHost ? `${proto}://${forwardedHost}` : `${proto}://${host}`);

  if (code) {
    const redirectUrl = new URL("/onboarding", origin);
    const response = NextResponse.redirect(redirectUrl);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return response;
    }
    console.error("Auth callback error:", error.message);
  }

  return NextResponse.redirect(new URL("/login?error=auth", origin));
}
