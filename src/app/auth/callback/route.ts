import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error_description") || searchParams.get("error");

  if (errorParam) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorParam)}`, origin)
    );
  }

  if (code) {
    const response = NextResponse.redirect(new URL("/onboarding", origin));

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
              request.cookies.set(name, value);
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
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error.message)}`, origin)
    );
  }

  return NextResponse.redirect(new URL("/login?error=sem+codigo", origin));
}
