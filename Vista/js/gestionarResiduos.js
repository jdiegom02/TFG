window.addEventListener("load", principal, false);

function principal() {
    actualizarModoOscuro();
    llenarDesplegableAnios();
    obtenerResiduosDesdeFuenteExterna();
    document.getElementById("mes").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("anio").addEventListener("change", obtenerResiduosDesdeFuenteExterna);
    document.getElementById("btnGenerarPDF").addEventListener("click", generarPDFResiduos);
}

/**NO SE HACE AUN
 *  Desplegable de fechas, que deberia cambiar segun cuando se haya solicitado
 *  el primer pedido y el pedido mas nuevo, asi evitamos tener fechas con pedidos vacios
 * 
 */
function llenarDesplegableAnios() {
    var selectAnio = document.getElementById("anio");
    var arrayAnos = ["2023", "2024", "2025", "2026", "2027", "2028", "2029", "2030"];

    arrayAnos.forEach(function (year) {
        var option = document.createElement("option");
        option.value = year;
        option.textContent = year; // Usar textContent para establecer el texto visible de la opción
        selectAnio.appendChild(option);
    });
}

function obtenerResiduosDesdeFuenteExterna() {
    let mesSeleccionado = document.getElementById("mes").value;
    let anioSeleccionado = document.getElementById("anio").value;
    let parametros = {
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
    let cantidadResiduosPorTipo = {};

    data.forEach(function (residuo) {
        let tipoResiduo = residuo.descripcion;
        let cantidad = parseInt(residuo.cantidad);

        if (cantidadResiduosPorTipo[tipoResiduo]) {
            cantidadResiduosPorTipo[tipoResiduo] += cantidad;
        } else {
            cantidadResiduosPorTipo[tipoResiduo] = cantidad;
        }
    });

    let tabla = '<table class="table"><thead><tr><th>Tipo de Residuo</th><th>Cantidad</th><th>Unidad</th></tr></thead><tbody>';

    for (let tipo in cantidadResiduosPorTipo) {
        tabla += '<tr><td>' + tipo + '</td><td>' + cantidadResiduosPorTipo[tipo] + '</td><td> Kg </td></tr>';
    }

    tabla += '</tbody></table>';
    document.getElementById('tabla-residuos').innerHTML = tabla;
}









