$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:8080/')
$listener.Start()
Write-Host 'Server running on http://localhost:8080'

$root = 'c:\Users\ANUSKAPAL\Desktop\Dental_website_1'

$mimeTypes = @{
    '.html' = 'text/html; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.jpg'  = 'image/jpeg'
    '.jpeg' = 'image/jpeg'
    '.png'  = 'image/png'
    '.svg'  = 'image/svg+xml'
    '.webp' = 'image/webp'
    '.ico'  = 'image/x-icon'
}

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $request = $context.Request
    $response = $context.Response
    
    $localPath = $request.Url.LocalPath
    if ($localPath -eq '/') { $localPath = '/index.html' }
    
    $filePath = Join-Path $root ($localPath.TrimStart('/'))
    
    if (Test-Path $filePath) {
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
        if ($mimeTypes.ContainsKey($ext)) {
            $response.ContentType = $mimeTypes[$ext]
        } else {
            $response.ContentType = 'application/octet-stream'
        }
        $buffer = [System.IO.File]::ReadAllBytes($filePath)
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    } else {
        $response.StatusCode = 404
        $buffer = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
    }
    
    $response.Close()
}
