# Hacknical

Hacknical is a GitHub profile and resume tool. It collects GitHub contributions, commits, languages, repositories, and related statistics, then presents them as a shareable profile.

This project is forked from [ecmadao/hacknical](https://github.com/ecmadao/hacknical) and is maintained in [liguobao/hacknical](https://github.com/liguobao/hacknical).

## Features

- GitHub OAuth sign-in
- GitHub profile data analysis
- Resume editing and public sharing
- View statistics and share records
- Local SQLite storage and local file uploads

## Requirements

- Node.js 22.13 or newer
- npm 10 or newer

The current local runtime uses Node's built-in SQLite driver, an in-process memory cache, a no-op message queue, and local file storage. MongoDB, Redis, and a separate object-storage service are not required for local development or deployment.

## Local development

```bash
nvm use
npm install
cp .env.example .env
npm run start-local
```

The application listens on `http://localhost:4000`. Configure GitHub OAuth in `.env` when GitHub sign-in is needed:

```dotenv
APP_URL=http://localhost:4000
APP_KEY=replace-with-a-stable-secret
GITHUB_OAUTH_CLIENT_ID=your-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-client-secret
GITHUB_OAUTH_REDIRECT_URI=http://localhost:4000/api/user/login/github/callback
```

The OAuth callback URL must also be registered in the GitHub OAuth App.

The online deployment is available at [https://hackneo.cn/](https://hackneo.cn/).

## Production build

Build the backend and frontend assets with:

```bash
npm run build-app
npm run build-dll-pro
npm run build-src
NODE_ENV=production node dist/bin/app.js
```

For a local production deployment, the repository includes an idempotent script:

```bash
bash ./scripts/deploy-local.sh
```

The script creates the data directories, generates `config/production.json` when needed, builds the application, starts a tmux session named `hacknical`, and checks port `4000`.

## Data and configuration

- SQLite database: `data/hacknical.sqlite`
- Uploaded files: `public/uploads/`
- Production logs: `log/production.log`
- Example production config: `config/production.example.json`

Keep `APP_KEY` stable between restarts and deployments. Do not commit `.env`, `config/production.json`, SQLite files, uploads, or logs.

## Useful commands

```bash
npm run lint
npm test
npm run build-app
npm run build-static
```

## Project links

- Online deployment: [hackneo.cn](https://hackneo.cn/)
- Current repository: [github.com/liguobao/hacknical](https://github.com/liguobao/hacknical)
- Issues: [github.com/liguobao/hacknical/issues](https://github.com/liguobao/hacknical/issues)
- Original repository: [github.com/ecmadao/hacknical](https://github.com/ecmadao/hacknical)
