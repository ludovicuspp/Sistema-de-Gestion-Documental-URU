# migration-runner — ETL legado → nuevo esquema

Job de un solo uso (no es un servicio; no expone puertos). Lee el Postgres legacy
(esquemas `General/Security/...`) y escribe en las 6 BD `sidae_*`. Idempotente por
`guid_id`: re-ejecutable sin duplicar. Detalle del mapeo: `docs/migracion-legado.md`.

## Requisitos previos

1. Restaurar un dump del legado en un Postgres accesible desde la red de Compose.
2. Stack levantado (`docker compose up -d`) para que Flyway haya creado los esquemas.
3. Copiar los archivos de documentos al volumen `records_storage` según el
   `files-manifest.csv` que genera el job (columna `original_url` → nombre destino).

## Ejecución local (requiere JDK 21 + Maven)

```bash
cd backend-spring
mvn -pl migration-runner -am package -DskipTests
java -jar migration-runner/target/migration-runner-*.jar \
  --legacy.jdbc-url=jdbc:postgresql://localhost:5432/sidae_legacy \
  --legacy.username=postgres --legacy.password=secret \
  --target.base-url=jdbc:postgresql://localhost:5433 \
  --target.username=sidae --target.password=sidae \
  --migration.manifest-path=./files-manifest.csv
```

## Ejecución con Docker

```bash
docker build -f - backend-spring <<'EOF'
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -B -pl migration-runner -am -DskipTests package && cp migration-runner/target/*.jar /app/migration.jar
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/migration.jar migration.jar
ENTRYPOINT ["java", "-jar", "/app/migration.jar"]
EOF
```

El job imprime `insertados / omitidos / errores` por tabla y falla (exit != 0) si hay
errores de fila; corrija y re-ejecute.

## Notas

- Passwords: el legado usa BCrypt, migran tal cual (login inmediato, sin reset).
- `Audit.Log`, `System.Setting`, `Security.Action/Endpoint/Permission` y carreras
  adicionales por estudiante se descartan (ver justificación en el doc de mapeo).
- Los archivos binarios NO se copian solos: use el manifiesto generado.
