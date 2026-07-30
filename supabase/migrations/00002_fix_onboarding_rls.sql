-- Permitir que a função de onboarding funcione corretamente.
-- A função criar_escritorio_e_seeds já roda com SECURITY DEFINER,
-- então ela bypassa o RLS. Mas precisamos permitir que usuários
-- autenticados sem escritório consigam chamar a função.

-- Permitir INSERT em escritorios para usuários autenticados
-- (o RLS padrão bloqueia porque o usuário novo não tem escritorio_id ainda)
create policy "usuario_pode_criar_escritorio" on escritorios
  for insert with check (true);

-- Permitir INSERT em usuarios para usuários autenticados
create policy "usuario_pode_se_registrar" on usuarios
  for insert with check (auth_user_id = auth.uid());

-- Permitir INSERT nas tabelas de seed (áreas, fases, categorias)
-- para a função de onboarding que roda com SECURITY DEFINER
-- Essas policies são para o caso de inserções diretas
create policy "pode_inserir_areas" on areas
  for insert with check (true);

create policy "pode_inserir_fases" on fases
  for insert with check (true);

create policy "pode_inserir_categorias" on categorias_financeiras
  for insert with check (true);
