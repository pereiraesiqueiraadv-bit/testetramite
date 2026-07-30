import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, nome, papel, pode_financeiro, pode_config, escritorio_id")
    .eq("auth_user_id", user.id)
    .single();

  if (!usuario) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 border-r border-border bg-card p-6 flex flex-col">
        <div className="mb-8">
          <h1 className="font-heading text-xl font-bold">Trâmite</h1>
        </div>

        <nav className="flex-1 space-y-1">
          {[
            { href: "/dashboard", label: "Dashboard", icon: "📊" },
            { href: "/clientes", label: "Clientes", icon: "👥" },
            { href: "/processos", label: "Processos", icon: "⚖️" },
            { href: "/acordos", label: "Acordos", icon: "🤝" },
            { href: "/agenda", label: "Agenda", icon: "📅" },
            { href: "/audiencias", label: "Audiências", icon: "🏛️" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-background"
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ))}

          {usuario.pode_financeiro && (
            <a
              href="/financeiro"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-background"
            >
              <span>💰</span>
              Financeiro
            </a>
          )}

          {usuario.pode_config && (
            <a
              href="/configuracoes"
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-background"
            >
              <span>⚙️</span>
              Configurações
            </a>
          )}
        </nav>

        <div className="border-t border-border pt-4">
          <p className="text-sm font-medium truncate">{usuario.nome}</p>
          <p className="text-xs text-muted capitalize">{usuario.papel}</p>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
