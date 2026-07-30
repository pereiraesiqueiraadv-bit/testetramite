# Trâmite — Especificação Técnica do MVP

> Sistema SaaS de gestão para escritórios de advocacia (multi-área).
> Este documento é a fonte de verdade para o desenvolvimento. O arquivo
> `tramite-saas-multiarea.html` é o protótipo navegável que define as telas,
> textos e comportamentos esperados — use-o como referência visual.

---

## 1. Visão do produto

O Trâmite permite que um escritório de advocacia gerencie clientes, processos,
acordos (com controle de negociação), agenda de prazos e audiências, e
financeiro — tudo configurável por área de atuação e tese. É vendido por
assinatura mensal, com múltiplos usuários por escritório e permissões por papel.

Princípio central (multi-tenancy): **cada escritório enxerga apenas os próprios
dados**. O isolamento deve ser garantido no banco de dados (Row Level Security),
nunca apenas no código da aplicação.

## 2. Stack

| Camada | Tecnologia | Motivo |
|---|---|---|
| Frontend + backend | Next.js 15 (App Router, TypeScript) | Um só projeto, deploy simples |
| Banco + Auth + Storage | Supabase (PostgreSQL) | RLS nativo, login Google pronto, plano grátis |
| Hospedagem | Vercel | Integração nativa com Next.js, plano grátis |
| Estilo | Tailwind CSS | Rápido, e o protótipo já usa design tokens claros |
| Cobrança (Fase 3) | Asaas (ou Stripe) | Pix e boleto nativos no Brasil |
| E-mail transacional (Fase 3) | Resend | Lembretes de prazo |

Identidade visual (do protótipo): fundo `#F6F7F4`, tinta `#122521`, acento
latão `#A8873C`, fontes Bricolage Grotesque (títulos) + Inter (texto) +
JetBrains Mono (números e CNJ).

## 3. Modelagem do banco de dados (PostgreSQL / Supabase)

Convenções: todas as tabelas têm `id uuid primary key default gen_random_uuid()`,
`created_at timestamptz default now()`. Toda tabela de dados do escritório tem
`escritorio_id uuid not null references escritorios(id)` — essa coluna é a base
do RLS.

### 3.1 `escritorios`
| coluna | tipo | obs |
|---|---|---|
| nome | text not null | |
| plano | text default 'trial' | trial, solo, escritorio |
| trial_expira_em | timestamptz | 7 dias após criação |

### 3.2 `usuarios` (perfil; auth fica no Supabase Auth)
| coluna | tipo | obs |
|---|---|---|
| auth_user_id | uuid unique not null | referencia auth.users |
| escritorio_id | uuid not null | |
| nome | text not null | |
| papel | text not null | socio, advogado, estagiario |
| pode_financeiro | boolean | default por papel: socio/advogado true, estagiario false |
| pode_config | boolean | default: só socio true |
| ativo | boolean default true | |

### 3.3 `areas`
| coluna | tipo |
|---|---|
| escritorio_id | uuid |
| nome | text |

Seed inicial ao criar escritório: Trabalhista, Cível, Consumidor, Previdenciário, Família.

### 3.4 `teses`
| coluna | tipo |
|---|---|
| escritorio_id | uuid |
| area_id | uuid references areas |
| nome | text |

### 3.5 `fases` (funil do processo, ordenável)
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| nome | text | |
| ordem | int | funil do dashboard segue esta ordem |
| encerra | boolean default false | fase final (ex.: "Encerrado") não provisiona |

Seed: Pré-processual, Ação distribuída, Audiência, Instrução, Sentença, Recurso, Execução, Encerrado (encerra=true).

### 3.6 `clientes`
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| nome | text not null | |
| cpf_cnpj | text | |
| telefone | text | |
| email | text | |
| area_id | uuid | |
| tese_id | uuid | |
| parte_contraria | text | |
| status | text | prospeccao, ativo, encerrado |
| pct_exito | numeric default 30 | % honorários pró-êxito |
| pct_sucumbencia | numeric default 0 | |

