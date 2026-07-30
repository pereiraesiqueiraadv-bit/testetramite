-- ============================================================
-- Trâmite — Migração principal: todas as tabelas + RLS + seeds
-- ============================================================

-- 3.1 Escritórios
create table escritorios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  nome text not null,
  plano text default 'trial',
  trial_expira_em timestamptz
);

-- 3.2 Usuários (perfil; auth fica no Supabase Auth)
create table usuarios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  auth_user_id uuid unique not null references auth.users(id),
  escritorio_id uuid not null references escritorios(id),
  nome text not null,
  papel text not null check (papel in ('socio', 'advogado', 'estagiario')),
  pode_financeiro boolean default true,
  pode_config boolean default false,
  ativo boolean default true
);

-- 3.3 Áreas
create table areas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  nome text not null
);

-- 3.4 Teses
create table teses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  area_id uuid not null references areas(id),
  nome text not null
);

-- 3.5 Fases (funil do processo, ordenável)
create table fases (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  nome text not null,
  ordem int not null,
  encerra boolean default false
);

-- 3.6 Clientes
create table clientes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  nome text not null,
  cpf_cnpj text,
  telefone text,
  email text,
  area_id uuid references areas(id),
  tese_id uuid references teses(id),
  parte_contraria text,
  status text default 'prospeccao' check (status in ('prospeccao', 'ativo', 'encerrado')),
  pct_exito numeric default 30,
  pct_sucumbencia numeric default 0
);

-- 3.7 Processos
create table processos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  cliente_id uuid not null references clientes(id),
  numero_cnj text not null,
  juizo text,
  fase_id uuid references fases(id),
  distribuido_em date,
  valor_causa numeric default 0,
  chance_exito numeric default 0.5
);

-- 3.8 Acordos
create table acordos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  cliente_id uuid not null references clientes(id),
  processo_id uuid references processos(id),
  parte_contraria text,
  telefone_parte text,
  data_acordo date,
  valor numeric not null,
  pct_honorarios numeric default 30,
  num_parcelas int default 1,
  status text default 'negociacao' check (status in ('negociacao', 'fechado', 'homologado', 'quitado'))
);

-- 3.9 Contatos de negociação
create table contatos_negociacao (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  acordo_id uuid not null references acordos(id),
  data_contato date not null,
  meio text check (meio in ('whatsapp', 'ligacao', 'email', 'presencial')),
  resultado text check (resultado in ('sem_retorno', 'retornou_analise', 'contraproposta', 'aceita', 'negada')),
  observacao text
);

-- 3.10 Parcelas
create table parcelas (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  acordo_id uuid not null references acordos(id),
  numero int not null,
  vencimento date not null,
  valor numeric not null,
  status text default 'prevista' check (status in ('prevista', 'recebida', 'vencida'))
);

-- 3.11 Eventos (agenda)
create table eventos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  titulo text not null,
  tipo text check (tipo in ('prazo_fatal', 'audiencia', 'reuniao', 'diligencia')),
  data date not null,
  hora time,
  cliente_id uuid references clientes(id),
  processo_id uuid references processos(id),
  observacao text,
  responsavel_id uuid references usuarios(id)
);

-- 3.12 Categorias financeiras
create table categorias_financeiras (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  nome text not null
);

-- 3.13 Lançamentos (financeiro)
create table lancamentos (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  escritorio_id uuid not null references escritorios(id),
  data date,
  descricao text,
  categoria_id uuid references categorias_financeiras(id),
  tipo text not null check (tipo in ('receita', 'despesa')),
  valor numeric not null,
  status text default 'realizado' check (status in ('realizado', 'previsto')),
  acordo_id uuid references acordos(id),
  parcela_id uuid references parcelas(id)
);


-- ============================================================
-- ROW LEVEL SECURITY — isolamento por escritório
-- ============================================================

-- Função auxiliar: retorna o escritorio_id do usuário logado
create or replace function public.get_meu_escritorio_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select escritorio_id from public.usuarios
  where auth_user_id = auth.uid()
$$;

-- Escritórios: cada usuário vê só o próprio
alter table escritorios enable row level security;
create policy "usuario_ve_proprio_escritorio" on escritorios
  for all using (
    id = public.get_meu_escritorio_id()
  );

