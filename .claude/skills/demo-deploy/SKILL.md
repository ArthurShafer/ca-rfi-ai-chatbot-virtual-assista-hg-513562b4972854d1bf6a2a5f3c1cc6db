---
name: demo-deploy
description: "Deploy campaign demo to shared DigitalOcean Droplet via Docker + Caddy. Handles port allocation, production compose validation, server-side deploy, Caddy config, and smoke testing."
---

# Demo Deployment

## Overview

Deploy a campaign demo to the shared DigitalOcean Droplet at `arthurshafer.com/{demo-path}`. The server runs Docker + Caddy with path-based routing. Each demo gets its own Docker Compose stack and a unique port.

## Server Details

- **Droplet IP**: 161.35.7.20
- **SSH user**: deploy
- **SSH command**: `ssh deploy@161.35.7.20`
- **Demo directory**: `/opt/demos/<slug>/`
- **Caddyfile**: `/etc/caddy/Caddyfile`
- **Domain**: arthurshafer.com (A record in Route 53, hosted zone Z00918652X86GZOEP8ZIE)
- **Infra repo**: `C:\Users\artjs\Dev\demo-infrastructure\` (Caddyfile, Terraform, deploy script)

## Prerequisites

Before running this skill, make sure:
1. The demo works locally with `docker compose up`
2. `docker-compose.prod.yml` exists (or you'll create one during this workflow)
3. `.env.production.example` exists documenting all required env vars
4. You have SSH access to the Droplet: `ssh deploy@161.35.7.20`

## Workflow

### Step 1: Read Campaign Context

Load the campaign config and determine the deployment slug:

```bash
# Read campaign slug from .campaign.json
python -c "import json; c=json.load(open('.campaign.json')); print(c.get('repo_name', 'unknown'))"
```

The demo path and server directory derive from this slug:
- **URL**: `https://arthurshafer.com/{slug}`
- **Server path**: `/opt/demos/{slug}/`

### Step 2: Check Port Allocation

SSH to the Droplet and read the current Caddyfile to find the next available port:

```bash
ssh deploy@161.35.7.20 "cat /etc/caddy/Caddyfile"
```

Look for existing `handle_path` blocks and their `reverse_proxy localhost:XXXX` lines. Ports are allocated sequentially starting from 3001. Pick the next unused port.

Alternatively, check the infra repo's Caddyfile if available locally:
```bash
cat C:\Users\artjs\Dev\demo-infrastructure\caddy\Caddyfile
```

### Step 3: Validate Production Compose

Check that `docker-compose.prod.yml` exists and meets requirements. If it doesn't exist, create it.

**Required elements:**
- Frontend service exposes only its assigned port (no database ports exposed externally)
- All services have `restart: unless-stopped`
- All services have healthchecks
- Dependent services use `depends_on` with `condition: service_healthy`
- No hardcoded secrets (use `.env.production` file)
- Network isolation: services communicate on an internal Docker network

**Template for a typical Next.js + FastAPI demo:**

```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    env_file: .env.production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - internal

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "${PORT:-3001}:3000"
    env_file: .env.production
    restart: unless-stopped
    depends_on:
      backend:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - internal

networks:
  internal:
    driver: bridge
```

### Step 4: Create .env.production

If `.env.production` doesn't exist, create it from `.env.production.example`:

```bash
cp .env.production.example .env.production
# Edit with actual production values
```

Key variables to set:
- `PORT` = the allocated port from Step 2
- Any API keys, database URLs, or service-specific config

### Step 5: Deploy to Server

**Option A: Use the deploy script (preferred)**

The infra repo has a generic deploy script that handles rsync, env copy, and compose up:

```bash
cd C:\Users\artjs\Dev\demo-infrastructure
./scripts/deploy.sh <slug> <campaign-repo-path> <droplet-ip>
```

**Option B: Manual deployment**

If deploy.sh isn't available or you need more control:

```bash
# 1. SSH and create the demo directory
ssh deploy@161.35.7.20 "mkdir -p /opt/demos/<slug>"

# 2. Sync files to server (exclude dev artifacts)
rsync -avz --exclude='node_modules' --exclude='.next' --exclude='__pycache__' \
  --exclude='.env' --exclude='.git' --exclude='venv' \
  ./ deploy@161.35.7.20:/opt/demos/<slug>/

# 3. Copy production env file
scp .env.production deploy@161.35.7.20:/opt/demos/<slug>/.env.production

# 4. Build and start on the server
ssh deploy@161.35.7.20 "cd /opt/demos/<slug> && docker compose -f docker-compose.prod.yml up -d --build"
```

