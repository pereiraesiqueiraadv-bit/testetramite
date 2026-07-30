"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Option = { id: string; label: string };

function ArrowLeftIcon() {
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
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function AlertCircleIcon() {
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
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function SaveIcon() {
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
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  );
}

function LoaderIcon() {
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
      className="animate-spin"
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  );
}

export default function NovoEventoPage() {
  const router = useRouter();
  const supabase = createClient();

  const [clientes, setClientes] = useState<Option[]>([]);
  const [processos, setProcessos] = useState<Option[]>([]);
  const [usuarios, setUsuarios] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState("reuniao");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [clienteId, setClienteId] = useState("");
  const [processoId, setProcessoId] = useState("");
  const [responsavelId, setResponsavelId] = useState("");
  const [observacao, setObservacao] = useState("");

  useEffect(() => {
    async function fetchOptions() {
      const [resClientes, resProcessos, resUsuarios] = await Promise.all([
        supabase.from("clientes").select("id, nome").order("nome"),
        supabase.from("processos").select("id, numero_cnj").order("numero_cnj"),
        supabase.from("usuarios").select("id, nome").order("nome"),
      ]);

      if (resClientes.data) {
        setClientes(resClientes.data.map((c) => ({ id: c.id, label: c.nome })));
      }
      if (resProcessos.data) {
        setProcessos(
          resProcessos.data.map((p) => ({ id: p.id, label: p.numero_cnj }))
        );
      }
      if (resUsuarios.data) {
        setUsuarios(resUsuarios.data.map((u) => ({ id: u.id, label: u.nome })));
      }
    }

    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: insertError } = await supabase.from("eventos").insert({
      titulo,
      tipo,
      data,
      hora: hora || null,
      cliente_id: clienteId || null,
      processo_id: processoId || null,
      responsavel_id: responsavelId || null,
      observacao: observacao || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/agenda");
  }

  const inputClasses =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors";

  return (
    <div className="max-w-2xl space-y-6">
      {/* Back link and header */}
      <div>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon />
          Voltar para a agenda
        </Link>
        <h1 className="font-heading text-2xl font-bold tracking-tight mt-3">
          Novo evento
        </h1>
        <p className="text-muted text-sm mt-1">
          Preencha os dados do evento abaixo.
        </p>
      </div>

      {/* Form card */}
      <div className="rounded-xl border border-border bg-card shadow-card p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <span className="mt-0.5 shrink-0">
                <AlertCircleIcon />
              </span>
              <span>{error}</span>
            </div>
          )}

          {/* Titulo */}
          <div>
            <label htmlFor="titulo" className="block text-sm font-medium mb-1.5">
              Titulo *
            </label>
            <input
              id="titulo"
              type="text"
              required
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className={inputClasses}
              placeholder="Ex: Audiencia de instrucao"
            />
          </div>

          {/* Tipo */}
          <div>
            <label htmlFor="tipo" className="block text-sm font-medium mb-1.5">
              Tipo
            </label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className={inputClasses}
            >
              <option value="reuniao">Reuniao</option>
              <option value="audiencia">Audiencia</option>
              <option value="prazo_fatal">Prazo Fatal</option>
              <option value="diligencia">Diligencia</option>
            </select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="data" className="block text-sm font-medium mb-1.5">
                Data *
              </label>
              <input
                id="data"
                type="date"
                required
                value={data}
                onChange={(e) => setData(e.target.value)}
                className={`${inputClasses} font-mono`}
              />
            </div>
            <div>
              <label htmlFor="hora" className="block text-sm font-medium mb-1.5">
                Hora
              </label>
              <input
                id="hora"
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                className={`${inputClasses} font-mono`}
              />
            </div>
          </div>

          {/* Cliente */}
          <div>
            <label htmlFor="cliente" className="block text-sm font-medium mb-1.5">
              Cliente
            </label>
            <select
              id="cliente"
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className={inputClasses}
            >
              <option value="">Nenhum</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Processo */}
          <div>
            <label htmlFor="processo" className="block text-sm font-medium mb-1.5">
              Processo
            </label>
            <select
              id="processo"
              value={processoId}
              onChange={(e) => setProcessoId(e.target.value)}
              className={inputClasses}
            >
              <option value="">Nenhum</option>
              {processos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Responsavel */}
          <div>
            <label htmlFor="responsavel" className="block text-sm font-medium mb-1.5">
              Responsavel
            </label>
            <select
              id="responsavel"
              value={responsavelId}
              onChange={(e) => setResponsavelId(e.target.value)}
              className={inputClasses}
            >
              <option value="">Nenhum</option>
              {usuarios.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.label}
                </option>
              ))}
            </select>
          </div>

          {/* Observacao */}
          <div>
            <label htmlFor="observacao" className="block text-sm font-medium mb-1.5">
              Observacao
            </label>
            <textarea
              id="observacao"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className={`${inputClasses} resize-none`}
              placeholder="Anotacoes sobre o evento..."
            />
          </div>

          {/* Acoes */}
          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50 transition-colors"
            >
              {loading ? <LoaderIcon /> : <SaveIcon />}
              {loading ? "Salvando..." : "Salvar evento"}
            </button>
            <Link
              href="/agenda"
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-card-hover transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
