# HelpLine - Sistema de Chamados de TI

Aplicação web completa para abertura e acompanhamento de chamados de TI, com frontend em React e backend em Node.js/Express utilizando persistência em arquivo JSON (ideal para testes e demonstrações rápidas).

---

## 🌟 Visão Geral
- Autenticação com JWT e fluxo de registro/login.
- Perfis distintos (usuário e gerente) com navegação e permissões personalizadas.
- Chatbot interativo que guia o usuário e abre chamados automaticamente.
- Base de conhecimento com artigos e feedback.
- Lista de chamados filtrada por situação, com edição completa para gerentes.
- Interface responsiva: sidebar no desktop e menu hambúrguer no mobile.

---

## 🛠 Tecnologias

### Frontend
- React 18 + Vite
- React Router
- Tailwind CSS
- Componentes customizados (cards, dialogs, botões, etc.)

### Backend
- Node.js + Express.js
- Persistência em arquivo JSON (`server/data/db.json`)
- JWT + bcryptjs
- Estrutura modular de rotas (auth, tickets, artigos, usuários)

> ⚙️ Caso futuramente você deseje migrar para um banco SQL, será necessário adicionar suporte manualmente. No estado atual, toda a persistência é feita via JSON.

---

## ⚡ Guia Rápido

### Pré-requisitos
- Node.js 18 ou superior
- npm (ou yarn)

### Passo a passo
```bash
# 1. Clonar o projeto
git clone <url-do-repositorio>
cd ProjetoADSHelpLine

# 2. Instalar dependências
npm install

# 3. Criar arquivo .env
echo PORT=3001> .env
echo JWT_SECRET=chave-super-segura>> .env
echo VITE_API_URL=http://localhost:3001/api>> .env

# 4. Iniciar backend (JSON Database)
npm run server:json:dev

# 5. Iniciar frontend (em outro terminal)
npm run dev
```

### Acessos
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api

---

## 🔐 Logins Padrão

Ao subir o backend JSON (`npm run server:json:dev`) os usuários abaixo são criados automaticamente:

| Perfil   | Email                  | Senha      |
|----------|------------------------|------------|
| Gerente  | `admin@helpline.com`   | `admin123` |
| Usuário  | `usuario@helpline.com` | `usuario123` |

- A página `/register` cria novos usuários comuns.
- Para resetar os dados, pare o servidor, apague `server/data/db.json` e execute novamente `npm run server:json:dev`.

### Criar novos usuários
- **Via interface**: acesse `/register`, preencha os campos e confirme.
- **Promover usuário a gerente**: edite manualmente o arquivo `server/data/db.json` (campo `role` → `manager`) ou implemente sua própria rota/admin.
- **Criar usuário manualmente**: adicione um registro no JSON com o password já hasheado em bcrypt (`const hash = await bcrypt.hash(senha, 10)`).

### Permissões
- **Usuário**: conversa com o chatbot, abre chamados, visualiza apenas seus tickets e artigos úteis.
- **Gerente**: visualiza/edita todos os tickets, gerencia artigos e vê a base de conhecimento administrativa.

---

## 🗃 Banco de Dados JSON
- Arquivo: `server/data/db.json`.
- Criado automaticamente quando o backend inicia.
- Persistido em disco; basta copiar o arquivo para backup.
- Pode ser aberto/editado manualmente (JSON legível).

### Reset do banco
1. Pare o backend (`Ctrl+C`).
2. Exclua `server/data/db.json`.
3. Rode `npm run server:json:dev` para recriar com dados padrão.

---

## 🗂 Estrutura do Projeto
```
ProjetoADSHelpLine/
├── server/
│   ├── indexJson.js        # Servidor Express usando JSON (padrão)
│   ├── db/jsonDb.js        # Adaptador de persistência em arquivo
│   ├── data/db.json        # Dados (criado automaticamente)
│   ├── middleware/auth.js  # Middleware JWT
│   └── routes/             # Rotas REST (auth, tickets, artigos, usuários)
├── src/
│   ├── components/         # Componentes reutilizáveis (inclui MobileMenu)
│   ├── context/AuthContext.jsx
│   ├── pages/              # Home, Login, TicketList, ChatBot, etc.
│   ├── services/api.js     # Cliente HTTP para a API
│   └── router.jsx          # Rotas com proteção e controle de acesso
└── README.md               # Este guia
```

---

## 📡 Endpoints Principais

### Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Tickets
- `GET /api/tickets`
- `POST /api/tickets`
- `GET /api/tickets/:id`
- `PUT /api/tickets/:id`
- `DELETE /api/tickets/:id` *(restrito a gerentes)*

### Artigos
- `GET /api/articles`
- `POST /api/articles` *(gerente)*
- `PUT /api/articles/:id` *(gerente)*
- `DELETE /api/articles/:id` *(gerente)*
- `POST /api/articles/:id/feedback`

### Usuários
- `GET /api/users` *(gerente)*
- `GET /api/users/:id`
- `GET /api/users/managers/list` *(gerente)*

---

## 📦 Scripts Disponíveis
```bash
npm run dev              # Frontend (Vite)
npm run server:json      # Backend JSON em modo produção
npm run server:json:dev  # Backend JSON com nodemon (recomendado)
npm run build            # Build de produção do frontend
```

---

## 🔄 Migração manual para SQL
- O projeto não inclui suporte pronto para bancos relacionais.
- Caso deseje migrar, escolha um ORM/driver (por exemplo, Prisma, Sequelize, Knex), defina o schema e adapte as rotas.
- Reescreva `server/db/jsonDb.js` e os módulos em `server/routes/*Json.js` para consumirem o novo provedor.
- Lembre-se de criar scripts de migração/exportação se quiser aproveitar os dados existentes.

> 💡 Recomenda-se realizar essa migração em um branch separado e adicionar testes automatizados para garantir a compatibilidade.

---

## 🧰 Troubleshooting
- **Porta 3001 ocupada**: finalize processos Node (`taskkill /IM node.exe /F`) ou altere `PORT` no `.env`.
- **Banco não atualiza**: pare o servidor, remova `server/data/db.json` e reinicie.
- **Erro de CORS**: confirme `VITE_API_URL=http://localhost:3001/api` no `.env` do frontend.
- **Login falha**: reinicie `npm run server:json:dev` para recriar os usuários padrão.

---

## ✅ Próximos Passos
- Testar o fluxo completo com usuário e gerente.
- Personalizar artigos e roteiros do chatbot.
- Ajustar identidade visual conforme a necessidade da sua equipe.

---

## 📄 Licença
Projeto privado para uso acadêmico/demonstrativo.

