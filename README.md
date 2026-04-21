# 🚀 DA VINCI ERP

Sistema ERP modular com foco em **gestão financeira, operacional e logística**, projetado para escalar com o crescimento da empresa.

---

## 🧠 VISÃO GERAL

O **Da Vinci ERP** é um sistema multiempresa (multi-tenant), orientado a fluxo financeiro e operacional.

### 🎯 Objetivos

- Centralizar operações empresariais
- Melhorar tomada de decisão com dados em tempo real
- Reduzir retrabalho e erros
- Escalar de forma modular

---

## 🧱 ARQUITETURA

Monorepo com separação clara de responsabilidades:

apps/
api/ → backend (Fastify + Prisma)
web/ → frontend (React + Vite)

packages/
database/ → Prisma client compartilhado
ui/ → (futuro design system)

---

## ⚙️ STACK TECNOLÓGICA

### Backend

- Node.js
- Fastify
- Prisma ORM
- PostgreSQL

### Frontend

- React
- Vite
- Axios

### Infra

- Docker (database)
- pnpm (workspace)

---

## 🧩 MÓDULOS DO SISTEMA

### 💰 Financeiro (CORE)

- Contas a pagar
- Contas a receber
- Controle de saldo
- Pagamentos
- Categorias financeiras

---

### 📦 Cadastros

- Clientes
- Fornecedores
- Bancos
- Categorias

---

### ⚙️ Administrativo

- Motoristas
- Licenças
- Contratos

---

### 🚛 Logística

- Ordens de serviço (OS)
- Rede logística (parceiros)

---

### 📊 Relatórios

- Financeiro geral
- Compras
- Indicadores

---

## 🔄 FLUXOS DO SISTEMA

### Fluxo principal

Login → Empresa → Dashboard → Cadastro → Transações → Relatórios

---

### Fluxo financeiro

Categoria → Conta → Transação → Pagamento → Atualização de saldo

---

## 🧠 PRINCÍPIOS DE DESENVOLVIMENTO

- Modularidade
- Escalabilidade
- Simplicidade primeiro
- Evolução incremental

---

## 🔐 AUTENTICAÇÃO (DEV)

O sistema usa middleware de desenvolvimento:

### Headers obrigatórios:

x-user-id: dev-user
x-company-id: 11111111-1111-1111-1111-111111111111

---

## 🚀 SETUP DO PROJETO

### 1. Instalar dependências

---

### 2. Subir banco

docker-compose up -d

---

### 3. Rodar migrations

pnpm prisma migrate dev

---

### 4. Rodar backend

cd apps/api
pnpm dev

API disponível em:

http://localhost:3333/

---

### 5. Rodar frontend

cd apps/web
pnpm dev

Frontend:

http://localhost:5173

---

## 🧪 TESTES DE API

Recomendado usar:

- Insomnia
- Postman

---

## 📁 PADRÃO DE CÓDIGO

Cada módulo segue a arquitetura:

schema → validação (Zod)
service → regra de negócio
controller → rotas (Fastify)

---

## ⚠️ REGRAS IMPORTANTES

### Multi-tenant obrigatório

Toda query deve conter:

companyId

---

### Regras financeiras

- INCOME → associado a cliente
- EXPENSE → associado a fornecedor

---

## 📊 EXEMPLO DE ENDPOINTS

POST /transactions
GET /transactions
PATCH /transactions/:id/pay

GET /reports/general
GET /reports/purchases

POST /os
GET /os

---

## 🧠 DIFERENCIAL DO PROJETO

- Sistema modular real (não CRUD simples)
- Integração entre financeiro e operações
- Preparado para logística avançada
- Multiempresa desde o início

---

## 🚧 ROADMAP

### Fase atual

- ✔ Financeiro
- ✔ Cadastros
- ✔ Administrativo
- ✔ Relatórios
- ✔ Logística básica

---

### Próximos passos

- Dashboard avançado
- Roteirização
- Monitoramento em tempo real
- RH
- Gestão de frotas

---

## ⚠️ LIMITAÇÕES ATUAIS

- Sem integração bancária
- Sem parcelamento
- Sem automações financeiras
- Sem regras fiscais avançadas

---

## 📌 IMPORTANTE

Esse sistema cresce rapidamente.

Se não for mantida a modularização:
👉 vira dívida técnica pesada

---

## 👨‍💻 AUTOR

Jaisson Tallison & Matheus Marques 
Estudantes de Análise e Desenvolvimento de Sistemas