### 3.7 `processos`
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| cliente_id | uuid not null | |
| numero_cnj | text not null | validar máscara NNNNNNN-DD.AAAA.J.TR.OOOO |
| juizo | text | vara/tribunal |
| fase_id | uuid | |
| distribuido_em | date | |
| valor_causa | numeric default 0 | |
| chance_exito | numeric default 0.5 | 0.9 provável, 0.5 possível, 0.15 remota |

**Regra de provisionamento** (usada no dashboard e relatório):
`provisionado = valor_causa × chance_exito × (cliente.pct_exito / 100)`,
somente para processos cuja fase não tem `encerra = true`.

### 3.8 `acordos`
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| cliente_id | uuid not null | |
| processo_id | uuid | opcional |
| parte_contraria | text | pré-preenchido do cliente |
| telefone_parte | text | **sempre visível na listagem** |
| data_acordo | date | |
| valor | numeric not null | |
| pct_honorarios | numeric default 30 | |
| num_parcelas | int default 1 | |
| status | text | negociacao, fechado, homologado, quitado |

### 3.9 `contatos_negociacao` (histórico de contatos do acordo)
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| acordo_id | uuid not null | |
| data_contato | date not null | |
| meio | text | whatsapp, ligacao, email, presencial |
| resultado | text | sem_retorno, retornou_analise, contraproposta, aceita, negada |
| observacao | text | |

**Regra**: ao registrar resultado `aceita` num acordo em `negociacao`,
o status do acordo muda automaticamente para `fechado`.

### 3.10 `parcelas` (geradas ao fechar acordo — Fase 2.5)
| coluna | tipo |
|---|---|
| escritorio_id | uuid |
| acordo_id | uuid |
| numero | int |
| vencimento | date |
| valor | numeric |
| status | text (prevista, recebida, vencida) |

### 3.11 `eventos` (agenda)
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| titulo | text not null | |
| tipo | text | prazo_fatal, audiencia, reuniao, diligencia |
| data | date not null | |
| hora | time | |
| cliente_id | uuid | opcional |
| processo_id | uuid | opcional |
| observacao | text | local, link da sala virtual, checklist |
| responsavel_id | uuid | usuário responsável |

A aba **Audiências** é uma visão filtrada de `eventos` com `tipo='audiencia'`,
agrupada por dia e ordenada por hora (ver protótipo).

### 3.12 `lancamentos` (financeiro)
| coluna | tipo | obs |
|---|---|---|
| escritorio_id | uuid | |
| data | date | |
| descricao | text | |
| categoria_id | uuid | |
| tipo | text | receita, despesa |
| valor | numeric | |
| status | text | realizado, previsto |
| acordo_id / parcela_id | uuid | opcional, para conciliação |

### 3.13 `categorias_financeiras`
Seed: Honorários, Sucumbência, Consultivo, Marketing, Pessoal, Estrutura, Software, Impostos, Outros.

## 4. Segurança e permissões

### 4.1 Row Level Security (obrigatório em TODAS as tabelas de dados)
Política padrão por tabela:

```sql
alter table clientes enable row level security;
create policy "escritorio_isolado" on clientes
  for all using (
    escritorio_id = (
      select escritorio_id from usuarios
      where auth_user_id = auth.uid()
    )
  );
```

### 4.2 Permissões por papel (aplicadas no app E no banco)
| Recurso | Sócio | Advogado | Estagiário |
|---|---|---|---|
| Dashboard (contagens) | ✔ | ✔ | ✔ |
| Valores em R$ (qualquer tela) | ✔ | ✔ | ✖ (exibir "R$ ••••") |
| Aba Financeiro | ✔ | ✔ | ✖ |
| Clientes/Processos/Agenda/Audiências | ✔ | ✔ | ✔ |
| Acordos (sem valores p/ estagiário) | ✔ | ✔ | ✔ |
| Configurações + usuários | ✔ | ✖ | ✖ |
| Relatório mensal PDF | ✔ | ✔ | ✖ |

