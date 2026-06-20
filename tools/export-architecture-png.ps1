Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$output = Join-Path $root "architecture.png"

$bitmap = New-Object System.Drawing.Bitmap 1600, 1000
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$colors = @{
  Bg = [System.Drawing.Color]::FromArgb(248, 250, 247)
  Ink = [System.Drawing.Color]::FromArgb(23, 33, 36)
  Muted = [System.Drawing.Color]::FromArgb(96, 113, 117)
  Line = [System.Drawing.Color]::FromArgb(217, 226, 223)
  White = [System.Drawing.Color]::White
  Green = [System.Drawing.Color]::FromArgb(31, 122, 92)
  Teal = [System.Drawing.Color]::FromArgb(31, 111, 122)
  Coral = [System.Drawing.Color]::FromArgb(201, 95, 77)
  Gold = [System.Drawing.Color]::FromArgb(184, 132, 25)
}

$fontTitle = New-Object System.Drawing.Font "Arial", 34, ([System.Drawing.FontStyle]::Bold)
$fontMain = New-Object System.Drawing.Font "Arial", 24, ([System.Drawing.FontStyle]::Bold)
$fontSmall = New-Object System.Drawing.Font "Arial", 18, ([System.Drawing.FontStyle]::Regular)
$fontSmallBold = New-Object System.Drawing.Font "Arial", 18, ([System.Drawing.FontStyle]::Bold)

function Brush($name) {
  return New-Object System.Drawing.SolidBrush $colors[$name]
}

function Pen($name, $width) {
  return New-Object System.Drawing.Pen $colors[$name], $width
}

function Box($x, $y, $w, $h, $title, $lines, $dotColor) {
  $rect = New-Object System.Drawing.Rectangle $x, $y, $w, $h
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $radius = 18
  $path.AddArc($x, $y, $radius, $radius, 180, 90)
  $path.AddArc($x + $w - $radius, $y, $radius, $radius, 270, 90)
  $path.AddArc($x + $w - $radius, $y + $h - $radius, $radius, $radius, 0, 90)
  $path.AddArc($x, $y + $h - $radius, $radius, $radius, 90, 90)
  $path.CloseFigure()
  $graphics.FillPath((Brush "White"), $path)
  $graphics.DrawPath((Pen "Line" 3), $path)
  $graphics.FillEllipse((Brush $dotColor), $x + 30, $y + 40, 58, 58)
  $graphics.DrawString($title, $fontMain, (Brush "Ink"), $x + 108, $y + 45)
  $lineY = $y + 110
  foreach ($line in $lines) {
    $graphics.DrawString($line, $fontSmall, (Brush "Muted"), $x + 34, $lineY)
    $lineY += 34
  }
}

function Arrow($x1, $y1, $x2, $y2) {
  $pen = Pen "Muted" 4
  $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::ArrowAnchor
  $graphics.DrawLine($pen, $x1, $y1, $x2, $y2)
}

$graphics.Clear($colors.Bg)
$graphics.DrawString("SmartCard AI: Fast and Accurate Gen AI Architecture", $fontTitle, (Brush "Ink"), 70, 48)
$graphics.DrawString("Digital business card + QR, money progress tracking, RAG assistant, caching, monitoring, scalable APIs", $fontSmall, (Brush "Muted"), 74, 104)

Box 70 190 310 180 "Client Apps" @("Web, mobile, QR scan", "Profile, card, money UI") "Green"
Box 500 170 330 220 "API Gateway" @("Auth, rate limits, routing", "REST/GraphQL endpoints", "Request validation") "Teal"
Box 70 545 310 210 "Core Data" @("User profile and vCard", "Transactions and goals", "Audit-safe records") "Gold"
Box 500 525 330 250 "Retrieval" @("Embeddings + vector DB", "Hybrid keyword search", "Cross-encoder re-ranker") "Coral"
Box 950 545 260 210 "Cache" @("Redis query cache", "Profile/card cache", "LLM response cache") "Green"
Box 1250 545 260 210 "Eval" @("Latency tracing", "Groundedness tests", "Feedback loop") "Teal"

$orchestration = New-Object System.Drawing.Rectangle 950, 130, 560, 320
$graphics.FillRectangle((Brush "White"), $orchestration)
$graphics.DrawRectangle((Pen "Line" 3), $orchestration)
$graphics.DrawString("AI Orchestration Layer", $fontMain, (Brush "Ink"), 990, 188)
$graphics.DrawString("Intent detection, prompt templates, tool calls", $fontSmall, (Brush "Muted"), 990, 235)
$graphics.DrawString("Retrieval, re-ranking, citation assembly", $fontSmall, (Brush "Muted"), 990, 270)
$graphics.FillRectangle((Brush "Green"), 990, 315, 220, 80)
$graphics.FillRectangle((Brush "Teal"), 1240, 315, 220, 80)
$graphics.DrawString("Gemini Flash", $fontSmallBold, (Brush "White"), 1028, 343)
$graphics.DrawString("Fallback LLM", $fontSmallBold, (Brush "White"), 1278, 343)

Arrow 380 280 500 280
Arrow 830 280 950 280
Arrow 665 390 665 525
Arrow 380 650 500 650
Arrow 830 650 950 650
Arrow 1210 650 1250 650
Arrow 1115 545 1115 450
Arrow 1380 545 1380 450

$graphics.FillRectangle((Brush "Ink"), 70, 845, 1440, 105)
$graphics.DrawString("Fast path: cache hit or deterministic finance calculation.", $fontSmall, (Brush "White"), 100, 878)
$graphics.DrawString("Accurate path: retrieve trusted user data, re-rank, generate with citations, then monitor quality.", $fontSmall, (Brush "White"), 100, 912)

$bitmap.Save($output, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bitmap.Dispose()
Write-Output $output
