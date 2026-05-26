Write-Host "=== Publishing @cristhobal/vitals ===" -ForegroundColor Yellow

Push-Location "P:\astro-doctor\packages\core"
Write-Host "  Publishing @cristhobal/vitals-core..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Push-Location "P:\astro-doctor\packages\astro-doctor"
Write-Host "  Publishing @cristhobal/vitals..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Push-Location "P:\astro-doctor\packages\eslint-plugin-astro-doctor"
Write-Host "  Publishing @cristhobal/eslint-plugin-vitals..." -NoNewline
$result = npm publish --access public 2>&1
if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green } else { Write-Host " FAILED"; Write-Host $result; Pop-Location; exit 1 }
Pop-Location

Write-Host "`n=== Done! ===" -ForegroundColor Green
Write-Host "Run: npx @cristhobal/vitals@latest P:\test-astro-doctor" -ForegroundColor Cyan
