# Desenvolvedor Cadastra

Este projeto é um desafio para novos colaboradores da Cadastra, consistindo em um e-commerce simples com frontend em TypeScript/SCSS e backend simulado com JSON Server.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [npm](https://www.npmjs.com/)

## Instalação

Clone o repositório e instale as dependências:

```sh
git clone https://github.com/joaolimasm/desenvolvedor-cadastra.git
cd desenvolvedor-cadastra
npm install
```

## Scripts Disponíveis

- `npm run dev` — Inicia o frontend em modo desenvolvimento usando Gulp (compila SCSS, TypeScript e serve com live reload).
- `npm run server` — Inicia o backend com JSON Server usando o arquivo `db.json` na porta 5000.
- `npm start` — Inicia frontend (`dev`) e backend (`server`) em paralelo, com a variável de ambiente `SERVER_API` apontando para `http://localhost:5000`.
- `npm run start:gp` — Alternativa ao `start`, sem uso do `cross-env`.

## Como rodar o backend (JSON Server)

O backend simula uma API REST usando o arquivo `db.json`.

Para iniciar o servidor:

```sh
npm run server
```

O servidor ficará disponível em: [http://localhost:5000/products](http://localhost:5000/products)

## Como rodar o frontend

Para iniciar o frontend em modo desenvolvimento:

```sh
npm run dev
```

Ou, para rodar o frontend e o backend juntos (recomendado):

```sh
npm start
```

Isso irá:

- Rodar o JSON Server em [http://localhost:5000](http://localhost:5000)
- Rodar o frontend em [http://localhost:3000](http://localhost:3000) (ou outra porta disponível)

## Estrutura do Projeto

- `src/` — arquivos fonte (HTML, SCSS, TypeScript, imagens)
- `db.json` — base de dados fake para o JSON Server
- `dist/` — arquivos gerados para produção/desenvolvimento

## Observações

- O frontend consome a API em `http://localhost:5000/products`.
- Para build de produção, utilize (caso exista o script):
  ```sh
  npm run build
  ```

