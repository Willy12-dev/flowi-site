# install-news-engine-task.ps1
#
# Registers a Windows Scheduled Task that runs the Flowi news engine
# daily at 06:00 local time. Drafts 10 carousels via Gemini (free),
# commits + pushes to the flowi-site repo automatically.
#
# Run once from PowerShell:
#   powershell -ExecutionPolicy Bypass -File scripts/install-news-engine-task.ps1
#
# Verify:    Get-ScheduledTask -TaskName FlowiNewsEngine
# Run now:   Start-ScheduledTask -TaskName FlowiNewsEngine
# Logs:      Get-ChildItem .news-engine-logs/ | Sort-Object LastWriteTime -Desc | Select-Object -First 1 | Get-Content
# Remove:    Unregister-ScheduledTask -TaskName FlowiNewsEngine -Confirm:$false

$TaskName    = "FlowiNewsEngine"
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$Runner      = Join-Path $ScriptDir "news-engine-cron.ps1"

if (-not (Test-Path $Runner)) {
    Write-Host "ERROR: runner script not found at $Runner" -ForegroundColor Red
    exit 1
}

Write-Host "Installing scheduled task '$TaskName'..." -ForegroundColor Cyan
Write-Host "  Runner: $Runner"
Write-Host "  Schedule: daily at 06:00 local time"
Write-Host "  Catch-up: if machine was off, runs as soon as it boots"
Write-Host ""

# Remove existing task if present (idempotent re-install)
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Found existing task. Removing first..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Runner`"" `
    -WorkingDirectory $ProjectRoot

# Daily at 06:00 local
$Trigger = New-ScheduledTaskTrigger -Daily -At 6am

$Settings = New-ScheduledTaskSettingsSet `
    -StartWhenAvailable `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -DontStopOnIdleEnd `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 15) `
    -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 15)

Register-ScheduledTask `
    -TaskName $TaskName `
    -Description "Flowi News Engine — drafts 10 AI carousels daily via Gemini, commits to flowi-site repo" `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -RunLevel Limited | Out-Null

Write-Host ""
Write-Host "[OK] Task '$TaskName' installed." -ForegroundColor Green
Write-Host ""
Write-Host "Verify with: Get-ScheduledTask -TaskName $TaskName"
Write-Host "Run now:     Start-ScheduledTask -TaskName $TaskName"
Write-Host "View logs:   Get-ChildItem $ProjectRoot\.news-engine-logs | Sort-Object LastWriteTime -Desc | Select-Object -First 1 | Get-Content"
Write-Host "Remove:      Unregister-ScheduledTask -TaskName $TaskName -Confirm:`$false"
