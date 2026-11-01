# PowerShell script to synchronize master-foundation skill across local distribution and global paths
# Ensures clean synchronization without leaving stale files inside master-foundation.

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
$sourceDir = Join-Path $repoRoot ".agents\skills\master-foundation"
$localDistDir = Join-Path $repoRoot "skills\master-foundation"

$globalTargets = @(
    $localDistDir,
    "$env:USERPROFILE\.gemini\config\skills\master-foundation",
    "$env:USERPROFILE\.agents\skills\master-foundation",
    "$env:USERPROFILE\.claude\skills\master-foundation"
)

Write-Host "=== Syncing master-foundation skill ===" -ForegroundColor Cyan
Write-Host "Source: $sourceDir"

if (-not (Test-Path $sourceDir)) {
    Write-Error "Source master-foundation directory not found: $sourceDir"
    exit 1
}

# Collect relative paths from source
$sourceFiles = Get-ChildItem -Path $sourceDir -Recurse -File
$sourceRelPaths = @($sourceFiles | ForEach-Object {
    $_.FullName.Substring($sourceDir.Length).TrimStart('\', '/')
})

foreach ($target in $globalTargets) {
    # If it's a global directory that does not exist and is optional, create if parent exists
    $parent = Split-Path $target -Parent
    if (-not (Test-Path $parent)) {
        continue
    }

    Write-Host "`nTarget: $target" -ForegroundColor Yellow
    if (-not (Test-Path $target)) {
        New-Item -ItemType Directory -Path $target -Force | Out-Null
    }

    # 1. Copy/overwrite files from source
    foreach ($file in $sourceFiles) {
        $relPath = $file.FullName.Substring($sourceDir.Length).TrimStart('\', '/')
        $destFile = Join-Path $target $relPath
        $destDir = Split-Path $destFile -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item -Path $file.FullName -Destination $destFile -Force
    }
    Write-Host "  -> Synced $($sourceFiles.Count) files." -ForegroundColor Green

    # 2. Clean up extraneous files inside master-foundation target
    $targetFiles = Get-ChildItem -Path $target -Recurse -File
    foreach ($tf in $targetFiles) {
        $rel = $tf.FullName.Substring($target.Length).TrimStart('\', '/')
        if ($sourceRelPaths -notcontains $rel) {
            Write-Host "  [CLEANUP] Removing stale file: $rel" -ForegroundColor Red
            Remove-Item -Path $tf.FullName -Force
        }
    }
}

Write-Host "`n=== Sync completed successfully! ===" -ForegroundColor Cyan
