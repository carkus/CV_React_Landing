[CmdletBinding()]
param(
    [string]$ServerHost = "170.64.223.82",
    [string]$SshUser    = "root",
    [string]$RemotePath = "/var/www/carkus.com",
    [string]$LocalPath  = "$PSScriptRoot\dist"
)

$winscp = "C:\Program Files (x86)\WinSCP\winscp.com"
if (-not (Test-Path $winscp)) { $winscp = "C:\Program Files\WinSCP\winscp.com" }
if (-not (Test-Path $winscp)) { Write-Error "WinSCP not found."; exit 1 }

Write-Host "Building..."
npm run build
if ($LASTEXITCODE -ne 0) { Write-Error "Build failed."; exit 1 }

Write-Host "Uploading to $ServerHost`:$RemotePath ..."

& $winscp /log="deploy.log" /command `
    "open sftp://${SshUser}@${ServerHost}/ -hostkey=*" `
    "synchronize remote `"$LocalPath`" `"$RemotePath`"" `
    "exit"

if ($LASTEXITCODE -ne 0) { Write-Error "Upload failed. Check deploy.log."; exit 1 }

Write-Host "Done. https://mscicluna.com/"
