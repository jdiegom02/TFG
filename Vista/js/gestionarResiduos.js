window.addEventListener("load", principal, false);

function principal() {
    actualizarModoOscuro();

    llenarDesplegableAnios();
    obtenerResiduosDesdeFuenteExterna();

    document.getElementById("mes").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("anio").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("btnGenerarPDF").addEventListener("click", generarPDFResiduos);
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
                console.log("fkProducto: " + opcion.descripcion);
                console.log("idProducto: " + opcion.cantidad);
                console.log("Producto: " + opcion.unidad);
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
        var tipoResiduo = residuo.descripcion;
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









