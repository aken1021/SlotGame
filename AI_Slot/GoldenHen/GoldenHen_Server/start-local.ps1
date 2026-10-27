$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    New-Item -ItemType Directory -Force -Path 'bin' | Out-Null
    & go build -o 'bin/goldenhen.exe' './cmd/goldenhen'
    if ($LASTEXITCODE -ne 0) { throw 'Go build failed' }
    & '.\bin\goldenhen.exe' -config 'config/development.json' -data 'data/development-v1.journal' -allow-development-math
    if ($LASTEXITCODE -ne 0) { throw "Server exited with code $LASTEXITCODE" }
} finally { Pop-Location }