### Step 6: Configure Caddy

Add a `handle_path` block to the Caddyfile for this demo:

```caddy
handle_path /<slug>/* {
    reverse_proxy localhost:<PORT>
}
```

Then reload Caddy:

```bash
ssh deploy@161.35.7.20 "sudo systemctl reload caddy"
```

If the infra repo has a local copy of the Caddyfile, update that too so it stays in sync:
```bash
# Add the handle_path block to C:\Users\artjs\Dev\demo-infrastructure\caddy\Caddyfile
# Then push the updated Caddyfile to the server
scp C:\Users\artjs\Dev\demo-infrastructure\caddy\Caddyfile deploy@161.35.7.20:/etc/caddy/Caddyfile
ssh deploy@161.35.7.20 "sudo systemctl reload caddy"
```

### Step 7: Smoke Test

Verify the deployment is live and healthy:

```bash
# Health check
curl -s https://arthurshafer.com/<slug>/health | python -m json.tool

# Frontend loads
curl -s -o /dev/null -w "%{http_code}" https://arthurshafer.com/<slug>/
```

Expected results:
- Health endpoint returns `{"status": "ok"}` with HTTP 200
- Frontend returns HTTP 200

If either fails, check:
1. Docker containers are running: `ssh deploy@161.35.7.20 "cd /opt/demos/<slug> && docker compose -f docker-compose.prod.yml ps"`
2. Container logs: `ssh deploy@161.35.7.20 "cd /opt/demos/<slug> && docker compose -f docker-compose.prod.yml logs --tail=50"`
3. Caddy logs: `ssh deploy@161.35.7.20 "sudo journalctl -u caddy --since '5 min ago'"`

### Step 8: Post-Deploy Environment Variable Verification

After the demo is live, verify that all required API keys and environment variables are configured:

1. Read `.env.production.example` and list every variable marked as "Required"
2. For each required variable, test whether the feature it enables actually works on the live URL:
   - Hit an endpoint or page that depends on the variable
   - If it returns an API key error or shows the graceful "API key required" message, flag it
3. Report to the user: "These API keys are needed for full functionality: [list]. Set them on the server via SSH, or mark those features as demo-only in the walkthrough script."
4. Do NOT set API keys autonomously. The user decides which keys to configure on the production server.

### Step 8b: Functional Verification of API-Dependent Features

Do not mark deployment as complete until core features work end-to-end on the live URL. The health check (Step 7) only proves the server is running. This step proves the product works.

1. **If the demo includes LLM chat or conversational AI**: Send an actual test message via the live URL's chat interface (or via curl to the chat API endpoint). Verify a coherent response is returned, not a generic error. If the response is an error like "trouble generating a response," the API key is missing or misconfigured. Flag immediately.
2. **If the demo includes external API integrations** (data feeds, third-party services): Hit a page or endpoint that depends on the integration. Verify real data comes back.
3. **If the demo includes file processing** (document upload, PDF parsing): Upload a test file and verify it processes.

If any core feature fails, report the specific failure and the likely env var or configuration needed. Do not proceed to Step 9 until either the feature works or the user explicitly acknowledges the limitation.

### Step 9: Report

Report the live URL to the user: `https://arthurshafer.com/<slug>`

Lane advancement is handled by the campaign workflow (CLAUDE.md Step 6), not by this skill.

## Teardown

When a campaign ends or the demo is no longer needed:

```bash
# Stop containers
ssh deploy@161.35.7.20 "cd /opt/demos/<slug> && docker compose -f docker-compose.prod.yml down"

# Remove the handle_path block from /etc/caddy/Caddyfile
# Reload Caddy
ssh deploy@161.35.7.20 "sudo systemctl reload caddy"

# Remove demo files
ssh deploy@161.35.7.20 "rm -rf /opt/demos/<slug>"
```

## Troubleshooting

**Port conflict**: Another demo already uses the port. Check `docker ps` on the server and the Caddyfile.

**Build fails on server**: The Droplet has limited resources (2 vCPU, 2GB RAM). If builds OOM, build locally and push the image, or build one service at a time.

**Caddy 502 Bad Gateway**: The Docker container isn't listening on the expected port. Verify the PORT env var matches what the app listens on inside the container.

**SSL issues**: Caddy handles SSL automatically via Let's Encrypt. If there are issues, check Caddy logs and ensure the A record for `arthurshafer.com` points to the Droplet IP.

**Subpath routing**: The app must handle being served from a subpath (`/<slug>/`). For Next.js, set `basePath` in `next.config.js`. For other frameworks, configure the equivalent path prefix setting.
