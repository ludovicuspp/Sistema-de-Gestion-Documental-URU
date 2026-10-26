#Requires -Version 5.1
<#
.SYNOPSIS
  Restaura un respaldo creado con backup.ps1. SOBRESCRIBE BD y documentos.
.EXAMPLE
  .\scripts\restore.ps1 .\backups\sidae-20260101-120000
#>
param(
  [Parameter(Mandatory = $true)]
  [string]$BackupDir
)

$ErrorActionPreference = "Stop"
$pgUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "sidae" }

if (-not (Test-Path (Join-Path $BackupDir "postgres-all.sql"))) {
  Write-Error "No se encontro postgres-all.sql en $BackupDir"
  exit 1
}

Write-Host "[restore] ADVERTENCIA: esto sobrescribe BD y documentos. Ctrl+C para abortar (5s)..."
Start-Sleep -Seconds 5

Write-Host "[restore] Restaurando base de datos..."
Get-Content (Join-Path $BackupDir "postgres-all.sql") -Raw |
  docker compose exec -T db psql -U $pgUser -d postgres -q

$tar = Join-Path $BackupDir "records_storage.tar.gz"
if (Test-Path $tar) {
  Write-Host "[restore] Restaurando documentos..."
  $winPath = (Resolve-Path $BackupDir).Path
  docker run --rm `
    -v sidae_records_storage:/data `
    -v "${winPath}:/in:ro" `
    alpine sh -c "rm -rf /data/* && tar -xzf /in/records_storage.tar.gz -C /data"
}

Write-Host "[restore] Listo. Reinicie los servicios: docker compose restart"
