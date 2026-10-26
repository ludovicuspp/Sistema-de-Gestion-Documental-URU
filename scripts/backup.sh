#!/bin/sh
# Respaldo de SIDAE: dump de PostgreSQL + volumen de documentos.
# Uso: ./scripts/backup.sh [DIR]   (por defecto ./backups)
# Requiere: docker compose con el stack levantado.
set -eu

BACKUP_DIR="${1:-./backups}"
STAMP="$(date +%Y%m%d-%H%M%S)"
DEST="$BACKUP_DIR/sidae-$STAMP"
KEEP="${BACKUP_KEEP:-7}"

mkdir -p "$DEST"
echo "[backup] Dump de la base de datos..."
docker compose exec -T db pg_dumpall -U "${POSTGRES_USER:-sidae}" > "$DEST/postgres-all.sql"
echo "[backup] Documentos ($DEST/records_storage.tar.gz)..."
docker run --rm \
  -v sidae_records_storage:/data:ro \
  -v "$PWD/$DEST:/out" \
  alpine tar -czf "/out/records_storage.tar.gz" -C /data .
ls -lh "$DEST"

echo "[backup] Rotacion: conservar ultimos $KEEP respaldos..."
# shellcheck disable=SC2012
ls -dt "$BACKUP_DIR"/sidae-* 2>/dev/null | tail -n +"$((KEEP + 1))" | xargs -r rm -rf
echo "[backup] Listo: $DEST"
