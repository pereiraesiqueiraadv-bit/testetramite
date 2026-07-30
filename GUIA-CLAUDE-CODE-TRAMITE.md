# Guia: construindo o Trâmite com o Claude Code

Passo a passo para quem nunca programou. Siga na ordem. Tempo estimado até o
primeiro deploy: 1 tarde. Até o MVP completo: 4–8 semanas trabalhando por sessões.

---

## Parte 1 — Preparação (uma única vez)

### 1.1 Contas necessárias (todas gratuitas para começar)
1. **Claude** — assinatura Pro ou Max em claude.ai (a Pro já dá acesso ao Claude Code).
2. **GitHub** (github.com) — onde seu código fica guardado e versionado.
3. **Supabase** (supabase.com) — crie um projeto novo chamado `tramite`.
   Guarde: a **URL do projeto** e a **anon key** (Settings → API).
4. **Vercel** (vercel.com) — entre com a conta do GitHub.

### 1.2 Instalar o Claude Code
Você tem dois caminhos — escolha o mais confortável:

**Caminho A (mais fácil): app Claude Desktop.** Baixe o Claude Desktop em
claude.ai/download e use a aba **Code** — o Claude Code roda dentro do app,
sem terminal.

**Caminho B: terminal.** Siga o instalador oficial em
https://docs.claude.com/en/docs/claude-code/overview — há instaladores nativos
para Windows, Mac e Linux (no Windows, use o PowerShell). Depois de instalar,
abra o terminal na pasta do projeto e digite `claude` para autenticar com sua
conta Claude.

Se aparecer qualquer erro na instalação, tire um print e cole no chat do Claude —
ele mesmo te destrava.

### 1.3 Criar a pasta do projeto
Crie uma pasta `tramite` no seu computador e coloque dentro dela estes 2 arquivos:
- `ESPECIFICACAO-TECNICA-TRAMITE.md`
- `tramite-saas-multiarea.html` (o protótipo — é a referência visual)

### 1.4 Criar o arquivo CLAUDE.md
Na mesma pasta, crie um arquivo chamado `CLAUDE.md` com o conteúdo abaixo.
O Claude Code lê esse arquivo em toda sessão — é a "memória" do projeto.

```markdown
# Projeto Trâmite — SaaS de gestão para escritórios de advocacia

## Fontes de verdade
- ESPECIFICACAO-TECNICA-TRAMITE.md: modelagem do banco, regras e fases. SIGA-A.
- tramite-saas-multiarea.html: protótipo com as telas finais. Replique o
  visual, os textos em pt-BR e os comportamentos dele.

## Stack (não mudar sem me perguntar)
Next.js 15 (App Router, TypeScript) + Tailwind + Supabase (Postgres, Auth, RLS)
+ deploy na Vercel.

## Regras inegociáveis
1. TODA tabela de dados tem escritorio_id e Row Level Security ativa.
2. Usuário sem pode_financeiro NUNCA recebe valores em R$ do servidor.
3. Interface 100% em português do Brasil.
4. Ao final de cada tarefa: rodar o build, corrigir erros, e me explicar em
   linguagem simples o que foi feito e como testar.

## Sobre mim
Não sou programador. Explique as coisas de forma simples e me diga exatamente
quais comandos rodar ou botões clicar quando precisar de algo fora do código.
```

---

## Parte 2 — Os prompts, fase por fase

Regras de ouro antes de começar:
- **Uma fase por sessão.** Sessões curtas e focadas funcionam melhor que maratonas.
- Ao final de cada fase, peça: *"faça o commit e o push para o GitHub"*.
  Isso salva um ponto de restauração.
- Se algo quebrar, cole a mensagem de erro inteira no Claude Code e peça para corrigir.
- Teste você mesmo o critério de pronto de cada fase (está na especificação, seção 7).

### Fase 0 — Fundação
```text
Leia o CLAUDE.md e a ESPECIFICACAO-TECNICA-TRAMITE.md. Crie o projeto Next.js 15
com TypeScript e Tailwind nesta pasta, configure a conexão com o Supabase usando
variáveis de ambiente (vou te passar a URL e a anon key), crie uma página
inicial simples com a identidade visual do protótipo (cores e fontes) e me guie
para: criar o repositório no GitHub, conectar na Vercel e fazer o primeiro
deploy. Me diga passo a passo o que devo clicar nos sites.
```

