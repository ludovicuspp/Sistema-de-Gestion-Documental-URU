#!/bin/sh
# Entrypoint del front: sirve la SPA por HTTP y HTTPS.
# - Si se montan certificados reales en /etc/nginx/certs (tls.crt/tls.key), se usan.
# - Si no, se genera un autofirmado efímero para dev (openssl).
set -eu

CERT_DIR=/etc/nginx/certs
CERT_FILE="$CERT_DIR/tls.crt"
KEY_FILE="$CERT_DIR/tls.key"

if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo "[entrypoint] Generando certificado autofirmado para desarrollo..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
    -keyout "$KEY_FILE" -out "$CERT_FILE" \
    -subj "/CN=localhost" \
    -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" 2>/dev/null || \
  openssl req -x509 -nodes -days 825 -newkey rsa:2048 \
    -keyout "$KEY_FILE" -out "$CERT_FILE" \
    -subj "/CN=localhost"
  chmod 600 "$KEY_FILE"
else
  echo "[entrypoint] Usando certificados existentes en $CERT_DIR."
fi

exec nginx -g "daemon off;"
