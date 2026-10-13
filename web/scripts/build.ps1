# Builds the static export outside OneDrive.
#
# `.next` corrupts when it lives under a syncing OneDrive folder (EINVAL on readlink,
# then MODULE_NOT_FOUND on chunks), and pointing distDir elsewhere does not help — the
# whole build tree has to be outside. So: mirror the sources to %TEMP%, junction
# node_modules across, build there, copy `out` back.
#
#   powershell -ExecutionPolicy Bypass -File scripts/build.ps1

$ErrorActionPreference = 'Stop'

$source = Split-Path -Parent $PSScriptRoot
$work = Join-Path $env:TEMP 'euravia-build'

Write-Host "source : $source"
Write-Host "build  : $work"

# /MIR keeps the mirror honest between runs; node_modules and outputs are excluded
# because they are junctioned or regenerated.
robocopy $source $work /MIR /NFL /NDL /NJH /NJS /NP `
  /XD node_modules .next out .git `
  | Out-Null

if ($LASTEXITCODE -ge 8) { throw "robocopy failed with $LASTEXITCODE" }
$global:LASTEXITCODE = 0

# Turbopack refuses a node_modules symlink that points outside the project root, so the
# mirror gets its own install. /MIR excludes node_modules, so it survives between runs
# and only has to be redone when the lockfile changes.
$modules = Join-Path $work 'node_modules'
$stamp = Join-Path $work '.lock-stamp'
$lockHash = (Get-FileHash (Join-Path $source 'package-lock.json') -Algorithm SHA256).Hash

# An earlier version of this script junctioned node_modules across. `npm ci` clears
# node_modules before installing and follows that junction, which empties the SOURCE
# tree. Delete any leftover reparse point before npm can walk through it.
if (Test-Path $modules) {
  $item = Get-Item $modules -Force
  if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) {
    Write-Host "removing a stale node_modules junction in the build mirror"
    cmd /c rmdir "$modules" | Out-Null
  }
}

if (-not (Test-Path $modules) -or -not (Test-Path $stamp) -or (Get-Content $stamp -Raw).Trim() -ne $lockHash) {
  Write-Host "installing dependencies in the build mirror (lockfile changed)..."
  Push-Location $work
  try {
    npm ci --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) { throw "npm ci failed with $LASTEXITCODE" }
  } finally {
    Pop-Location
  }
  Set-Content -Path $stamp -Value $lockHash -Encoding utf8
}

Push-Location $work
try {
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "next build failed with $LASTEXITCODE" }
} finally {
  Pop-Location
}

$out = Join-Path $source 'out'
if (Test-Path $out) { Remove-Item $out -Recurse -Force }
robocopy (Join-Path $work 'out') $out /MIR /NFL /NDL /NJH /NJS /NP | Out-Null
if ($LASTEXITCODE -ge 8) { throw "copying out/ back failed with $LASTEXITCODE" }
$global:LASTEXITCODE = 0

$pages = (Get-ChildItem $out -Recurse -Filter index.html).Count
Write-Host ""
Write-Host "built $pages pages into $out"