### Fase 1 — Banco, login e multi-tenancy (a fase mais importante)
```text
Implemente a Fase 1 da especificação: escreva as migrações SQL de TODAS as
tabelas da seção 3, com Row Level Security em todas conforme a seção 4.1, e os
seeds de áreas, teses, fases e categorias. Configure o Supabase Auth com login
Google e e-mail/senha (me guie para ativar o provedor Google no painel do
Supabase). Crie a tela de login idêntica à do protótipo e o fluxo de onboarding:
primeiro acesso cria o escritório e o usuário sócio. Depois me explique como
testar que dois escritórios diferentes não veem os dados um do outro.
```

### Fase 2 — Clientes, Processos e Configurações
```text
Implemente a Fase 2: telas de Clientes e Processos com CRUD completo, busca e
filtros idênticos ao protótipo (área, tese, status, fase), validação do número
CNJ, e a tela de Configurações para gerenciar áreas, teses, fases e categorias.
O provisionamento de cada processo deve seguir a regra da seção 6.1.
```

### Fase 3 — Acordos, negociação, Agenda e Audiências
```text
Implemente a Fase 3: tela de Acordos com parte contrária e telefone visíveis na
listagem, botão de registrar contato com histórico (data, meio, resultado,
observação) e a regra de auto-fechamento quando a proposta é aceita. Depois a
Agenda com calendário mensal e tipos de compromisso, e a aba Audiências como
visão agrupada por dia, tudo conforme o protótipo.
```

### Fase 4 — Financeiro, Dashboard, Relatório e permissões
```text
Implemente a Fase 4: tela Financeiro com lançamentos, o Dashboard completo com
todos os KPIs e gráficos do protótipo, o relatório mensal imprimível e o sistema
de permissões: estagiário não vê a aba Financeiro e recebe valores mascarados
DO SERVIDOR (nunca enviar os números reais para quem não pode ver). Inclua a
tela de gestão de usuários nas Configurações.
```

### Fase 5 — Parcelas e convites
```text
Implemente a Fase 5: geração automática de parcelas quando um acordo é fechado,
baixa de parcela gerando lançamento de receita, e o convite de novos usuários
por e-mail com papel definido pelo sócio.
```

### Fase 6 — Cobrança
```text
Implemente a Fase 6: integração com o Asaas para assinatura mensal com trial de
7 dias, bloqueio suave quando o trial expira (só leitura + aviso), e página de
gerenciamento da assinatura. Me guie para criar a conta e as chaves no Asaas em
modo sandbox para testarmos sem dinheiro real.
```

### Fase 7 — Andamentos automáticos (o diferencial)
```text
Pesquise e me apresente as opções de API para consulta de andamentos processuais
no Brasil (Judit, Escavador, DataJud/CNJ), com preços e limites atuais. Depois
que eu escolher, implemente: sincronização diária dos andamentos de cada
processo cadastrado e criação automática de eventos na agenda quando houver
intimação com prazo.
```

---

## Parte 3 — Rotina de trabalho recomendada

1. Abra a sessão e diga qual fase vai atacar.
2. Ao terminar, teste no navegador o critério de pronto da fase.
3. Peça o commit + push e o deploy na Vercel.
4. Anote bugs e ajustes num arquivo `PENDENCIAS.md` e resolva-os na sessão seguinte.
5. A partir da Fase 2, chame 2 ou 3 advogados conhecidos para usar a versão no ar
   e anote o feedback — isso vale mais que qualquer funcionalidade nova.

## Custos mensais estimados no início
- Supabase: R$ 0 (grátis até ~500 MB e 50 mil usuários autenticados/mês)
- Vercel: R$ 0 (plano hobby)
- Domínio .com.br: ~R$ 40/ano (registro.br)
- Claude Pro: o que você já paga
- Asaas: sem mensalidade, taxa por cobrança recebida
- API de tribunais (Fase 7): a partir de ~R$ 100–300/mês conforme volume — confirmar preços na época

Bom trabalho — e quando travar em qualquer passo, volte aqui no chat que eu te ajudo a destravar.
