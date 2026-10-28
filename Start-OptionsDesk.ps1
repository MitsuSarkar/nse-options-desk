$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
$appUrl = 'http://127.0.0.1:4173/'
$listener = Get-NetTCPConnection -LocalPort 4173 -State Listen -ErrorAction SilentlyContinue
if (-not $listener) {
    $nodePath = (Get-Command node -ErrorAction Stop).Source
    Start-Process -FilePath $nodePath -ArgumentList 'server.cjs' -WorkingDirectory $PSScriptRoot -WindowStyle Hidden
    Start-Sleep -Seconds 2
}
$edgePaths = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe")
$edgePath = $edgePaths | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if ($edgePath) { Start-Process -FilePath $edgePath -ArgumentList "--app=$appUrl" } else { Start-Process $appUrl }
