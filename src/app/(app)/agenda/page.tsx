import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const TIPO_CONFIG: Record<
  string,
  { label: string; badge: string; border: string }
> = {
  prazo_fatal: {
    label: "Prazo Fatal",
    badge: "bg-red-50 text-red-700",
    border: "border-l-red-500",
  },
  audiencia: {
    label: "Audiencia",
    badge: "bg-purple-50 text-purple-700",
    border: "border-l-purple-500",
  },
  reuniao: {
    label: "Reuniao",
    badge: "bg-blue-50 text-blue-700",
    border: "border-l-blue-500",
  },
  diligencia: {
    label: "Diligencia",
    badge: "bg-emerald-50 text-emerald-700",
    border: "border-l-emerald-500",
  },
};

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

function CalendarEmptyIcon() {
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
      <line x1="10" y1="14" x2="14" y2="18" />
      <line x1="14" y1="14" x2="10" y2="18" />
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

export default async function AgendaPage() {
  const supabase = await createClient();

  const { data: eventos } = await supabase
    .from("eventos")
    .select("id, titulo, tipo, data, hora, observacao, cliente_id, clientes(nome)")
    .order("data", { ascending: false })
    .order("hora", { ascending: true });

  const grouped: Record<string, typeof eventos> = {};
  if (eventos) {
    for (const evento of eventos) {
      const key = evento.data;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(evento);
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
            Agenda
          </h1>
          <p className="text-muted text-sm mt-1">
            Todos os eventos do escritorio.
          </p>
        </div>
        <Link
          href="/agenda/novo"
          className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          <PlusIcon />
          Novo evento
        </Link>
      </div>

      {sortedDates.length === 0 ? (
        /* Empty state */
        <div className="rounded-xl border border-border bg-card shadow-card p-16 text-center">
          <div className="flex justify-center mb-4">
            <CalendarEmptyIcon />
          </div>
          <h2 className="font-heading text-lg font-semibold tracking-tight mb-1">
            Nenhum evento cadastrado
          </h2>
          <p className="text-muted text-sm mb-6 max-w-sm mx-auto">
            Adicione prazos, audiencias, reunioes e diligencias para manter o
            controle da sua agenda.
          </p>
          <Link
            href="/agenda/novo"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            <PlusIcon />
            Cadastrar primeiro evento
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
                {grouped[date]!.map((evento) => {
                  const tipo = TIPO_CONFIG[evento.tipo] ?? {
                    label: evento.tipo,
                    badge: "bg-gray-50 text-gray-700",
                    border: "border-l-gray-400",
                  };
                  const clienteNome =
                    evento.clientes &&
                    !Array.isArray(evento.clientes)
                      ? (evento.clientes as { nome: string }).nome
                      : null;

                  return (
                    <div
                      key={evento.id}
                      className={`rounded-xl border border-border bg-card shadow-card p-5 border-l-4 ${tipo.border} hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium truncate">
                              {evento.titulo}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ${tipo.badge}`}
                            >
                              {tipo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            {formatHora(evento.hora) && (
                              <span className="inline-flex items-center gap-1.5 font-mono">
                                <ClockIcon />
                                {formatHora(evento.hora)}
                              </span>
                            )}
                            {clienteNome && (
                              <span className="inline-flex items-center gap-1.5">
                                <UserIcon />
                                {clienteNome}
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
