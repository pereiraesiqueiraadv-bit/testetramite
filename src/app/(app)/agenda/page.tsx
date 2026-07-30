import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const TIPO_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  prazo_fatal: { label: "Prazo Fatal", bg: "bg-red-100", text: "text-red-700" },
  audiencia: { label: "Audiencia", bg: "bg-purple-100", text: "text-purple-700" },
  reuniao: { label: "Reuniao", bg: "bg-blue-100", text: "text-blue-700" },
  diligencia: { label: "Diligencia", bg: "bg-green-100", text: "text-green-700" },
};

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold">Agenda</h1>
          <p className="text-muted text-sm mt-1">
            Todos os eventos do escritorio.
          </p>
        </div>
        <Link
          href="/agenda/novo"
          className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
        >
          Novo evento
        </Link>
      </div>

      {sortedDates.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <p className="text-muted text-sm">
            Nenhum evento cadastrado ainda.
          </p>
          <Link
            href="/agenda/novo"
            className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark transition-colors"
          >
            Cadastrar primeiro evento
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
                {grouped[date]!.map((evento) => {
                  const tipo = TIPO_CONFIG[evento.tipo] ?? {
                    label: evento.tipo,
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                  };
                  const clienteNome =
                    evento.clientes &&
                    !Array.isArray(evento.clientes)
                      ? (evento.clientes as { nome: string }).nome
                      : null;

                  return (
                    <div
                      key={evento.id}
                      className="rounded-xl border border-border bg-card p-5 hover:bg-card-hover transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="font-medium truncate">
                              {evento.titulo}
                            </h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tipo.bg} ${tipo.text}`}
                            >
                              {tipo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted">
                            {formatHora(evento.hora) && (
                              <span className="font-mono">
                                {formatHora(evento.hora)}
                              </span>
                            )}
                            {clienteNome && <span>{clienteNome}</span>}
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
