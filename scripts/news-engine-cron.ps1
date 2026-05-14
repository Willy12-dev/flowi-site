# news-engine-cron.ps1 -- local cron runner for the Flowi news engine.
#
# Runs daily at 06:00 local time via Windows Task Scheduler.
# Loads env vars from .env.local, runs the drafter, commits, and pushes
# with rebase-retry to handle any concurrent commits from the chat session.
#
# Install once with:
#   scripts/install-news-engine-task.ps1
# Uninstall:
#   Unregister-ScheduledTask -TaskName FlowiNewsEngine -Confirm:$false
# Manual run (test):
#   powershell -ExecutionPolicy Bypass -File scripts/news-engine-cron.ps1

$ErrorActionPreference = "Continue"

# Resolve project root: this script lives at <root>/scripts/, so root = parent.
$ScriptDir   = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

# --- Logging ---
$LogDir = Join-Path $ProjectRoot ".news-engine-logs"
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null
$Timestamp = Get-Date -Format "yyyy-MM-ddTHH-mm-ss"
$LogFile = Join-Path $LogDir "$Timestamp.log"

function Log {
    param([string]$Message)
    $line = "[$([DateTime]::Now.ToString('yyyy-MM-dd HH:mm:ss'))] $Message"
    Add-Content -Path $LogFile -Value $line
    Write-Host $line
}

Log "== Flowi News Engine - local cron =="
Log "PWD: $ProjectRoot"

# --- Load .env.local ---
$EnvFile = Join-Path $ProjectRoot ".env.local"
if (-not (Test-Path $EnvFile)) {
    Log "FATAL: .env.local not found at $EnvFile"
    exit 1
}

Get-Content $EnvFile | ForEach-Object {
    if ($_ -match '^\s*([A-Z][A-Z0-9_]*)\s*=\s*(.*)$') {
        $key   = $matches[1]
        $value = $matches[2].Trim()
        if ($value -match '^"(.*)"$' -or $value -match "^'(.*)'$") {
            $value = $matches[1]
        }
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

if (-not $env:GEMINI_API_KEY -and -not $env:ANTHROPIC_API_KEY) {
    Log "FATAL: neither GEMINI_API_KEY nor ANTHROPIC_API_KEY found in .env.local"
    exit 1
}

if ($env:GEMINI_API_KEY) {
    Log "Provider: gemini (free tier)"
} else {
    Log "Provider: claude (no Gemini key found)"
}

# --- Run the engine ---
Log "Running news-engine.mjs --count 10 ..."
$NodeArgs = @("$ProjectRoot\scripts\news-engine.mjs", "--count", "10")
$EngineOutput = & node @NodeArgs 2>&1
$EngineExit = $LASTEXITCODE
$EngineOutput | ForEach-Object { Add-Content -Path $LogFile -Value $_ }
Log "Engine exit code: $EngineExit"

if ($EngineExit -ne 0) {
    Log "FATAL: engine exited non-zero. See log above. Skipping commit."
    exit $EngineExit
}

# --- Commit + push ---
& git -C $ProjectRoot add content/carousel-specs/ content/news-engine-state.json | Out-Null

# Check if anything actually changed
& git -C $ProjectRoot diff --cached --quiet
$DiffExit = $LASTEXITCODE
if ($DiffExit -eq 0) {
    Log "Nothing to commit (engine drafted 0 specs or state unchanged)."
    Log "== Done =="
    exit 0
}

$Date = Get-Date -Format "yyyy-MM-dd"
$StagedFiles = & git -C $ProjectRoot diff --cached --name-only
$NewSpecsCount = ($StagedFiles | Where-Object { $_ -match 'carousel-specs/news-.*\.json$' } | Measure-Object).Count
$CommitMsg = "news: $Date - $NewSpecsCount carousels drafted by the local cron"

Log "Committing: $CommitMsg"
$CommitOutput = & git -C $ProjectRoot commit -m $CommitMsg 2>&1
$CommitOutput | ForEach-Object { Add-Content -Path $LogFile -Value $_ }

# Push with rebase-retry loop
$PushAttempts = 5
$PushOk = $false
for ($i = 1; $i -le $PushAttempts; $i++) {
    Log "Push attempt $i of $PushAttempts ..."
    $PushOutput = & git -C $ProjectRoot push origin master 2>&1
    $PushOutput | ForEach-Object { Add-Content -Path $LogFile -Value $_ }
    if ($LASTEXITCODE -eq 0) {
        Log "Pushed successfully on attempt $i. $NewSpecsCount new draft(s) live."
        $PushOk = $true
        break
    }
    Log "Push rejected on attempt $i - rebasing on origin/master..."
    & git -C $ProjectRoot fetch origin master 2>&1 | ForEach-Object { Add-Content -Path $LogFile -Value $_ }
    & git -C $ProjectRoot rebase origin/master 2>&1 | ForEach-Object { Add-Content -Path $LogFile -Value $_ }
    if ($LASTEXITCODE -ne 0) {
        Log "FATAL: rebase conflict, aborting."
        & git -C $ProjectRoot rebase --abort 2>&1 | ForEach-Object { Add-Content -Path $LogFile -Value $_ }
        exit 1
    }
}

if ($PushOk) {
    Log "== Done =="
    exit 0
}

Log "Push failed after $PushAttempts attempts. Giving up."
exit 1
