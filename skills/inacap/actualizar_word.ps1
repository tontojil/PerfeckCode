# Actualiza los indices automaticos de un DOCX con Word real y exporta el PDF.
# Uso: powershell -ExecutionPolicy Bypass -File actualizar_word.ps1 -Docx "C:\ruta\informe.docx" [-Pdf "C:\ruta\informe.pdf"]
# Cierra Word antes de correrlo. Requiere Microsoft Word instalado.
param(
    [Parameter(Mandatory = $true)][string]$Docx,
    [string]$Pdf = ''
)
$ErrorActionPreference = 'Stop'
if (-not (Test-Path -LiteralPath $Docx)) { throw "No existe: $Docx" }
if ($Pdf -eq '') { $Pdf = [IO.Path]::ChangeExtension($Docx, '.pdf') }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($Docx, $false, $false)
    $doc.Fields.Update() | Out-Null
    Start-Sleep -Seconds 3
    $doc.Fields.Update() | Out-Null
    Write-Host "TOCs: $($doc.TablesOfContents.Count)"
    foreach ($toc in $doc.TablesOfContents) {
        try { $toc.Update() | Out-Null } catch { Write-Host "Aviso TOC: $($_.Exception.Message)" }
    }
    foreach ($tof in $doc.TablesOfFigures) {
        try { $tof.Update() | Out-Null } catch { Write-Host "Aviso TOF: $($_.Exception.Message)" }
    }
    $doc.Save()
    $doc.ExportAsFixedFormat($Pdf, 17) | Out-Null
    Write-Host "PDF: $Pdf"
    $doc.Close()
} finally {
    $word.Quit()
}
Write-Host 'LISTO'
