param(
  [string]$SchemaFile = "types/supabase.d.ts"
)

if (-not (Test-Path $SchemaFile)) {
  Write-Error "Schema file not found: $SchemaFile"
  exit 1
}

$lines = Get-Content -Path $SchemaFile
$inTables = $false
$currentTable = $null
$inRow = $false
$tableCols = @{}

foreach ($line in $lines) {
  if ($line -match '^\s{4}Tables:\s*\{') { $inTables = $true; continue }
  if ($inTables -and $line -match '^\s{4}Views:\s*\{') { break }
  if (-not $inTables) { continue }

  if ($line -match '^\s{6}"?([A-Za-z0-9_\-]+)"?:\s*\{\s*$') {
    $currentTable = $matches[1]
    if (-not $tableCols.ContainsKey($currentTable)) { $tableCols[$currentTable] = @() }
    $inRow = $false
    continue
  }

  if ($line -match '^\s{8}Row:\s*\{\s*$') { $inRow = $true; continue }
  if ($inRow -and $line -match '^\s{8}\};\s*$') { $inRow = $false; continue }

  if ($inRow -and $line -match '^\s{10}([A-Za-z0-9_]+):') {
    $tableCols[$currentTable] += $matches[1]
  }
}

$results = @()
foreach ($table in $tableCols.Keys) {
  foreach ($column in ($tableCols[$table] | Select-Object -Unique)) {
    $hitsRaw = rg -n -F --glob '!types/supabase.d.ts' --glob '!offline-data/**' --glob '!docs/**' --glob '!node_modules/**' --glob '!.next/**' --glob '!database/**' --glob '!scripts/**' -- "$column" . 2>$null
    $hits = if ([string]::IsNullOrWhiteSpace($hitsRaw)) { 0 } else { ($hitsRaw -split "`n" | Where-Object { $_ -ne '' }).Count }

    $results += [pscustomobject]@{
      table = $table
      column = $column
      hits = $hits
    }
  }
}

$zero = $results | Where-Object { $_.hits -eq 0 } | Sort-Object table, column
$zero | Format-Table -AutoSize

Write-Host "`nZero-reference columns:" $zero.Count
