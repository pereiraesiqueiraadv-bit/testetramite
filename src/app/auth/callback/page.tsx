"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState("Autenticando...");

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        setStatus("Login realizado! Redirecionando...");
        window.location.href = "/onboarding";
      }
    });

    // Fallback: check if already signed in after a moment
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        window.location.href = "/onboarding";
      } else {
        setStatus("Erro na autenticação. Tente novamente.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      }
    }, 3000);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10">
          <svg className="animate-spin h-6 w-6 text-accent" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
        <p className="text-muted">{status}</p>
      </div>
    </div>
  );
}
