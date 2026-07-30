import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatHora(hora: string | null) {
  if (!hora) return null;
  return hora.slice(0, 5);
}

export default async function AudienciasPage() {
  const supabase = await createClient();

  const { data: audiencias } = await supabase
    .from("eventos")
    .select(
      "id, titulo, data, hora, observacao, cliente_id, processo_id, clientes(nome), processos(numero_cnj)"
    )
    .eq("tipo", "audiencia")
    .order("data", { ascending: false })
    .order("hora", { ascending: true });

  const grouped: Record<string, typeof audiencias> = {};
  if (audiencias) {
    for (const aud of audiencias) {
      const key = aud.data;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(aud);
    }
  }

  const sortedDates = Object.keys(grouped).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Audiencias</h1>
          <p className="text-muted text-sm mt-1">
            Todas as audiencias agendadas.
          </p>
        </div>
        <Link
          href="/agenda/novo"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Nova audiencia
        </Link>
      </div>

      {sortedDates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted text-sm">
            Nenhuma audiencia cadastrada ainda.
          </p>
          <Link
            href="/agenda/novo"
            className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Cadastrar primeira audiencia
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.map((date) => (
            <div key={date}>
              <h2 className="font-heading text-sm font-semibold text-muted uppercase tracking-wide mb-3">
                {formatDate(date)}
              </h2>
              <div className="space-y-3">
                {grouped[date]!.map((aud) => {
                  const clienteNome =
                    aud.clientes && !Array.isArray(aud.clientes)
                      ? (aud.clientes as { nome: string }).nome
                      : null;
                  const processoCnj =
                    aud.processos && !Array.isArray(aud.processos)
                      ? (aud.processos as { numero_cnj: string }).numero_cnj
                      : null;

                  return (
                    <div
                      key={aud.id}
                      className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium truncate">
                              {aud.titulo}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                              Audiencia
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            {formatHora(aud.hora) && (
                              <span className="font-mono">
                                {formatHora(aud.hora)}
                              </span>
                            )}
                            {clienteNome && <span>{clienteNome}</span>}
                            {processoCnj && (
                              <span className="font-mono text-xs">
                                {processoCnj}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
