# GymManagementSystem API Test Script
$BaseUrl = "http://localhost:5053/api"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GYM MANAGEMENT SYSTEM API TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl" -ForegroundColor Yellow
Write-Host ""

$Passed = 0
$Failed = 0

function Test-Api {
    param($Name, $Endpoint)
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl$Endpoint" -Method GET -ErrorAction Stop
        Write-Host "✅ $Name - OK" -ForegroundColor Green
        $script:Passed++
    } catch {
        Write-Host "❌ $Name - Failed" -ForegroundColor Red
        $script:Failed++
    }
}

Write-Host "[1] DASHBOARD TESTS" -ForegroundColor Yellow
Test-Api "Dashboard Stats" "/Dashboard/stats"
Test-Api "Recent Members" "/Dashboard/recent-members?count=5"
Test-Api "Revenue by Month" "/Dashboard/revenue-by-month"
Write-Host ""

Write-Host "[2] MEMBERS TESTS" -ForegroundColor Yellow
Test-Api "Get All Members" "/Members"
Write-Host ""

Write-Host "[3] TRAINERS TESTS" -ForegroundColor Yellow
Test-Api "Get All Trainers" "/Trainers"
Write-Host ""

Write-Host "[4] CLASSES TESTS" -ForegroundColor Yellow
Test-Api "Get All Classes" "/Classes"
Write-Host ""

Write-Host "[5] PAYMENT TESTS" -ForegroundColor Yellow
Test-Api "Get All Payments" "/Payment"
Write-Host ""

Write-Host "[6] ATTENDANCE TESTS" -ForegroundColor Yellow
Test-Api "Today's Attendance" "/Attendance/today"
Test-Api "Attendance Summary" "/Attendance/summary"
Write-Host ""

Write-Host "[7] BRANCH TESTS" -ForegroundColor Yellow
Test-Api "Get All Branches" "/Branch"
Write-Host ""

Write-Host "[8] QR CODE TESTS" -ForegroundColor Yellow
Test-Api "QR Code Statistics" "/QRCode/statistics"
Write-Host ""

Write-Host "[9] INVOICE TESTS" -ForegroundColor Yellow
Test-Api "Member Invoices" "/Invoice/member/1"
Write-Host ""

Write-Host "[10] WORKOUT TESTS" -ForegroundColor Yellow
Test-Api "Get All Workouts" "/Workout"
Write-Host ""

Write-Host "[11] EMAIL TESTS" -ForegroundColor Yellow
Test-Api "Email Test" "/Email/test"
Write-Host ""

$Total = $Passed + $Failed
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $Total" -ForegroundColor White
Write-Host "Passed: $Passed" -ForegroundColor Green
Write-Host "Failed: $Failed" -ForegroundColor Red

if ($Failed -eq 0) {
    Write-Host "`n🎉 ALL TESTS PASSED!" -ForegroundColor Green
} else {
    Write-Host "`n⚠️ Some tests failed." -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "API TESTING COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
