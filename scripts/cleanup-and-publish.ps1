Write-Host "=== Unpublishing OLD packages ===" -ForegroundColor Yellow

$oldPackages = @(
  "@cristhobal/vitals-core@0.1.1",
  "@cristhobal/vitals-core@0.1.2",
  "@cristhobal/vitals@0.1.0",
  "@cristhobal/vitals@0.1.1",
  "@cristhobal/eslint-plugin-vitals@0.1.0",
  "@cristhobal/eslint-plugin-vitals@0.1.1",
  "extremis-core@0.1.0",
  "extremis@0.1.0",
  "eslint-plugin-extremis@0.1.0",
  "medic-core@0.1.2",
  "astro-doctor-core@0.1.2",
  "astro-doctor@0.1.0",
  "astro-doctor@0.1.1",
  "astro-doctor@0.1.2",
  "eslint-plugin-astro-doctor@0.1.0",
  "eslint-plugin-astro-doctor@0.1.1",
  "eslint-plugin-astro-doctor@0.1.2"
)

foreach ($pkg in $oldPackages) {
  Write-Host "  Unpublishing $pkg..." -NoNewline
  $result = npm unpublish $pkg 2>&1
  if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green }
  else { Write-Host " SKIPPED" -ForegroundColor DarkYellow }
}

Write-Host "`n=== Publishing diagnost ===" -ForegroundColor Yellow

Push-Location "P:\astro-doctor\packages\core"
Write-Host "  Publishing diagnost-core..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Push-Location "P:\astro-doctor\packages\astro-doctor"
Write-Host "  Publishing diagnost..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Push-Location "P:\astro-doctor\packages\eslint-plugin-astro-doctor"
Write-Host "  Publishing eslint-plugin-diagnost..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Run: npx diagnost@latest P:\test-astro-doctor" -ForegroundColor Cyan
