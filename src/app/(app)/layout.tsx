import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "./sidebar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, nome, papel, pode_financeiro, pode_config, escritorio_id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!usuario) {
    redirect("/onboarding");
  }

  const { data: escritorio } = await supabase
    .from("escritorios")
    .select("nome")
    .eq("id", usuario.escritorio_id)
    .single();

  return (
    <div className="min-h-screen flex">
      <Sidebar
        usuario={usuario}
        nomeEscritorio={escritorio?.nome || "Meu Escritório"}
      />
      <main className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
