"use client";

import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface SidebarProps {
  usuario: {
    nome: string;
    papel: string;
    pode_financeiro: boolean;
    pode_config: boolean;
  };
  nomeEscritorio: string;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: "/clientes",
    label: "Clientes",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/processos",
    label: "Processos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    href: "/acordos",
    label: "Acordos",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/agenda",
    label: "Agenda",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    href: "/audiencias",
    label: "Audiencias",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 20h20" />
        <path d="M5 20V8l7-5 7 5v12" />
        <path d="M10 20v-6h4v6" />
        <path d="M9 12h6" />
      </svg>
    ),
  },
];

const papelLabel: Record<string, string> = {
  socio: "Socio",
  advogado: "Advogado",
  estagiario: "Estagiario",
};

export function Sidebar({ usuario, nomeEscritorio }: SidebarProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const allItems = [
    ...navItems,
    ...(usuario.pode_financeiro
      ? [
          {
            href: "/financeiro",
            label: "Financeiro",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23" />
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            ),
          },
        ]
      : []),
    ...(usuario.pode_config
      ? [
          {
            href: "/configuracoes",
            label: "Configuracoes",
            icon: (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar flex flex-col z-50">
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M3 12h18M3 18h18" />
              <path d="M8 6v12M16 6v12" />
            </svg>
          </div>
          <div>
            <h1 className="font-heading text-base font-bold text-white tracking-tight">Tramite</h1>
            <p className="text-[11px] text-sidebar-muted truncate max-w-[140px]">{nomeEscritorio}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {allItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-active text-white shadow-sm"
                  : "text-sidebar-muted hover:bg-sidebar-hover hover:text-white"
              }`}
            >
              <span className={isActive ? "text-accent-light" : ""}>{item.icon}</span>
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium text-sidebar-muted transition-all duration-150 hover:bg-sidebar-hover hover:text-white"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>

      <div className="border-t border-white/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-active flex items-center justify-center text-xs font-semibold text-accent-light">
            {usuario.nome.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-medium text-white truncate">{usuario.nome}</p>
            <p className="text-[11px] text-sidebar-muted">{papelLabel[usuario.papel] || usuario.papel}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
