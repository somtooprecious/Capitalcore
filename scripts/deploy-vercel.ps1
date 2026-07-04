# CapitalCore — Vercel production deploy helper
# Run from project root after: npx vercel login

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot + "\.."

Write-Host "Checking Vercel auth..." -ForegroundColor Cyan
npx vercel whoami
if ($LASTEXITCODE -ne 0) {
  Write-Host "Run: npx vercel login" -ForegroundColor Yellow
  exit 1
}

Write-Host "Linking Vercel project (capitalcore)..." -ForegroundColor Cyan
npx vercel link --yes --project capitalcore 2>$null
if ($LASTEXITCODE -ne 0) {
  npx vercel link --yes
}

$envFile = ".env.local"
if (-not (Test-Path $envFile)) {
  $envFile = ".env"
}

if (-not (Test-Path $envFile)) {
  Write-Host "No .env.local or .env found. Add env vars manually in Vercel dashboard." -ForegroundColor Yellow
} else {
  Write-Host "Uploading env vars from $envFile to Vercel (Production)..." -ForegroundColor Cyan
  $keys = @(
    "DATABASE_URL", "DIRECT_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL",
    "NEXT_PUBLIC_APP_URL", "SMTP_HOST", "SMTP_PORT", "SMTP_SECURE",
    "SMTP_USER", "SMTP_PASS", "SMTP_FROM", "CRYPTO_BTC_ADDRESS",
    "CRYPTO_USDT_ADDRESS", "CRYPTO_ETH_ADDRESS", "OWNER_EMAIL",
    "OWNER_PASSWORD", "GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"
  )

  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$' -and $_ -notmatch '^\s*#') {
      $name = $Matches[1]
      $value = $Matches[2].Trim().Trim('"').Trim("'")
      if ($name -in $keys -and $value) {
        Write-Host "  -> $name"
        $value | npx vercel env add $name production --force 2>$null
      }
    }
  }
}

Write-Host "Deploying to production..." -ForegroundColor Cyan
npx vercel --prod --yes

Write-Host ""
Write-Host "Done. Open your Vercel dashboard for the live URL." -ForegroundColor Green
Write-Host "Then update NEXTAUTH_URL and NEXT_PUBLIC_APP_URL to that URL if not set yet." -ForegroundColor Yellow
Write-Host "Run against production DB: npx prisma db push" -ForegroundColor Yellow
