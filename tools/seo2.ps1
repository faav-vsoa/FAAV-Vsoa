$ErrorActionPreference = 'Stop'
git checkout -- HTML/brigadas
$root = (Get-Location).Path
$base = 'https://faav-vsoa.github.io/FAAV-Vsoa'
$img = $base + '/img/og-faav.png'
$patterns = @(
  '\s*<meta name="description"[^>]*>\s*',
  '\s*<meta (?:property|name)="(?:og|twitter):[^"]*"[^>]*>\s*',
  '\s*<!--[^>]*(?:og:url|og:image|data URI)[^>]*-->\s*'
)

function Write-Bom([string]$p, [string]$text) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $fs = [System.IO.File]::Open($p, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
  $fs.Write([byte[]](0xEF, 0xBB, 0xBF), 0, 3)
  $fs.Write($bytes, 0, $bytes.Length)
  $fs.Close()
}

foreach ($bf in Get-ChildItem (Join-Path $root 'HTML\brigadas\*.html')) {
  $p = $bf.FullName
  $t = [System.IO.File]::ReadAllText($p)
  $icao = $bf.BaseName
  $desc = 'Brigada ' + $icao + ' de la FAAV - VSOA: base, ubicacion y unidades de la comunidad argentina de simulacion aerea.'
  $icon = '../../img/Logo FAAV/Logo Faav.png?v=2'
  $url = $base + '/HTML/brigadas/' + $icao + '.html'

  $tm = [regex]::Match($t, '<title>(.*?)</title>')
  $title = if ($tm.Success) { $tm.Groups[1].Value } else { ('Brigada ' + $icao + ' | FAAV - VSOA') }

  foreach ($pat in $patterns) { $t = [regex]::Replace($t, $pat, "`r`n") }
  $t = $t.Replace('../../CSS/styles.css?v=2', '../../CSS/styles.css?v=3')
  $t = [regex]::Replace($t, '<link rel="icon"[^>]*/\s*>', '<link rel="icon" type="image/png" href="' + $icon + '"><link rel="apple-touch-icon" href="' + $icon + '">')

  $block = "<meta name=`"description`" content=`"" + $desc + "`">`r`n" +
           "<link rel=`"canonical`" href=`"" + $url + "`">`r`n" +
           "<meta property=`"og:type`" content=`"website`">`r`n" +
           "<meta property=`"og:site_name`" content=`"FAAV - VSOA`">`r`n" +
           "<meta property=`"og:title`" content=`"" + $title + "`">`r`n" +
           "<meta property=`"og:description`" content=`"" + $desc + "`">`r`n" +
           "<meta property=`"og:image`" content=`"" + $img + "`">`r`n" +
           "<meta property=`"og:url`" content=`"" + $url + "`">`r`n" +
           "<meta name=`"twitter:card`" content=`"summary_large_image`">`r`n" +
           "<meta name=`"twitter:title`" content=`"" + $title + "`">`r`n" +
           "<meta name=`"twitter:description`" content=`"" + $desc + "`">`r`n" +
           "<meta name=`"twitter:image`" content=`"" + $img + "`">`r`n"
  $pos = $tm.Index + $tm.Length
  $t = $t.Insert($pos, $block)
  Write-Bom $p $t
}
Write-Output 'brigadas reparadas'