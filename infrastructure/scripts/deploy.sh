#!/bin/bash
# Deploy Tulare County AI Chatbot demo to the VPS
#
# Usage:
#   ./infrastructure/scripts/deploy.sh <server-ip> [ssh-key-path]
#
# Prerequisites:
#   - Server provisioned via Terraform (or manually with Docker + Caddy)
#   - .env.production file exists in project root
#   - SSH access to the server

set -euo pipefail

SERVER_IP="${1:?Usage: deploy.sh <server-ip> [ssh-key-path]}"
SSH_KEY="${2:-~/.ssh/id_rsa}"
DEMO_NAME="tulare-chatbot"
REMOTE_DIR="/opt/demos/${DEMO_NAME}"
SSH_CMD="ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no deploy@${SERVER_IP}"

echo "=== Deploying ${DEMO_NAME} to ${SERVER_IP} ==="

# 1. Create remote directory
echo "[1/5] Creating remote directory..."
$SSH_CMD "mkdir -p ${REMOTE_DIR}"

# 2. Sync project files (exclude unnecessary files)
echo "[2/5] Syncing files..."
rsync -avz --delete \
  -e "ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no" \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='__pycache__' \
  --exclude='.git' \
  --exclude='test-screenshots' \
  --exclude='infrastructure' \
  --exclude='docs' \
  --exclude='.env' \
  --exclude='venv' \
  ./ "deploy@${SERVER_IP}:${REMOTE_DIR}/"

# 3. Copy production env file
echo "[3/5] Copying environment config..."
if [ -f .env.production ]; then
  scp -i "${SSH_KEY}" -o StrictHostKeyChecking=no \
    .env.production "deploy@${SERVER_IP}:${REMOTE_DIR}/.env"
else
  echo "WARNING: No .env.production file found. Create one from .env.example"
  echo "         and re-run this script."
  exit 1
fi

# 4. Build and start containers
echo "[4/5] Building and starting containers..."
$SSH_CMD "cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml up -d --build"

# 5. Update Caddy config
echo "[5/5] Updating Caddy reverse proxy..."
$SSH_CMD "sudo cp ${REMOTE_DIR}/infrastructure/caddy/Caddyfile /etc/caddy/Caddyfile 2>/dev/null || true"
$SSH_CMD "sudo systemctl reload caddy 2>/dev/null || true"

echo ""
echo "=== Deployment complete! ==="
echo "Demo URL: https://arthurshafer.com/AI_Chatbot_Virtual_Assistant_Solutions_for_Tulare_County"
echo ""
echo "Useful commands:"
echo "  Logs:    ${SSH_CMD} 'cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml logs -f'"
echo "  Status:  ${SSH_CMD} 'cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml ps'"
echo "  Restart: ${SSH_CMD} 'cd ${REMOTE_DIR} && docker compose -f docker-compose.prod.yml restart'"
