#!/bin/bash
set -e

REGISTRY="172.16.100.10:5000"
IMAGE_NAME="pokemon-pen-and-paper"
UNRAID_HOST="root@172.16.100.10"
UNRAID_COMPOSE_DIR="/mnt/user/appdata/PokemonPenAndPaper"

# Read and bump patch version (e.g. 0.2 -> 0.3)
CURRENT_VERSION=$(cat VERSION | tr -d '[:space:]')
MAJOR=$(echo "$CURRENT_VERSION" | cut -d. -f1)
MINOR=$(echo "$CURRENT_VERSION" | cut -d. -f2)
NEW_MINOR=$((MINOR + 1))
NEW_VERSION="${MAJOR}.${NEW_MINOR}"

echo "$NEW_VERSION" > VERSION
echo "Version: ${CURRENT_VERSION} -> ${NEW_VERSION}"

VERSIONED_IMAGE="${REGISTRY}/${IMAGE_NAME}:${NEW_VERSION}"
LATEST_IMAGE="${REGISTRY}/${IMAGE_NAME}:latest"

echo "Building ${VERSIONED_IMAGE} ..."
docker build --no-cache -t "${VERSIONED_IMAGE}" -t "${LATEST_IMAGE}" .

echo "Pushing ${VERSIONED_IMAGE} ..."
docker push "${VERSIONED_IMAGE}"
docker push "${LATEST_IMAGE}"

echo "Copying compose files to Unraid ..."
ssh "${UNRAID_HOST}" "mkdir -p ${UNRAID_COMPOSE_DIR}"

# Update compose file to use the explicit versioned image
sed "s|:latest|:${NEW_VERSION}|g" docker-compose.yml | \
  ssh "${UNRAID_HOST}" "cat > ${UNRAID_COMPOSE_DIR}/docker-compose.yml"

if [ -f .env ]; then
  scp .env "${UNRAID_HOST}:${UNRAID_COMPOSE_DIR}/.env"
fi

echo "Recreating container on Unraid ..."
ssh "${UNRAID_HOST}" "cd ${UNRAID_COMPOSE_DIR} && docker compose pull && docker compose up -d --force-recreate"

echo "Done: ${VERSIONED_IMAGE}"
