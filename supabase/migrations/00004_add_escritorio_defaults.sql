-- Adicionar valor padrão de escritorio_id em todas as tabelas
-- Assim os formulários não precisam passar o escritorio_id manualmente

ALTER TABLE clientes ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE processos ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE acordos ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE contatos_negociacao ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE parcelas ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE eventos ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE lancamentos ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE areas ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE teses ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE fases ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
ALTER TABLE categorias_financeiras ALTER COLUMN escritorio_id SET DEFAULT public.get_meu_escritorio_id();
