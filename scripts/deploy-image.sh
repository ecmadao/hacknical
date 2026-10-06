#!/usr/bin/env bash
# Deploy the exact image built by Actions. Keep SQLite/uploads and rollback on failure.
set -euo pipefail
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
: "${HACKNICAL_IMAGE:?HACKNICAL_IMAGE is required}"
command -v python3 >/dev/null
docker compose version >/dev/null
mkdir -p data log public/uploads config

# Pull before touching the running service. A public GHCR image needs no login.
if ! docker pull "$HACKNICAL_IMAGE"; then
  : "${GHCR_TOKEN:?Private image requires GHCR_TOKEN}"
  : "${GHCR_USER:?Private image requires GHCR_USER}"
  auth_dir=$(mktemp -d)
  trap 'rm -rf "$auth_dir"' EXIT
  printf '%s' "$GHCR_TOKEN" | docker --config "$auth_dir" login ghcr.io -u "$GHCR_USER" --password-stdin
  docker --config "$auth_dir" pull "$HACKNICAL_IMAGE"
  rm -rf "$auth_dir"
  trap - EXIT
fi

previous_image=$(docker inspect hacknical --format '{{.Config.Image}}' 2>/dev/null || true)
had_env=0
if [ -f .env ]; then
  cp -p .env .env.rollback
  had_env=1
fi
rollback() {
  trap - ERR
  echo 'Deployment failed; restoring the previous release.' >&2
  docker logs --tail 40 hacknical || true
  if [ "$had_env" = 1 ]; then mv .env.rollback .env; fi
  if [ -n "$previous_image" ]; then
    HACKNICAL_IMAGE="$previous_image" docker compose -p hacknical -f docker-compose.deploy.yml up -d --remove-orphans || true
  fi
  exit 1
}
trap rollback ERR
python3 scripts/configure-deploy.py
docker compose -p hacknical -f docker-compose.deploy.yml up -d --remove-orphans
for attempt in $(seq 1 60); do
  health=$(docker inspect --format '{{.State.Health.Status}}' hacknical 2>/dev/null || true)
  if [ "$health" = healthy ]; then
    break
  fi
  if [ "$health" = unhealthy ] || [ "$health" = '' ]; then
    echo "Container health check failed (status: ${health:-missing})." >&2
    exit 1
  fi
  sleep 2
done
if [ "${health:-}" != healthy ]; then
  echo 'Timed out waiting for the container health check.' >&2
  exit 1
fi
curl --fail --silent --show-error --max-time 10 http://127.0.0.1:4000/api/healthz
printf '%s\n' "$HACKNICAL_IMAGE" > .deployed-image
rm -f .env.rollback
trap - ERR
echo 'Deployment complete.'
