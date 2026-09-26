# API A1: Authors e Books

API REST com Node.js, Express, Prisma ORM e SQLite para o relacionamento 1:N entre autores e livros.

## Requisitos

- Node.js 20.19+ (validado com Node.js 24)
- npm

## Instalação

```bash
npm install
```

## Banco de dados

O banco SQLite `dev.db` fica na raiz do projeto e é criado pela migration inicial:

```bash
npx prisma migrate dev --name init
```

As migrations ficam em `prisma/migrations` e devem ser versionadas. O banco local é ignorado pelo Git.

## Inicializacao

```bash
npm start
```

O servidor inicia em `http://localhost:3000`. Para desenvolvimento com reinício automático, use `npm run dev`.

## Rotas

### `POST /authors`

Cria um autor. `biography` é opcional.

```json
{
  "name": "Clarice Lispector",
  "biography": "Escritora brasileira."
}
```

### `POST /books`

Cria um livro associado a um autor existente. `author_id` deve ser o UUID retornado por `POST /authors`.

```json
{
  "title": "A Hora da Estrela",
  "release_year": 1977,
  "author_id": "UUID_DO_AUTOR"
}
```

### `GET /books`

Lista os livros com o objeto do autor relacionado.

### `PUT /books/:id`

Substitui os campos do livro. Envie `title`, `release_year` e `author_id`.

```json
{
  "title": "A Hora da Estrela - Edicao revista",
  "release_year": 1977,
  "author_id": "UUID_DO_AUTOR"
}
```

### `DELETE /books/:id`

Exclui o livro indicado pelo UUID e responde com status `204`.

Erros de validação retornam `400`, autor ou livro inexistente retornam `404`, e nome de autor duplicado retorna `409`. A collection `collection.json` contém as cinco requisições em ordem, incluindo variáveis para encadear os UUIDs criados.