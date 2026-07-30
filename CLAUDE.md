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

## Identidade visual
- Fundo: #F6F7F4
- Tinta: #122521
- Acento latão: #A8873C
- Fontes: Bricolage Grotesque (títulos) + Inter (texto) + JetBrains Mono (números e CNJ)

## Sobre mim
Não sou programador. Explique as coisas de forma simples e me diga exatamente
quais comandos rodar ou botões clicar quando precisar de algo fora do código.
