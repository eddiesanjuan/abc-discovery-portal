# ABC Discovery Portal

AI-powered pre-meeting discovery interview for E.F. San Juan. Visitors complete a guided conversation that helps Eddie San Juan prepare tailored, high-value meetings.

Built with Next.js 16, AI SDK, Anthropic Claude, and better-sqlite3.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key for the interview AI |
| `ADMIN_PASSWORD` | Yes | Password for Eddie's admin dashboard |
| `VISITOR_CODE` | No | Access code for interview visitors (defaults to `ABC2026` if not set) |

## Deployment

Deployed on Railway via Nixpacks. See `railway.json` for configuration.

```bash
railway up
```
