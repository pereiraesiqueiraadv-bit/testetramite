import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

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
    { label: "Clientes", valor: totalClientes ?? 0, icon: "👥" },
    { label: "Processos", valor: totalProcessos ?? 0, icon: "⚖️" },
    { label: "Acordos", valor: totalAcordos ?? 0, icon: "🤝" },
    { label: "Eventos", valor: totalEventos ?? 0, icon: "📅" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Dashboard</h1>
        <p className="text-muted text-sm mt-1">
          Visão geral do seu escritório.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-border bg-card p-6"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{kpi.icon}</span>
              <div>
                <p className="text-sm text-muted">{kpi.label}</p>
                <p className="font-heading text-2xl font-bold">{kpi.valor}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <p className="text-muted">
          Cadastre seus primeiros clientes e processos para ver os dados aqui.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <a
            href="/clientes"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            Cadastrar cliente
          </a>
          <a
            href="/processos"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-card-hover"
          >
            Cadastrar processo
          </a>
        </div>
      </div>
    </div>
  );
}
