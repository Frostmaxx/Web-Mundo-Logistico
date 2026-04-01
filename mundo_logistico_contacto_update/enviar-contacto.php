<?php
/**
 * Mundo Logístico - Procesamiento de Formulario de Contacto
 * 
 * Recibe los datos del formulario y envía un correo electrónico
 */

// Configuración
$destinatario = 'somosmundologistico@gmail.com';
$nombre_empresa = 'Mundo Logístico';
$asunto_default = 'Nuevo mensaje desde el sitio web';
$dominio = 'mundo-logistico.com';

// Headers para correo HTML
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: noreply@" . $dominio . "\r\n";
$headers .= "Reply-To: noreply@" . $dominio . "\r\n";

// Verificar si es una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
    exit;
}

// Obtener y sanitizar datos
$nombre = isset($_POST['nombre']) ? trim(htmlspecialchars($_POST['nombre'])) : '';
$email = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$mensaje = isset($_POST['mensaje']) ? trim(htmlspecialchars($_POST['mensaje'])) : '';

// Validación
$errores = [];

if (empty($nombre)) {
    $errores[] = 'El nombre es requerido';
}

if (empty($email)) {
    $errores[] = 'El correo electrónico es requerido';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errores[] = 'El correo electrónico no es válido';
}

if (empty($mensaje)) {
    $errores[] = 'El mensaje es requerido';
}

if (strlen($mensaje) > 2000) {
    $errores[] = 'El mensaje es demasiado largo (máximo 2000 caracteres)';
}

// Si hay errores, retornar
if (!empty($errores)) {
    http_response_code(400);
    echo json_encode([
        'success' => false, 
        'message' => implode(', ', $errores)
    ]);
    exit;
}

// Preparar contenido del correo
$fecha = date('d/m/Y H:i:s');
$contenido = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 5px; }
        .footer { padding: 15px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>📦 Nuevo Mensaje de Contacto</h2>
            <p>Mundo Logístico - Sitio Web</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>👤 Nombre:</div>
                <div class='value'>{$nombre}</div>
            </div>
            <div class='field'>
                <div class='label'>📧 Correo:</div>
                <div class='value'><a href='mailto:{$email}'>{$email}</a></div>
            </div>
            <div class='field'>
                <div class='label'>💬 Mensaje:</div>
                <div class='value'>" . nl2br($mensaje) . "</div>
            </div>
            <div class='field'>
                <div class='label'>📅 Fecha:</div>
                <div class='value'>{$fecha}</div>
            </div>
        </div>
        <div class='footer'>
            <p>Este mensaje fue enviado desde el formulario de contacto de {$dominio}</p>
            <p>Responder directamente al correo del cliente: {$email}</p>
        </div>
    </div>
</body>
</html>
";

// Enviar correo al administrador
$asunto = "$asunto_default - $nombre";
$enviado = @mail($destinatario, $asunto, $contenido, $headers);

// Responder al cliente también
$respuesta_cliente = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2E7D32; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .success { background: #d4edda; border: 1px solid #c3e6cb; padding: 15px; border-radius: 5px; }
        .footer { padding: 15px; text-align: center; font-size: 12px; color: #777; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>✅ Mensaje Recibido</h2>
            <p>Mundo Logístico</p>
        </div>
        <div class='content'>
            <div class='success'>
                <p>Hola <strong>{$nombre}</strong>,</p>
                <p>Hemos recibido tu mensaje exitosamente. Nuestro equipo se pondra en contacto contigo a la brevedad posible.</p>
                <p><strong>Resumen de tu mensaje:</strong></p>
                <p><em>{$mensaje}</em></p>
            </div>
            <br>
            <p>Atentamente,</p>
            <p><strong>Equipo de Mundo Logistico</strong></p>
            <p>📞 +58 424-1549902</p>
            <p>🌐 www.{$dominio}</p>
        </div>
        <div class='footer'>
            <p>Este es un correo automatico. Por favor no responder directamente a este mensaje.</p>
        </div>
    </div>
</body>
</html>
";

$headers_reply = "MIME-Version: 1.0\r\n";
$headers_reply .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers_reply .= "From: $nombre_empresa <noreply@" . $dominio . ">\r\n";

@mail($email, "Confirmacion de mensaje - Mundo Logistico", $respuesta_cliente, $headers_reply);

// Respuesta JSON
if ($enviado) {
    echo json_encode([
        'success' => true, 
        'message' => '¡Mensaje enviado exitosamente! Te responderemos pronto.'
    ]);
} else {
    // Error detallado para depuración
    $error_msg = error_get_last()['message'] ?? 'Función mail() deshabilitada en el servidor';
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Error del servidor: ' . $error_msg . '. Por favor contáctanos por WhatsApp.'
    ]);
}
?>
