<?php

// Incluir la librería dompdf
require_once '../../dompdf/autoload.inc.php';

// Verificar si se recibió un HTML válido
if (isset($_POST['html'])) {
    // Obtener el HTML enviado desde el cliente
    $html = $_POST['html'];

    // Crear una instancia de dompdf
    $dompdf = new Dompdf();

    // Cargar el HTML en dompdf
    $dompdf->loadHtml($html);

    // Renderizar el HTML como PDF
    $dompdf->render();

    // Obtener el nombre del archivo para el PDF (opcional)
    $filename = isset($_POST['mes']) ? $_POST['mes'] : 'informe_residuos.pdf';

    // Enviar el PDF al cliente para descargar
    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="' . $filename . '"');
    echo $dompdf->output();
    exit();
} else {
    echo "Error: No se recibió HTML válido para generar el PDF.";
}
?>