-- Usuários: vê apenas colegas do mesmo escritório
alter table usuarios enable row level security;
create policy "escritorio_isolado" on usuarios
  for all using (
    escritorio_id = public.get_meu_escritorio_id()
  );

-- Macro para as demais tabelas
alter table areas enable row level security;
create policy "escritorio_isolado" on areas
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table teses enable row level security;
create policy "escritorio_isolado" on teses
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table fases enable row level security;
create policy "escritorio_isolado" on fases
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table clientes enable row level security;
create policy "escritorio_isolado" on clientes
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table processos enable row level security;
create policy "escritorio_isolado" on processos
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table acordos enable row level security;
create policy "escritorio_isolado" on acordos
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table contatos_negociacao enable row level security;
create policy "escritorio_isolado" on contatos_negociacao
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table parcelas enable row level security;
create policy "escritorio_isolado" on parcelas
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table eventos enable row level security;
create policy "escritorio_isolado" on eventos
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table categorias_financeiras enable row level security;
create policy "escritorio_isolado" on categorias_financeiras
  for all using (escritorio_id = public.get_meu_escritorio_id());

alter table lancamentos enable row level security;
create policy "escritorio_isolado" on lancamentos
  for all using (escritorio_id = public.get_meu_escritorio_id());

-- Proteção extra: estagiário não vê lançamentos
create policy "estagiario_sem_financeiro" on lancamentos
  for select using (
    exists (
      select 1 from public.usuarios
      where auth_user_id = auth.uid()
        and pode_financeiro = true
    )
  );


-- ============================================================
-- FUNÇÃO DE ONBOARDING: cria escritório + seeds no primeiro acesso
-- ============================================================
create or replace function public.criar_escritorio_e_seeds(
  p_nome_escritorio text,
  p_nome_usuario text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_escritorio_id uuid;
  v_area_ids uuid[];
  v_area_id uuid;
begin
  -- Criar escritório com trial de 7 dias
  insert into public.escritorios (nome, plano, trial_expira_em)
  values (p_nome_escritorio, 'trial', now() + interval '7 days')
  returning id into v_escritorio_id;

  -- Criar usuário sócio
  insert into public.usuarios (auth_user_id, escritorio_id, nome, papel, pode_financeiro, pode_config)
  values (auth.uid(), v_escritorio_id, p_nome_usuario, 'socio', true, true);

  -- Seed: áreas
  insert into public.areas (escritorio_id, nome)
  values
    (v_escritorio_id, 'Trabalhista'),
    (v_escritorio_id, 'Cível'),
    (v_escritorio_id, 'Consumidor'),
    (v_escritorio_id, 'Previdenciário'),
    (v_escritorio_id, 'Família')
  returning id into v_area_id; -- pega o último, mas vamos usar array

  -- Buscar todos os IDs de áreas criadas
  select array_agg(id) into v_area_ids
  from public.areas where escritorio_id = v_escritorio_id;

  -- Seed: fases do funil
  insert into public.fases (escritorio_id, nome, ordem, encerra)
  values
    (v_escritorio_id, 'Pré-processual', 1, false),
    (v_escritorio_id, 'Ação distribuída', 2, false),
    (v_escritorio_id, 'Audiência', 3, false),
    (v_escritorio_id, 'Instrução', 4, false),
    (v_escritorio_id, 'Sentença', 5, false),
    (v_escritorio_id, 'Recurso', 6, false),
    (v_escritorio_id, 'Execução', 7, false),
    (v_escritorio_id, 'Encerrado', 8, true);

  -- Seed: categorias financeiras
  insert into public.categorias_financeiras (escritorio_id, nome)
  values
    (v_escritorio_id, 'Honorários'),
    (v_escritorio_id, 'Sucumbência'),
    (v_escritorio_id, 'Consultivo'),
    (v_escritorio_id, 'Marketing'),
    (v_escritorio_id, 'Pessoal'),
    (v_escritorio_id, 'Estrutura'),
    (v_escritorio_id, 'Software'),
    (v_escritorio_id, 'Impostos'),
    (v_escritorio_id, 'Outros');

  return v_escritorio_id;
end;
$$;
