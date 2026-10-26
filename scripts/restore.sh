#!/bin/sh
# Restaura un respaldo creado con scripts/backup.sh.
# Uso: ./scripts/restore.sh ./backups/sidae-YYYYMMDD-HHMMSS
# PELIGRO: sobrescribe la BD y los documentos actuales. El stack debe estar levantado.
set -eu

if [ $# -ne 1 ]; then
  echo "Uso: $0 ./backups/sidae-YYYYMMDD-HHMMSS" >&2
  exit 1
fi

SRC="$1"
if [ ! -f "$SRC/postgres-all.sql" ]; then
  echo "No se encontro $SRC/postgres-all.sql" >&2
  exit 1
fi

echo "[restore] ADVERTENCIA: esto sobrescribe BD y documentos. Continuar en 5s (Ctrl+C para abortar)..."
sleep 5

echo "[restore] Restaurando base de datos..."
docker compose exec -T db psql -U "${POSTGRES_USER:-sidae}" -d postgres -c "SELECT 1" >/dev/null
cat "$SRC/postgres-all.sql" | docker compose exec -T db psql -U "${POSTGRES_USER:-sidae}" -d postgres -q

if [ -f "$SRC/records_storage.tar.gz" ]; then
  echo "[restore] Restaurando documentos..."
  docker run --rm \
    -v sidae_records_storage:/data \
    -v "$PWD/$SRC:/in:ro" \
    alpine sh -c "rm -rf /data/* && tar -xzf /in/records_storage.tar.gz -C /data"
fi

echo "[restore] Listo. Reinicie los servicios: docker compose restart"
