$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$events = @(
  @{ uid='faav-ferry-f16-ii'; name='FERRY F16 II'; start='20260926T220000Z'; end='20260927T020000Z'; loc='EKSP, SAOC'; desc='Segundo vuelo ferry de los F-16 de la Fuerza Aerea Argentina.'; url='' },
  @{ uid='faav-sabe-scel-fly-in'; name='SABE - SCEL Fly-In'; start='20260823T200000Z'; end='20260823T230000Z'; loc='SABE, SCEL'; desc='Cruza los Andes en una de las rutas mas impresionantes de Sudamerica. Aeroparque Jorge Newbery (SABE) a Santiago de Chile (SCEL).'; url='https://my.vatsim.net/events/sabe-scel-fly-in' },
  @{ uid='faav-sarr-fly-inn'; name='SARR Fly-Inn'; start='20260809T200000Z'; end='20260809T230000Z'; loc='SARI, SARE, SARF, SARC'; desc='Operacion en la FIR Resistencia (SARR). Aeropuerto principal: SARI - Cataratas del Iguazu.'; url='https://my.vatsim.net/events/sarr-fly-inn-2' },
  @{ uid='faav-pitch-black'; name='Exercice Pitch Black'; start='20260718T173000Z'; end='20260719T173000Z'; loc='YPTN, YPDN'; desc='Evento internacional de la Fuerza Aerea Australiana en Darwin, Australia. La FAAV estara presente.'; url='https://my.vatsim.net/events/uruguayan-vfr-tour' }
)

$sb = New-Object System.Text.StringBuilder
[void]$sb.AppendLine('BEGIN:VCALENDAR')
[void]$sb.AppendLine('VERSION:2.0')
[void]$sb.AppendLine('PRODID:-//FAAV VSOA//Calendario de eventos//ES')
[void]$sb.AppendLine('CALSCALE:GREGORIAN')
[void]$sb.AppendLine('METHOD:PUBLISH')
[void]$sb.AppendLine('X-WR-CALNAME:FAAV - VSOA')
foreach ($e in $events) {
  [void]$sb.AppendLine('BEGIN:VEVENT')
  [void]$sb.AppendLine('UID:' + $e.uid + '@faav-vsoa')
  [void]$sb.AppendLine('DTSTAMP:20260827T000000Z')
  [void]$sb.AppendLine('DTSTART:' + $e.start)
  [void]$sb.AppendLine('DTEND:' + $e.end)
  [void]$sb.AppendLine('SUMMARY:' + $e.name)
  [void]$sb.AppendLine('DESCRIPTION:' + $e.desc)
  [void]$sb.AppendLine('LOCATION:' + $e.loc)
  if ($e.url) { [void]$sb.AppendLine('URL;VALUE=URI:' + $e.url) }
  [void]$sb.AppendLine('END:VEVENT')
}
[void]$sb.AppendLine('END:VCALENDAR')

$crlf = ($sb.ToString() -replace '\r?\n', "`r`n")
[System.IO.File]::WriteAllText((Join-Path $root 'calendario.ics'), $crlf, (New-Object System.Text.UTF8Encoding($false)))
Write-Output 'calendario.ics generado'