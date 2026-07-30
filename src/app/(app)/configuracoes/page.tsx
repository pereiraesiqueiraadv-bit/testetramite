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
    "flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-colors";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold">Configuracoes</h1>
        <p className="text-muted text-sm mt-1">
          Gerencie areas, fases, categorias e equipe do escritorio.
        </p>
      </div>

      <div className="border-b border-border">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-accent text-accent"
                  : "border-transparent text-muted hover:text-foreground hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        {activeTab === "areas" && (
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1 space-y-2">
                <label htmlFor="nova-area" className="block text-sm font-medium">
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
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>

            {areas.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">
                Nenhuma area cadastrada.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {areas.map((area) => (
                  <li key={area.id} className="py-3 px-1 text-sm">
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
                <label htmlFor="nova-fase" className="block text-sm font-medium">
                  Nova fase
                </label>
                <input
                  id="nova-fase"
                  type="text"
                  value={novaFase}
                  onChange={(e) => setNovaFase(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addFase()}
                  placeholder="Ex: Petição Inicial"
                  className={inputClass}
                />
              </div>
              <button
                onClick={addFase}
                disabled={loadingAdd || !novaFase.trim()}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>

            {fases.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">
                Nenhuma fase cadastrada.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {fases.map((fase) => (
                  <li
                    key={fase.id}
                    className="py-3 px-1 text-sm flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-muted w-8">
                        #{fase.ordem}
                      </span>
                      <span>{fase.nome}</span>
                    </div>
                    {fase.encerra && (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
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
                  className="block text-sm font-medium"
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
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white hover:bg-accent-dark transition-colors disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>

            {categorias.length === 0 ? (
              <p className="text-sm text-muted py-4 text-center">
                Nenhuma categoria cadastrada.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {categorias.map((cat) => (
                  <li key={cat.id} className="py-3 px-1 text-sm">
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
              <p className="text-sm text-muted py-4 text-center">
                Nenhum membro na equipe.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-3 pr-6 text-left font-medium text-muted">
                        Nome
                      </th>
                      <th className="py-3 pr-6 text-left font-medium text-muted">
                        Papel
                      </th>
                      <th className="py-3 pr-6 text-center font-medium text-muted">
                        Financeiro
                      </th>
                      <th className="py-3 pr-6 text-center font-medium text-muted">
                        Config.
                      </th>
                      <th className="py-3 text-left font-medium text-muted">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-3 pr-6">{u.nome}</td>
                        <td className="py-3 pr-6 capitalize text-muted">
                          {u.papel}
                        </td>
                        <td className="py-3 pr-6 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              u.pode_financeiro
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {u.pode_financeiro ? "Sim" : "Nao"}
                          </span>
                        </td>
                        <td className="py-3 pr-6 text-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              u.pode_config
                                ? "bg-green-50 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {u.pode_config ? "Sim" : "Nao"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              u.ativo
                                ? "bg-green-50 text-green-700"
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
