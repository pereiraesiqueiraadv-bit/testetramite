import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

function CalendarIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function FileTextIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function GavelEmptyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function capitalizeFirst(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
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
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Audiencias
          </h1>
          <p className="text-muted text-sm mt-1">
            Todas as audiencias agendadas.
          </p>
        </div>
        <Link
          href="/agenda/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          <PlusIcon />
          Nova audiencia
        </Link>
      </div>

      {sortedDates.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-border bg-card shadow-card p-16 text-center">
          <div className="flex justify-center mb-4">
            <GavelEmptyIcon />
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-tight mb-1">
            Nenhuma audiencia cadastrada
          </h2>
          <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
            Cadastre audiencias para acompanhar datas, horarios e processos
            relacionados.
          </p>
          <Link
            href="/agenda/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            <PlusIcon />
            Cadastrar primeira audiencia
          </Link>
        </div>
      ) : (
        <div className="space-y-10">
          {sortedDates.map((date) => (
            <div key={date}>
              {/* Date group header */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-muted">
                  <CalendarIcon />
                </span>
                <h2 className="font-heading text-sm font-semibold text-muted uppercase tracking-wide">
                  {capitalizeFirst(formatDate(date))}
                </h2>
              </div>

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
                      className="rounded-xl border border-border bg-card shadow-card p-5 border-l-4 border-l-purple-500 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium truncate">
                              {aud.titulo}
                            </h3>
                            <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 whitespace-nowrap">
                              Audiencia
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            {formatHora(aud.hora) && (
                              <span className="inline-flex items-center gap-1.5 font-mono">
                                <ClockIcon />
                                {formatHora(aud.hora)}
                              </span>
                            )}
                            {clienteNome && (
                              <span className="inline-flex items-center gap-1.5">
                                <UserIcon />
                                {clienteNome}
                              </span>
                            )}
                            {processoCnj && (
                              <span className="inline-flex items-center gap-1.5 font-mono text-xs">
                                <FileTextIcon />
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
