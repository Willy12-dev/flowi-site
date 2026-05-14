# install-news-engine-task.ps1
# Registers a Windows Scheduled Task that runs the Flowi news engine
# daily at 06:00 local time. Drafts up to 10 carousels via Gemini,
# commits + pushes to flowi-site repo automatically.
#
# Run once:
#   powershell -ExecutionPolicy Bypass -File scripts/install-news-engine-task.ps1
#
# Manage: see scripts/news-engine-cron.ps1 header for verify/run/remove commands.

$TaskName    = "FlowiNewsEngine"
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$Runner      = Join-Path $ScriptDir "news-engine-cron.ps1"

if (-not (Test-Path $Runner)) {
    Write-Host "ERROR: runner script not found at $Runner" -ForegroundColor Red
    exit 1
}

Write-Host "Installing scheduled task $TaskName ..." -ForegroundColor Cyan
Write-Host "  Runner:   $Runner"
Write-Host "  Schedule: daily at 06:00 local time"

# Remove existing task if present (idempotent re-install)
$existing = Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Removing existing task before re-install..." -ForegroundColor Yellow
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
}

$Action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$Runner`"" `
    -WorkingDirectory $ProjectRoot

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
    -Description "Flowi News Engine - drafts AI carousels daily via Gemini" `
    -Action $Action `
    -Trigger $Trigger `
    -Settings $Settings `
    -RunLevel Limited | Out-Null

Write-Host ""
Write-Host "Task $TaskName installed." -ForegroundColor Green
Write-Host "Next run: tomorrow at 06:00 local."
Write-Host "To run now: Start-ScheduledTask -TaskName $TaskName"
