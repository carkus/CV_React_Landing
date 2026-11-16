<#
.SYNOPSIS
    Stops the running CV React Landing dev server (if any), then starts a
    fresh one with `npm run dev`.

.DESCRIPTION
    Vite serves on 5173 by default. Other Vite projects often use that port
    too, so the listener is only killed if the page it serves is actually
    this site (its <title> contains "Mark Scicluna").

.EXAMPLE
    ./killrun.ps1
#>

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 5173
$url = "http://localhost:$port"
$siteMarker = 'Mark Scicluna'

function Get-ListenerPids {
    param([int]$Port)
    @(
        Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue |
            Select-Object -ExpandProperty OwningProcess -Unique
    )
}

$pids = Get-ListenerPids -Port $port
if ($pids) {
    $servesSite = $false
    try {
        $servesSite = (Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 2).Content -like "*$siteMarker*"
    } catch {}

    if ($servesSite) {
        foreach ($procId in $pids) {
            Write-Host "Stopping PID $procId (and its child processes) on port $port ..." -ForegroundColor Yellow
            # /T takes the whole tree (node + esbuild children) down with it.
            & taskkill /T /F /PID $procId 2>&1 | Out-Null
        }
        # Give the OS a moment to release the port so Vite doesn't fall back to 5174.
        for ($i = 0; $i -lt 20; $i++) {
            if (-not (Get-ListenerPids -Port $port)) { break }
            Start-Sleep -Milliseconds 250
        }
    } else {
        Write-Warning "Port $port is in use by a different app (not this site) - not touching it. Vite will pick the next free port."
    }
} else {
    Write-Host "No running dev server found - just starting." -ForegroundColor DarkGray
}

Set-Location $root
Write-Host "Starting npm run dev ..." -ForegroundColor Cyan
npm run dev