No banco: view `lancamentos` protegida por policy que checa `pode_financeiro`.
No app: flags `pode_financeiro` / `pode_config` controlam navegação e máscara de valores.

### 4.3 Autenticação
- Supabase Auth com **Google OAuth** + e-mail/senha.
- Fluxo de onboarding: primeiro login sem escritório → tela "Criar escritório"
  (nome do escritório) → cria `escritorios` + `usuarios` (papel socio) + seeds
  (áreas, teses, fases, categorias) → entra no app com trial de 7 dias.
- Convite de usuários (Fase 2): sócio informa e-mail e papel; convite por link.

## 5. Telas (todas já existem no protótipo — replicar)

1. **Login** — Google + e-mail/senha, painel de marca à esquerda.
2. **Dashboard** — KPIs (acordos fechados no mês + soma, honorários dos acordos,
   valores provisionados, recebido no mês, resultado), gráfico receitas×despesas
   6 meses, funil por fase, acordos do mês, provisionamento por tese, próximos
   prazos/audiências. Filtro por área.
3. **Clientes** — listagem com busca e filtros (área, tese, status), CRUD completo.
4. **Processos** — listagem com nº CNJ formatado, fase, valor da causa e
   provisionado calculado; CRUD.
5. **Acordos** — listagem com parte contrária + telefone visíveis, último contato
   e status da proposta; botão "registrar contato" com histórico; CRUD.
6. **Agenda** — calendário mensal com marcadores por tipo + lista; CRUD.
7. **Audiências** — visão do mês agrupada por dia, ordenada por hora, com KPIs.
8. **Financeiro** — KPIs do mês, lançamentos com filtros; CRUD.
9. **Configurações** — áreas, teses, fases, categorias, usuários e permissões.
10. **Relatório mensal** — página imprimível (PDF via print) com resumo executivo.

## 6. Regras de negócio consolidadas

1. Provisionamento = `valor_causa × chance_exito × pct_exito/100` (processos não encerrados).
2. Honorários do acordo = `valor × pct_honorarios/100`.
3. Contato com resultado "aceita" → acordo `negociacao` vira `fechado`.
4. Acordo `fechado` gera N parcelas (valor/N, vencimentos mensais) → cada parcela
   recebida gera lançamento de receita (Fase 2.5).
5. "Acordos fechados no mês" = acordos com `data_acordo` no mês e status ≠ negociacao.
6. Estagiário nunca recebe valores monetários do servidor (mascarar no backend,
   não apenas esconder no frontend).
7. Excluir cliente: impedir se houver processos/acordos vinculados (ou arquivar).

## 7. Fases de desenvolvimento

| Fase | Entrega | Critério de pronto |
|---|---|---|
| 0 | Projeto Next.js + Supabase conectados, deploy na Vercel | página no ar |
| 1 | Auth (Google + senha), onboarding do escritório, RLS, seeds | 2 contas de escritórios diferentes não veem dados um do outro |
| 2 | Clientes + Processos + Configurações (áreas/teses/fases) | CRUD completo com filtros |
| 3 | Acordos + contatos de negociação + Agenda + Audiências | regra de auto-fechamento funcionando |
| 4 | Financeiro + Dashboard + Relatório PDF + permissões/máscara | estagiário não vê valores |
| 5 | Parcelas de acordos + convites de usuários | |
| 6 | Cobrança (Asaas): trial 7 dias → assinatura | primeiro pagamento de teste |
| 7 | (Diferencial) Andamentos automáticos via API de tribunais (Judit/Escavador/DataJud) | |

## 8. Fora do escopo do MVP
CRM de captação de leads, GED/documentos, portal do cliente, timesheet,
divisão de honorários, app mobile. (Roadmap pós-lançamento.)
