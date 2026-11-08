# Master Foundation v6.5 - All-in-One Device Setup Script
# Configures git hooks, syncs global agent skills, sets review gate rules,
# and interactively generates or verifies the device's cryptographic signing key.

[CmdletBinding()]
param (
    [string]$SignerId = "",
    [string]$SignerName = "",
    [switch]$SkipKey,
    [switch]$Force
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Master Foundation v6.5 - Device Setup & Verification" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$repoRoot = (Resolve-Path "$PSScriptRoot\..").Path
Set-Location $repoRoot

# 1. Check Node.js
Write-Host "`n[1/5] Checking Node.js environment..." -ForegroundColor Yellow
try {
    $nodeVer = & node -v
    Write-Host "  -> Node.js detected: $nodeVer" -ForegroundColor Green
} catch {
    Write-Error "Node.js is required but not found in PATH. Please install Node.js (v18+) first."
    exit 1
}

# 2. Configure Git Hooks
Write-Host "`n[2/5] Configuring Git hooks..." -ForegroundColor Yellow
try {
    & git config core.hooksPath .githooks
    Write-Host "  -> Git hooks path set to: .githooks" -ForegroundColor Green
} catch {
    Write-Warning "Failed to set git config core.hooksPath. Ensure this is a git repository."
}

# 3. Synchronize Skills Globally
Write-Host "`n[3/5] Synchronizing Master Foundation skill across global agent environments..." -ForegroundColor Yellow
$syncScript = Join-Path $repoRoot "scripts\sync-skills.ps1"
if (Test-Path $syncScript) {
    & powershell -ExecutionPolicy Bypass -File $syncScript
} else {
    Write-Warning "sync-skills.ps1 not found, skipping global skill sync."
}

# 4. Update ~/.gemini/GEMINI.md Review Gate Rule
Write-Host "`n[4/5] Checking user-global rules (~/.gemini/GEMINI.md)..." -ForegroundColor Yellow
$userGeminiDir = Join-Path $env:USERPROFILE ".gemini"
$userGeminiFile = Join-Path $userGeminiDir "GEMINI.md"

$ruleHeader = "# بوابة المراجعة (Master Foundation v6.5)"
$ruleText = @"

$ruleHeader
قبل أي تنفيذ (تعديل أو حذف ملفات، أو أمر يغيّر شيئاً، أو تثبيت، أو نشر):
1. اقرأ مهارة master-foundation الآن. لا تعتمد على الذاكرة. وهي الأولى دائماً قبل أي مهارة أخرى.
2. بوابة المحادثة (Chat Gate لـ L0–L2): اكتب التصنيف (L0-L3 / AUDIT)، أسماء المهارات، وخطة مقتضبة، وما الذي سيتغير (مع عرض الفروقات/الاستعلام لـ L2 الحساس).
3. توقف وانتظر كلمة "نفّذ" مني. لا تعدّل أي شيء قبلها (مسموح دون انتظار: الإجابة عن الأسئلة، قراءة الملفات، والبحث). لا تنفيذ لمهام L3 دون اعتماد مشفر للخطة (Cryptographic Spec Gate عبر Plannotator RTL و APPROVAL.json)؛ ولا عمليات خارجية دون تفويض تشغيلي مستقل (Operational Approval).
"@

if (-not (Test-Path $userGeminiDir)) {
    New-Item -ItemType Directory -Path $userGeminiDir -Force | Out-Null
}

if (-not (Test-Path $userGeminiFile)) {
    Set-Content -Path $userGeminiFile -Value $ruleText -Encoding UTF8
    Write-Host "  -> Created ~/.gemini/GEMINI.md with Master Foundation v6.5 rules." -ForegroundColor Green
} else {
    $existing = Get-Content -Path $userGeminiFile -Raw -Encoding UTF8
    if ($existing -notmatch "Master Foundation v6\.5") {
        # Replace old v6.4 section if present, otherwise append
        if ($existing -match "# بوابة المراجعة \(Master Foundation\)") {
            $existing = $existing -replace "(?s)# بوابة المراجعة \(Master Foundation\).*?(?=(\Z|#[^#]))", $ruleText
            Set-Content -Path $userGeminiFile -Value $existing -Encoding UTF8
            Write-Host "  -> Updated ~/.gemini/GEMINI.md to Master Foundation v6.5." -ForegroundColor Green
        } else {
            Add-Content -Path $userGeminiFile -Value $ruleText -Encoding UTF8
            Write-Host "  -> Appended Master Foundation v6.5 rule to ~/.gemini/GEMINI.md." -ForegroundColor Green
        }
    } else {
        Write-Host "  -> ~/.gemini/GEMINI.md already contains Master Foundation v6.5 rule." -ForegroundColor Green
    }
}

# 5. Device Cryptographic Signing Key Setup
Write-Host "`n[5/5] Checking Device Cryptographic Signing Key (Ed25519)..." -ForegroundColor Yellow
$privKeyPath = Join-Path $env:USERPROFILE ".mf\id_ed25519"

if (-not $SkipKey) {
    if ((Test-Path $privKeyPath) -and (-not $Force)) {
        Write-Host "  -> Existing private key found at: $privKeyPath" -ForegroundColor Green
    } else {
        Write-Host "`n  -----------------------------------------------------------" -ForegroundColor Cyan
        Write-Host "  🔐 Device Cryptographic Signer Setup" -ForegroundColor Cyan
        Write-Host "  Master Foundation v6.5 uses Ed25519 digital signatures to" -ForegroundColor Cyan
        Write-Host "  authorize architectural plans (L3) and prevent AI tampering." -ForegroundColor Cyan
        Write-Host "  -----------------------------------------------------------" -ForegroundColor Cyan

        if ([string]::IsNullOrWhiteSpace($SignerId)) {
            try {
                $gitUser = (& git config user.name).Trim().ToLower() -replace '[^a-z0-9_-]', '_'
            } catch {
                $gitUser = "developer"
            }
            $hostname = $env:COMPUTERNAME.ToLower() -replace '[^a-z0-9_-]', '_'
            $defaultId = "${gitUser}_${hostname}"
            
            $inputSigner = Read-Host "  Enter an identifier for this device (Press Enter for '$defaultId')"
            if ([string]::IsNullOrWhiteSpace($inputSigner)) {
                $SignerId = $defaultId
            } else {
                $SignerId = $inputSigner.Trim().ToLower() -replace '[^a-z0-9_-]', '_'
            }
        }

        if ([string]::IsNullOrWhiteSpace($SignerName)) {
            $SignerName = "$SignerId ($($env:COMPUTERNAME))"
        }

        Write-Host "  -> Generating local key pair for signer: '$SignerId'..." -ForegroundColor Yellow
        $genArgs = @("scripts/check-approval.mjs", "--generate-key", "--id", $SignerId, "--name", $SignerName)
        if ($Force) { $genArgs += "--force" }
        & node $genArgs
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to generate signing key."
            exit 1
        }
        Write-Host "  -> Public key registered in .mf/allowed_signers.json" -ForegroundColor Green
    }
} else {
    Write-Host "  -> Key generation skipped (-SkipKey specified)." -ForegroundColor Gray
}

# 6. Run Gate Regression Tests
Write-Host "`n[VERIFY] Running full 29-test verification suite..." -ForegroundColor Yellow
& node scripts/test-check-approval.mjs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Verification tests failed!"
    exit 1
}

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "🎉 SUCCESS: Device is 100% configured for Master Foundation v6.5!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
