$src     = "$PSScriptRoot\public"
$dataRepo = "c:\_work\carkus-data"

Write-Host "Syncing data to carkus-data..." -ForegroundColor Cyan

# JSON files only - images live in public/img/ and deploy with the site
Copy-Item "$src\data\*.json" "$dataRepo\" -Force

# Commit and push
git -C $dataRepo add .
$changed = git -C $dataRepo status --porcelain
if ($changed) {
    git -C $dataRepo commit -m "sync from CV_React_Landing $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
    git -C $dataRepo push
    Write-Host "Done. Changes pushed to carkus-data." -ForegroundColor Green
} else {
    Write-Host "Nothing to sync - carkus-data is already up to date." -ForegroundColor Yellow
}
