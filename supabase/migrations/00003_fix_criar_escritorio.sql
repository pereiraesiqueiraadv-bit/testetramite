-- Corrigir função criar_escritorio_e_seeds
-- Erro: "query returned more than one row" causado pelo RETURNING INTO
-- com INSERT de múltiplas linhas

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
begin
  insert into public.escritorios (nome, plano, trial_expira_em)
  values (p_nome_escritorio, 'trial', now() + interval '7 days')
  returning id into v_escritorio_id;

  insert into public.usuarios (auth_user_id, escritorio_id, nome, papel, pode_financeiro, pode_config)
  values (auth.uid(), v_escritorio_id, p_nome_usuario, 'socio', true, true);

  insert into public.areas (escritorio_id, nome)
  values
    (v_escritorio_id, 'Trabalhista'),
    (v_escritorio_id, 'Cível'),
    (v_escritorio_id, 'Consumidor'),
    (v_escritorio_id, 'Previdenciário'),
    (v_escritorio_id, 'Família');

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
