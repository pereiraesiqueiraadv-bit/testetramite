import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: usuario } = await supabase
      .from("usuarios")
      .select("id")
      .eq("auth_user_id", user.id)
      .single();

    if (usuario) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
            >
              <path d="M4 7V4a2 2 0 0 1 2-2h8.5L20 7.5V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M5 12h10" />
              <path d="M5 16h7" />
            </svg>
          </div>
          <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">
            Trâmite
          </h1>
          <p className="text-muted text-lg">
            Gestão completa para escritórios de advocacia
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-left sm:grid-cols-3">
          {[
            { icon: "👥", label: "Clientes" },
            { icon: "⚖️", label: "Processos" },
            { icon: "🤝", label: "Acordos" },
            { icon: "📅", label: "Agenda" },
            { icon: "💰", label: "Financeiro" },
            { icon: "📊", label: "Dashboard" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-xl bg-card border border-border p-4"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        <div className="space-y-4 pt-4">
          <a
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-accent px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
          >
            Entrar no sistema
          </a>
          <p className="text-muted text-sm">
            Gerencie seu escritório com segurança e praticidade.
          </p>
        </div>

        <footer className="pt-12 text-muted text-xs">
          © 2024 Trâmite. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
}
