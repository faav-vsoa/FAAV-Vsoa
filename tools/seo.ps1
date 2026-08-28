$ErrorActionPreference = 'Stop'
$root = (Get-Location).Path
$base = 'https://faav-vsoa.github.io/FAAV-Vsoa'
$data = [System.IO.File]::ReadAllText((Join-Path $root 'tools\seo-data.json')) | ConvertFrom-Json

function Write-Bom([string]$p, [string]$text) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($text)
  $fs = [System.IO.File]::Open($p, [System.IO.FileMode]::Create, [System.IO.FileAccess]::Write)
  $fs.Write([byte[]](0xEF, 0xBB, 0xBF), 0, 3)
  $fs.Write($bytes, 0, $bytes.Length)
  $fs.Close()
}

$patterns = @(
  '\s*<meta name="description"[^>]*>\s*',
  '\s*<meta (?:property|name)="(?:og|twitter):[^"]*"[^>]*>\s*',
  '\s*<!--[^>]*(?:og:url|og:image|data URI)[^>]*-->\s*'
)

$all = @()
foreach ($entry in $data) {
  $p = Join-Path $root ($entry.rel -replace '/', '\')
  $t = [System.IO.File]::ReadAllText($p)
  $isStorage = $entry.rel.StartsWith('storage\') -or $entry.rel.StartsWith('storage/')
  $relPrefix = if ($isStorage) { '../../' } else { '../' }
  $icon = $relPrefix + 'img/Logo FAAV/Logo Faav.png?v=2'
  $url = $base + '/' + ($entry.rel -replace '\\', '/')
  $img = $base + '/img/og-faav.png'
  $tm = [regex]::Match($t, '<title>(.*?)</title>')
  $title = if ($tm.Success) { $tm.Groups[1].Value } else { '' }

  foreach ($pat in $patterns) { $t = [regex]::Replace($t, $pat, "`r`n") }
  $t = [regex]::Replace($t, '<link rel="icon"[^>]*>', '<link rel="icon" type="image/png" href="' + $icon + '"><link rel="apple-touch-icon" href="' + $icon + '">')

  if ($tm.Success) {
    $block = "  <meta name=`"description`" content=`"" + $entry.desc + "`">`r`n" +
             "  <link rel=`"canonical`" href=`"" + $url + "`">`r`n" +
             "  <meta property=`"og:type`" content=`"website`">`r`n" +
             "  <meta property=`"og:site_name`" content=`"FAAV - VSOA`">`r`n" +
             "  <meta property=`"og:title`" content=`"" + $title + "`">`r`n" +
             "  <meta property=`"og:description`" content=`"" + $entry.desc + "`">`r`n" +
             "  <meta property=`"og:image`" content=`"" + $img + "`">`r`n" +
             "  <meta property=`"og:url`" content=`"" + $url + "`">`r`n" +
             "  <meta name=`"twitter:card`" content=`"summary_large_image`">`r`n" +
             "  <meta name=`"twitter:title`" content=`"" + $title + "`">`r`n" +
             "  <meta name=`"twitter:description`" content=`"" + $entry.desc + "`">`r`n" +
             "  <meta name=`"twitter:image`" content=`"" + $img + "`">`r`n"
    $pos = $tm.Index + $tm.Length
    $t = $t.Insert($pos, $block)
    Write-Bom $p $t
    $all += @{ url = $url; pri = '0.8' }
  }
}

foreach ($bf in Get-ChildItem (Join-Path $root 'HTML\brigadas\*.html')) {
  $p = $bf.FullName
  $t = [System.IO.File]::ReadAllText($p)
  $icao = $bf.BaseName
  $title = 'Brigada ' + $icao + ' | FAAV - VSOA'
  $desc = 'Brigada ' + $icao + ' de la FAAV - VSOA: base, ubicacion y unidades de la comunidad argentina de simulacion aerea.'
  $icon = '../../img/Logo FAAV/Logo Faav.png?v=2'
  $url = $base + '/HTML/brigadas/' + $icao + '.html'
  $img = $base + '/img/og-faav.png'

  foreach ($pat in $patterns) { $t = [regex]::Replace($t, $pat, "`r`n") }
  $t = $t.Replace('../../CSS/styles.css?v=2', '../../CSS/styles.css?v=3')

  $head = "<meta charset=`"UTF-8`">`r`n" +
          "<meta name=`"viewport`" content=`"width=device-width, initial-scale=1.0`">`r`n" +
          "<title>" + $title + "</title>`r`n" +
          "<meta name=`"description`" content=`"" + $desc + "`">`r`n" +
          "<link rel=`"icon`" type=`"image/png`" href=`"" + $icon + "`"><link rel=`"apple-touch-icon`" href=`"" + $icon + "`">`r`n" +
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
  $t = $t -replace '</head>', ($head + '</head>')
  Write-Bom $p $t
  $all += @{ url = $url; pri = '0.7' }
}

foreach ($sf in Get-ChildItem (Join-Path $root 'storage\*\index.html')) {
  $rel = 'storage/' + $sf.Directory.Name + '/index.html'
  if (-not ($data | Where-Object { $_.rel -eq $rel })) {
    $p = $sf.FullName
    $name = $sf.Directory.Name -replace '-', ' '
    $title = ($name.Substring(0,1).ToUpper() + $name.Substring(1))
    $all += @{ url = $base + '/' + $rel; pri = '0.6' }
  }
}

Add-Type -AssemblyName System.Drawing
$og = New-Object System.Drawing.Bitmap 1200, 630
$g = [System.Drawing.Graphics]::FromImage($og)
$g.SmoothingMode = 'AntiAlias'
$g.InterpolationMode = 'HighQualityBicubic'
$g.Clear([System.Drawing.Color]::FromArgb(8, 13, 20))
$logo = [System.Drawing.Image]::FromFile((Join-Path $root 'img\Logo FAAV\Logo Faav.png'))
$dw = 330; $dh = 330
$dst = New-Object System.Drawing.Rectangle (([int](($og.Width - $dw) / 2))), ([int](($og.Height - $dh) / 2 - 34)), $dw, $dh
$g.DrawImage($logo, $dst)
$font = New-Object System.Drawing.Font('Segoe UI', 30, [System.Drawing.FontStyle]::Bold)
$brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(215, 222, 235))
$sf2 = New-Object System.Drawing.StringFormat
$sf2.Alignment = 'Center'
$g.DrawString('FAAV - VSOA', $font, $brush, [System.Drawing.RectangleF]::new(0, $og.Height - 150, $og.Width, 80), $sf2)
$font2 = New-Object System.Drawing.Font('Segoe UI', 20)
$brush2 = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(150, 165, 185))
$g.DrawString('Fuerzas Armadas Argentinas VSOA', $font2, $brush2, [System.Drawing.RectangleF]::new(0, $og.Height - 100, $og.Width, 60), $sf2)
$og.Save((Join-Path $root 'img\og-faav.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $og.Dispose(); $logo.Dispose()

$robots = "User-agent: *`r`nAllow: /`r`n`r`nSitemap: " + $base + "/sitemap.xml`r`n"
[System.IO.File]::WriteAllBytes((Join-Path $root 'robots.txt'), [System.Text.Encoding]::UTF8.GetBytes($robots))

$sb = New-Object System.Text.StringBuilder
[void]$sb.Append('<?xml version="1.0" encoding="UTF-8"?>')
[void]$sb.Append('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
foreach ($u in $all) {
  [void]$sb.Append('<url><loc>' + $u.url + '</loc><lastmod>2026-08-27</lastmod><changefreq>weekly</changefreq><priority>' + $u.pri + '</priority></url>')
}
[void]$sb.Append('</urlset>')
[System.IO.File]::WriteAllBytes((Join-Path $root 'sitemap.xml'), [System.Text.Encoding]::UTF8.GetBytes($sb.ToString()))

Write-Output ('pages procesadas: ' + $all.Count)
Write-Output ('og image: ' + ((Get-Item (Join-Path $root 'img\og-faav.png')).Length) + ' bytes')