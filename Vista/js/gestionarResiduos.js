window.addEventListener("load", principal, false);

function principal() {

    llenarDesplegableAnios();
    obtenerResiduosDesdeFuenteExterna();

    document.getElementById("mes").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("anio").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("btnGenerarPDF").addEventListener("click", generarPDF);
}

function llenarDesplegableAnios() {
    var selectAnio = document.getElementById("anio");
    var arrayAnos = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

    // Iterar sobre el array de años y crear una opción para cada año
    arrayAnos.forEach(function (year) {
        var option = document.createElement("option");
        option.value = year;
        option.textContent = year; // Usar textContent para establecer el texto visible de la opción
        selectAnio.appendChild(option);
    });
}

function obtenerResiduosDesdeFuenteExternaORIGINAL() {
    $.ajax({
        url: '../../Controlador/php/residuosFecha.php',
        type: 'POST',
        dataType: 'json',
        success: function (data) {

            $.each(data, function (index, opcion) {

                console.log("fkProducto: " + opcion.fk_producto);
                console.log("idProducto: " + opcion.producto_id);
                console.log("Producto: " + opcion.producto_descripcion);
                console.log("fkProducto: " + opcion.fk_producto);
                console.log("Cantidad: " + opcion.cantidad);
                console.log("fecha: " + opcion.fecha);
                console.log("Descripcion: " + opcion.residuo_descripcion);
                console.log("Descripcion: " + opcion.medida);

            });

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function obtenerResiduosDesdeFuenteExterna() {
    var mesSeleccionado = document.getElementById("mes").value;
    var anioSeleccionado = document.getElementById("anio").value;


    var parametros = {
        mes: mesSeleccionado,
        anio: anioSeleccionado
    };

    $.ajax({
        url: '../../Controlador/php/residuosFecha.php',
        type: 'POST',
        dataType: 'json',
        data: parametros,
        success: function (data) {
            mostrarCantidadResiduosPorTipo(data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}


function mostrarCantidadResiduosPorTipo(data) {

    var cantidadResiduosPorTipo = {};

    data.forEach(function (residuo) {
        var tipoResiduo = residuo.residuo_descripcion;
        var cantidad = parseInt(residuo.cantidad);

        if (cantidadResiduosPorTipo[tipoResiduo]) {
            cantidadResiduosPorTipo[tipoResiduo] += cantidad;
        } else {
            cantidadResiduosPorTipo[tipoResiduo] = cantidad;
        }
    });


    var tabla = '<table class="table"><thead><tr><th>Tipo de Residuo</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>';

    for (var tipo in cantidadResiduosPorTipo) {
        tabla += '<tr><td>' + tipo + '</td><td>' + cantidadResiduosPorTipo[tipo] + '</td><td> Kg </td></tr>';
    }

    tabla += '</tbody></table>';
    document.getElementById('tabla-residuos').innerHTML = tabla;
}



function generarPDF() {
    // Obtener el mes y el año seleccionados
    var mesSeleccionado = document.getElementById("mes").value;
    var anioSeleccionado = document.getElementById("anio").value;

    var tablaResiduos = document.getElementById("tabla-residuos");


    var tablaHTML = tablaResiduos.innerHTML;
    console.log(tablaHTML);
    // Realizar una solicitud AJAX para generar el PDF
    $.ajax({
        url: '../../Controlador/php/generarPDF.php',
        type: 'POST',
        success: function (response) {
            console.log("irue");
            console.log(response);
            // Asignar jsPDF a window.jsPDF
            window.jsPDF = window.jspdf.jsPDF;

            // Crear instancia de jsPDF
            const doc = new window.jsPDF();

            // Definir el título del PDF
            doc.setFontSize(22);
            doc.text('Residuos generados', 105, 20, { align: 'center' });

            // Agregar subtítulo
            doc.setFontSize(16);
            doc.text('Semana del mes', 105, 30, { align: 'center' });

            // Definir posición inicial para la lista
            var y = 45;

            // Agregar elementos a la lista
            doc.setFontSize(12);
            doc.text('Residuo 1:', 10, y);
            doc.text('Cantidad 1', 190, y, { align: 'right' });

            y += 10;
            doc.text('Residuo 2:', 10, y);
            doc.text('Cantidad 2', 190, y, { align: 'right' });

            y += 10;
            doc.text('Residuo 3:', 10, y);
            doc.text('Cantidad 3', 190, y, { align: 'right' });
            // Guardar el PDF
            doc.save('residuos.pdf');
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}





