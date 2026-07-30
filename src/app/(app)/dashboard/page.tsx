import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("nome")
    .limit(1)
    .single();

  const [
    { count: totalClientes },
    { count: totalProcessos },
    { count: totalAcordos },
    { count: totalEventos },
  ] = await Promise.all([
    supabase.from("clientes").select("*", { count: "exact", head: true }),
    supabase.from("processos").select("*", { count: "exact", head: true }),
    supabase.from("acordos").select("*", { count: "exact", head: true }),
    supabase.from("eventos").select("*", { count: "exact", head: true }),
  ]);

  const kpis = [
    {
      label: "Clientes",
      valor: totalClientes ?? 0,
      href: "/clientes",
      color: "text-blue-600 bg-blue-50",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Processos",
      valor: totalProcessos ?? 0,
      href: "/processos",
      color: "text-accent bg-amber-50",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      label: "Acordos",
      valor: totalAcordos ?? 0,
      href: "/acordos",
      color: "text-emerald-600 bg-emerald-50",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      ),
    },
    {
      label: "Eventos",
      valor: totalEventos ?? 0,
      href: "/agenda",
      color: "text-purple-600 bg-purple-50",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
  ];

  const firstName = usuario?.nome?.split(" ")[0] || "Usuario";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          {greeting}, {firstName}
        </h1>
        <p className="text-muted text-sm mt-1">
          Aqui esta o resumo do seu escritorio.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <a
            key={kpi.label}
            href={kpi.href}
            className="group rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-200 hover:shadow-card-hover hover:border-accent/30"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium text-muted">{kpi.label}</p>
                <p className="font-heading text-3xl font-bold mt-1 tracking-tight">{kpi.valor}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg ${kpi.color} flex items-center justify-center`}>
                {kpi.icon}
              </div>
            </div>
            <div className="mt-3 flex items-center text-[12px] text-muted opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Ver todos</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-1">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>
          </a>
        ))}
      </div>

      {(totalClientes ?? 0) === 0 && (totalProcessos ?? 0) === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-card">
          <div className="mx-auto w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <h3 className="font-heading text-lg font-semibold mb-2">Comece por aqui</h3>
          <p className="text-muted text-sm max-w-md mx-auto">
            Cadastre seus primeiros clientes e processos para ver os dados do seu escritorio.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <a
              href="/clientes/novo"
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo cliente
            </a>
            <a
              href="/processos/novo"
              className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-card-hover"
            >
              Novo processo
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
