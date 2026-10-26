#Requires -Version 5.1
<#
.SYNOPSIS
  Respaldo de SIDAE: dump de PostgreSQL + volumen de documentos.
.EXAMPLE
  .\scripts\backup.ps1
  .\scripts\backup.ps1 -Keep 14
#>
param(
  [string]$OutDir = "./backups",
  [int]$Keep = 7
)

$ErrorActionPreference = "Stop"
$pgUser = if ($env:POSTGRES_USER) { $env:POSTGRES_USER } else { "sidae" }
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$dest = Join-Path $OutDir "sidae-$stamp"
New-Item -ItemType Directory -Force -Path $dest | Out-Null

Write-Host "[backup] Dump de la base de datos..."
docker compose exec -T db pg_dumpall -U $pgUser > (Join-Path $dest "postgres-all.sql")

Write-Host "[backup] Documentos..."
docker run --rm `
  -v sidae_records_storage:/data:ro `
  -v "${PWD}\$($dest.Replace('/', '\')):/out" `
  alpine tar -czf /out/records_storage.tar.gz -C /data .

Get-ChildItem $dest | Format-Table Name, Length
Write-Host "[backup] Rotacion: conservar ultimos $Keep respaldos."
Get-ChildItem $OutDir -Directory -Filter "sidae-*" |
  Sort-Object Name -Descending |
  Select-Object -Skip $Keep |
  Remove-Item -Recurse -Force
Write-Host "[backup] Listo: $dest"
