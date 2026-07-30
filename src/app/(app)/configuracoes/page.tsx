"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Area {
  id: string;
  nome: string;
}

interface Fase {
  id: string;
  nome: string;
  ordem: number;
  encerra: boolean;
}

interface Categoria {
  id: string;
  nome: string;
}

interface Usuario {
  id: string;
  nome: string;
  papel: string;
  pode_financeiro: boolean;
  pode_config: boolean;
  ativo: boolean;
}

type Tab = "areas" | "fases" | "categorias" | "equipe";

/* ---- SVG Icons ---- */

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function HashIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="4" y1="15" x2="20" y2="15" />
      <line x1="10" y1="3" x2="8" y2="21" />
      <line x1="16" y1="3" x2="14" y2="21" />
    </svg>
  );
}

function FlagIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
  );
}

/* ---- Tab icon map ---- */

const tabIcons: Record<Tab, typeof FolderIcon> = {
  areas: FolderIcon,
  fases: LayersIcon,
  categorias: TagIcon,
  equipe: UsersIcon,
};

export default function ConfiguracoesPage() {
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>("areas");

  const [areas, setAreas] = useState<Area[]>([]);
  const [fases, setFases] = useState<Fase[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  const [novaArea, setNovaArea] = useState("");
  const [novaFase, setNovaFase] = useState("");
  const [novaCategoria, setNovaCategoria] = useState("");

  const [loadingAdd, setLoadingAdd] = useState(false);

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchAll() {
    const [areasRes, fasesRes, categoriasRes, usuariosRes] = await Promise.all([
      supabase.from("areas").select("id, nome").order("nome"),
      supabase
        .from("fases")
        .select("id, nome, ordem, encerra")
        .order("ordem"),
      supabase
        .from("categorias_financeiras")
        .select("id, nome")
        .order("nome"),
      supabase
        .from("usuarios")
        .select("id, nome, papel, pode_financeiro, pode_config, ativo")
        .order("nome"),
    ]);

    if (areasRes.data) setAreas(areasRes.data);
    if (fasesRes.data) setFases(fasesRes.data);
    if (categoriasRes.data) setCategorias(categoriasRes.data);
    if (usuariosRes.data) setUsuarios(usuariosRes.data);
  }

  async function addArea() {
    if (!novaArea.trim()) return;
    setLoadingAdd(true);
    const { data, error } = await supabase
      .from("areas")
      .insert({ nome: novaArea.trim() })
      .select("id, nome")
      .single();
    if (!error && data) {
      setAreas((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNovaArea("");
    }
    setLoadingAdd(false);
  }

  async function addFase() {
    if (!novaFase.trim()) return;
    setLoadingAdd(true);
    const maxOrdem = fases.length > 0 ? Math.max(...fases.map((f) => f.ordem)) : 0;
    const { data, error } = await supabase
      .from("fases")
      .insert({ nome: novaFase.trim(), ordem: maxOrdem + 1, encerra: false })
      .select("id, nome, ordem, encerra")
      .single();
    if (!error && data) {
      setFases((prev) => [...prev, data]);
      setNovaFase("");
    }
    setLoadingAdd(false);
  }

  async function addCategoria() {
    if (!novaCategoria.trim()) return;
    setLoadingAdd(true);
    const { data, error } = await supabase
      .from("categorias_financeiras")
      .insert({ nome: novaCategoria.trim() })
      .select("id, nome")
      .single();
    if (!error && data) {
      setCategorias((prev) => [...prev, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNovaCategoria("");
    }
    setLoadingAdd(false);
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "areas", label: "Areas" },
    { key: "fases", label: "Fases" },
    { key: "categorias", label: "Categorias Financeiras" },
    { key: "equipe", label: "Equipe" },
  ];

  const inputClass =
    "flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-colors";

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-accent/10">
          <SettingsIcon className="text-accent" />
        </div>
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">
            Configuracoes
          </h1>
          <p className="text-muted text-sm mt-0.5">
            Gerencie areas, fases, categorias e equipe do escritorio.
          </p>
        </div>
      </div>

      {/* Tab bar */}
      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.key];
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 text-sm border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-accent text-accent font-semibold"
                    : "border-transparent text-muted hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="rounded-xl border border-border bg-card shadow-card p-6">
        {activeTab === "areas" && (
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="nova-area" className="block text-[13px] font-medium text-muted uppercase tracking-wider">
                  Nova area
                </label>
                <input
                  id="nova-area"
                  type="text"
                  value={novaArea}
                  onChange={(e) => setNovaArea(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addArea()}
                  placeholder="Ex: Trabalhista"
                  className={inputClass}
                />
              </div>
              <button
                onClick={addArea}
                disabled={loadingAdd || !novaArea.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                <PlusIcon className="shrink-0" />
                Adicionar
              </button>
            </div>

            {areas.length === 0 ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <FolderIcon className="text-accent" />
                </div>
                <p className="text-sm font-medium">Nenhuma area cadastrada</p>
                <p className="text-sm text-muted mt-1">
                  Adicione areas para organizar os processos do escritorio.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {areas.map((area) => (
                  <li
                    key={area.id}
                    className="flex items-center gap-3 py-3.5 px-2 text-sm rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <FolderIcon className="shrink-0 text-muted w-4 h-4" />
                    {area.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "fases" && (
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="nova-fase" className="block text-[13px] font-medium text-muted uppercase tracking-wider">
                  Nova fase
                </label>
                <input
                  id="nova-fase"
                  type="text"
                  value={novaFase}
                  onChange={(e) => setNovaFase(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFase()}
                  placeholder="Ex: Peticao Inicial"
                  className={inputClass}
                />
              </div>
              <button
                onClick={addFase}
                disabled={loadingAdd || !novaFase.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                <PlusIcon className="shrink-0" />
                Adicionar
              </button>
            </div>

            {fases.length === 0 ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <LayersIcon className="text-accent" />
                </div>
                <p className="text-sm font-medium">Nenhuma fase cadastrada</p>
                <p className="text-sm text-muted mt-1">
                  Adicione fases para definir o fluxo dos processos.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {fases.map((fase) => (
                  <li
                    key={fase.id}
                    className="flex items-center justify-between py-3.5 px-2 text-sm rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-accent/10 font-mono text-xs font-semibold text-accent">
                        {fase.ordem}
                      </span>
                      <span>{fase.nome}</span>
                    </div>
                    {fase.encerra && (
                      <span className="inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                        <FlagIcon className="w-3.5 h-3.5" />
                        Encerra
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "categorias" && (
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label
                  htmlFor="nova-categoria"
                  className="block text-[13px] font-medium text-muted uppercase tracking-wider"
                >
                  Nova categoria financeira
                </label>
                <input
                  id="nova-categoria"
                  type="text"
                  value={novaCategoria}
                  onChange={(e) => setNovaCategoria(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCategoria()}
                  placeholder="Ex: Honorarios"
                  className={inputClass}
                />
              </div>
              <button
                onClick={addCategoria}
                disabled={loadingAdd || !novaCategoria.trim()}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                <PlusIcon className="shrink-0" />
                Adicionar
              </button>
            </div>

            {categorias.length === 0 ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <TagIcon className="text-accent" />
                </div>
                <p className="text-sm font-medium">Nenhuma categoria cadastrada</p>
                <p className="text-sm text-muted mt-1">
                  Adicione categorias para classificar receitas e despesas.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {categorias.map((cat) => (
                  <li
                    key={cat.id}
                    className="flex items-center gap-3 py-3.5 px-2 text-sm rounded-lg hover:bg-card-hover transition-colors"
                  >
                    <TagIcon className="shrink-0 text-muted w-4 h-4" />
                    {cat.nome}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {activeTab === "equipe" && (
          <div className="space-y-4">
            {usuarios.length === 0 ? (
              <div className="py-10 flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 mb-4">
                  <UsersIcon className="text-accent" />
                </div>
                <p className="text-sm font-medium">Nenhum membro na equipe</p>
                <p className="text-sm text-muted mt-1">
                  Os membros da equipe aparecerao aqui apos serem convidados.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-6 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="py-3 pr-6 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                        Papel
                      </th>
                      <th className="py-3 pr-6 text-center text-[13px] font-medium text-muted uppercase tracking-wider">
                        Financeiro
                      </th>
                      <th className="py-3 pr-6 text-center text-[13px] font-medium text-muted uppercase tracking-wider">
                        Config.
                      </th>
                      <th className="py-3 text-left text-[13px] font-medium text-muted uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {usuarios.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-card-hover transition-colors"
                      >
                        <td className="py-3.5 pr-6 font-medium">{u.nome}</td>
                        <td className="py-3.5 pr-6 capitalize text-muted">
                          {u.papel}
                        </td>
                        <td className="py-3.5 pr-6 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                              u.pode_financeiro
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {u.pode_financeiro ? (
                              <CheckIcon className="w-3.5 h-3.5" />
                            ) : (
                              <XIcon className="w-3.5 h-3.5" />
                            )}
                            {u.pode_financeiro ? "Sim" : "Nao"}
                          </span>
                        </td>
                        <td className="py-3.5 pr-6 text-center">
                          <span
                            className={`inline-flex items-center justify-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                              u.pode_config
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {u.pode_config ? (
                              <CheckIcon className="w-3.5 h-3.5" />
                            ) : (
                              <XIcon className="w-3.5 h-3.5" />
                            )}
                            {u.pode_config ? "Sim" : "Nao"}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${
                              u.ativo
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {u.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
