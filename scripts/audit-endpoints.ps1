# Auditoria tecnica GRE SMART CONTROL
# Ejecutar: powershell -File scripts/audit-endpoints.ps1

$base = "http://localhost:3001/api"
$results = New-Object System.Collections.Generic.List[object]

function Add-Result {
    param([string]$Name, [int]$Status, [bool]$OK, [string]$Error = "")
    $results.Add([pscustomobject]@{ Name = $Name; Status = $Status; OK = $OK; Error = $Error })
}

Write-Host "=== GRE SMART CONTROL - Auditoria de endpoints ===" -ForegroundColor Cyan

try {
    $h = Invoke-RestMethod -Uri "$base/health" -TimeoutSec 30
    Add-Result "Health" 200 $true
} catch { Add-Result "Health" 0 $false $_.Exception.Message }

try {
    $hdb = Invoke-RestMethod -Uri "$base/health/db" -TimeoutSec 30
    Add-Result "Health DB" 200 $true
} catch { Add-Result "Health DB" 0 $false $_.Exception.Message }

$loginBody = '{"email":"admin@gre-demo.pe","password":"Demo2024!"}'
$adminToken = $null
try {
    $login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -Body $loginBody -ContentType "application/json" -TimeoutSec 30
    $adminToken = $login.data.tokens.accessToken
    Add-Result "Login Admin" 200 $true
} catch {
    Add-Result "Login Admin" 0 $false $_.Exception.Message
    $results | Format-Table -AutoSize
    exit 1
}

$auth = @{ Authorization = "Bearer $adminToken" }

foreach ($ep in @(
    @{ N = "Auth Profile"; P = "/auth/profile" },
    @{ N = "Dashboard Summary"; P = "/dashboard/summary" },
    @{ N = "Dashboard KPIs"; P = "/dashboard/kpis" },
    @{ N = "Dashboard Charts"; P = "/dashboard/charts" },
    @{ N = "Dashboard Recent GRE"; P = "/dashboard/recent-gre" },
    @{ N = "Dashboard Recent Incidents"; P = "/dashboard/recent-incidents" },
    @{ N = "Dashboard Recent Alerts"; P = "/dashboard/recent-alerts" },
    @{ N = "Dashboard Critical Products"; P = "/dashboard/critical-products" },
    @{ N = "Users List"; P = "/users?page=1&limit=5" },
    @{ N = "Users Roles"; P = "/users/roles" },
    @{ N = "Products List"; P = "/products?page=1&limit=5" },
    @{ N = "GRE List"; P = "/gre?page=1&limit=5" },
    @{ N = "Kardex List"; P = "/kardex?page=1&limit=5" },
    @{ N = "Inventory List"; P = "/inventory?page=1&limit=5" },
    @{ N = "Reconciliation List"; P = "/reconciliation?page=1&limit=5" },
    @{ N = "Incidents List"; P = "/incidents?page=1&limit=5" },
    @{ N = "Alerts List"; P = "/alerts?page=1&limit=5" }
)) {
    try {
        Invoke-RestMethod -Uri "$base$($ep.P)" -Headers $auth -TimeoutSec 30 | Out-Null
        Add-Result $ep.N 200 $true
    } catch {
        $code = 0
        if ($_.Exception.Response) { $code = [int]$_.Exception.Response.StatusCode }
        Add-Result $ep.N $code $false $_.Exception.Message
    }
}

try {
    $sw = Invoke-WebRequest -Uri "http://localhost:3001/api/docs" -UseBasicParsing -TimeoutSec 15
    Add-Result "Swagger UI" $sw.StatusCode ($sw.StatusCode -eq 200)
} catch { Add-Result "Swagger UI" 0 $false $_.Exception.Message }

try {
    Invoke-RestMethod -Uri "$base/products" -TimeoutSec 15 -ErrorAction Stop | Out-Null
    Add-Result "Products sin auth (debe 401)" 200 $false "Deberia rechazar sin token"
} catch {
    $code = [int]$_.Exception.Response.StatusCode
    Add-Result "Products sin auth (debe 401)" $code ($code -eq 401)
}

try {
    $cl = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -Body '{"email":"consulta@gre-demo.pe","password":"Demo2024!"}' -ContentType "application/json" -TimeoutSec 30
    $ct = $cl.data.tokens.accessToken
    $cb = '{"codigo":"AUDIT-X","nombre":"Test","categoria":"Test","unidadMedida":"UND","stockActual":0,"stockMinimo":0}'
    try {
        Invoke-RestMethod -Uri "$base/products" -Method POST -Headers @{ Authorization = "Bearer $ct" } -Body $cb -ContentType "application/json" -TimeoutSec 30 -ErrorAction Stop | Out-Null
        Add-Result "Consulta POST producto (debe 403)" 200 $false
    } catch {
        $code = [int]$_.Exception.Response.StatusCode
        Add-Result "Consulta POST producto (debe 403)" $code ($code -eq 403)
    }
} catch { Add-Result "Rol Consulta verificacion" 0 $false $_.Exception.Message }

Write-Host ""
$results | Format-Table -AutoSize
$passed = ($results | Where-Object { $_.OK }).Count
$total = $results.Count
Write-Host "Resultado: $passed/$total endpoints OK"
if ($passed -ne $total) { exit 1 }
