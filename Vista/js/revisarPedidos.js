window.addEventListener("load", principal, false);

function principal(e) {
    document.getElementById("btnRealizarPedidos").addEventListener("click", abrirModal)
    cargarPedidosDesdePHP();
    var btnValidarPedidos = document.getElementById('btnValidarPedidos');
    btnValidarPedidos.addEventListener('click', function () {
        // Obtener todas las filas de la tabla de pedidos
        let pedidos = [];
        let filasPedidos = document.querySelectorAll('#tabla-pedidos-body tr');
        // Iterar sobre cada fila de pedido
        filasPedidos.forEach(function (fila) {
            // Obtener el ID del pedido de la fila actual
            pedidos.push(fila.dataset.idPedido);
            // Llamar a la función validarPedidosYGenerarPDF con el ID del pedido
        });
        validarPedidosYGenerarPDF(pedidos);
    });
    // document.getElementById('guardarCambiosPedido').addEventListener('click', function() {
    //     guardarCambiosPedido();
    // });

    // Agregar event listener para detectar cambios en las celdas editables
    document.querySelectorAll('.editable').forEach(function (cell, index) {
        cell.addEventListener('input', function () {
            guardarCambiosEnCelda(this, index);
        });
    });


    var btnImprimirSemanal = document.getElementById('imprimirSemanal');
    btnImprimirSemanal.addEventListener('click', function () {

        generarPDFPedidos();

    });
}



function mostrarPedidos(pedidos) {
    var tablaPedidosBody = document.getElementById('tabla-pedidos-body');
    tablaPedidosBody.innerHTML = '';
    pedidos.forEach(function (pedido) {
        var row = document.createElement('tr');
        row.dataset.idPedido = pedido.id;
        row.innerHTML = `
            <td class="pl-5"><input type="checkbox" class="form-check-input"></td>
            <td>${pedido.fecha}</td>
            <td class="editable nombre-editable" contenteditable>${pedido.nombre_pedido}</td>
            <td class="editable cantidad-editable" contenteditable>${pedido.cantidad}</td>
            <td class="unidad-editable">${pedido.unidad}</td>
            <td class="proveedor-editable"></td>
            <td class="editable observacion-editable">${pedido.observaciones}</td>
            <td>${pedido.nombre_usuario}</td>
            <td>
                <button class="btn btn-danger eliminar" data-idPedido="${pedido.id}" data-toggle="modal" data-target="#confirmacionEliminar">Eliminar</button>
            </td>`;
        tablaPedidosBody.appendChild(row);

        // Almacenar temporalmente el ID del pedido cuando se presiona el botón "Eliminar"
        row.querySelector(".eliminar").addEventListener("click", function () {
            var idPedido = pedido.id;
            document.querySelector("#eliminarPedido").addEventListener("click", function () {
                eliminarSolicitud(idPedido);
                $('#confirmacionEliminar').modal('toggle');
            })

        });
    });
}


function cargarUnidades(idPedido, unidad) {
    // Encontrar la fila del pedido por su ID
    var filaPedido = document.querySelector(`tr[data-id-pedido="${idPedido}"]`);
    if (filaPedido) {
        // Crear un elemento select para las unidades
        var selectUnidad = document.createElement('select');
        selectUnidad.classList.add('form-control');

        // Realizar una solicitud AJAX para obtener las unidades desde el servidor
        $.ajax({
            url: "../../Controlador/php/unidades.php",
            type: "POST",
            dataType: "json",
            success: function (unidades) {
                // Iterar sobre las unidades recibidas y agregarlas al desplegable
                unidades.forEach(function (unidadActual) {
                    var option = document.createElement('option');
                    option.value = unidadActual.unidad;
                    option.textContent = unidadActual.unidad;
                    if (unidadActual.unidad === unidad) { // Si la unidad actual coincide con la del pedido
                        option.selected = true; // Establecer como preseleccionada
                    }
                    selectUnidad.appendChild(option);
                });

                // Encontrar la celda de la columna de unidades y añadir el desplegable
                var tdUnidad = filaPedido.querySelector('.unidad-editable');
                tdUnidad.innerHTML = ''; // Limpiar el contenido existente
                tdUnidad.appendChild(selectUnidad);
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar las unidades:', error);
            }
        });
    } else {
        console.error('No se encontró la fila de pedido con ID:', idPedido);
    }
}

function crearSeleccionableProveedores(proveedores) {
    // Crear el elemento select
    var selectTemplate = $('<select>').addClass('form-control select-proveedor');

    // Crear y agregar la opción inicial
    var opcionInicial = $('<option>').val('noValue').text('Seleccione un proveedor');
    selectTemplate.append(opcionInicial);

    // Iterar sobre los proveedores y agregar opciones al select
    proveedores.forEach(function (proveedor) {
        var opcion = $('<option>').val(proveedor.id).text(proveedor.descripcion);
        selectTemplate.append(opcion.clone());
    });

    // Añadir el select a todos los elementos con la clase .proveedor-editable
    $('.proveedor-editable').each(function () {
        $(this).empty().append(selectTemplate.clone());
        var mensajeErrorDiv = $('<div>').attr('id', 'mensajeErrorProveedor').css('color', 'red').text('No se agregó el pedido por falta de proveedor').hide();
        // Añadir el div de mensaje de error debajo del select
        $(this).append(mensajeErrorDiv);
    });
}

function cargarProveedores(idPedido, proveedor) {
    // Encontrar la fila del pedido por su ID
    var filaPedido = document.querySelector(`tr[data-id-pedido="${idPedido}"]`);
    if (filaPedido) {
        // Crear un elemento select para los proveedores
        var selectProveedor = document.createElement('select');
        selectProveedor.classList.add('form-control');

        // Realizar una solicitud AJAX para obtener los proveedores desde el servidor
        $.ajax({
            url: "../../Controlador/php/proveedores.php",
            type: "POST",
            dataType: "json",
            success: function (proveedores) {
                // Iterar sobre los proveedores recibidos y agregarlos al desplegable
                proveedores.forEach(function (proveedorActual) {
                    var option = document.createElement('option');
                    option.value = proveedorActual.descripcion;
                    option.textContent = proveedorActual.descripcion;
                    if (proveedorActual.descripcion === proveedor) { // Si el proveedor actual coincide con el del pedido
                        option.selected = true; // Establecer como preseleccionado
                    }
                    selectProveedor.appendChild(option);
                });

                // Encontrar la celda de la columna de proveedores y añadir el desplegable
                var tdProveedor = filaPedido.querySelector('.proveedor-editable');
                tdProveedor.innerHTML = ''; // Limpiar el contenido existente
                tdProveedor.appendChild(selectProveedor);
            },
            error: function (xhr, status, error) {
                console.error('Error al cargar los proveedores:', error);
            }
        });
    } else {
        console.error('No se encontró la fila de pedido con ID:', idPedido);
    }
}

function guardarCambiosEnCelda(cell, columna) {
    var idPedido = cell.closest('tr').dataset.idPedido;
    var nuevoValor = cell.textContent.trim();

    // Aquí puedes implementar la lógica para guardar los cambios en el servidor
    console.log('Guardar cambios del pedido con ID:', idPedido);
    console.log('Columna:', columna);
    console.log('Nuevo valor:', nuevoValor);
}

function eliminarPedido(idPedido) {
    // Aquí puedes implementar la lógica para eliminar el pedido con el ID proporcionado
    $('#modalEliminar').modal('toggle');
    console.log('Eliminar pedido con ID:', idPedido);
}

function validarPedidosYGenerarPDF(idPedido) {
    let checkeds = [];
    let error = false;

    idPedido.forEach(pedido => {
        let fila = document.querySelector(`tr[data-id-pedido="${pedido}"]`);
        if (fila) {
            let errorFila = false;
            let chequeo = fila.children[0].children[0];

            let mensajeError = fila.querySelector("#mensajeErrorProveedor");
            if (!mensajeError) {
                mensajeError = document.createElement("div");
                mensajeError.id = "mensajeErrorProveedor";
                mensajeError.style.color = "red";
                mensajeError.style.display = "none";
                mensajeError.textContent = "No se agregó el pedido por falta de proveedor";
                fila.children[5].appendChild(mensajeError);
            }

            if (chequeo.checked) {
                let nombre = fila.children[2].textContent;
                let cantidad = fila.children[3].textContent;

                let unidadSelect = fila.children[4].querySelector('select');
                let unidad = unidadSelect ? unidadSelect.selectedOptions[0].textContent : '';

                let proveedorSelect = fila.children[5].querySelector('select');
                let proveedor = proveedorSelect ? proveedorSelect.selectedOptions[0].textContent : '';

                let observaciones = fila.children[6].textContent;
                let usuario = fila.children[7].textContent;
                let idPedido = fila.getAttribute('data-id-pedido');

                if (proveedor !== "Seleccione un proveedor") {
                    checkeds.push([nombre, cantidad, unidad, proveedor, observaciones, usuario, idPedido]);
                    activarDesactivarDisplay(mensajeError, false);
                } else {
                    error = true;
                    errorFila = true;
                    activarDesactivarDisplay(mensajeError, errorFila);
                }
            } else {
                activarDesactivarDisplay(mensajeError, false);
            }
        }
    });

    if (!error) {
        insertarEnPedidos(checkeds);
    }
}

function activarDesactivarDisplay(element, error) {
    if (error && element.style.display === 'none') {
        element.style.display = 'block';
    } else if (!error) {
        element.style.display = 'none';
    }
}


function abrirModal(e) {
    $('#modalPedidoSemanal').modal('show');
    mostrarPedidosValidados();
}


function mostrarPedidosValidados() {
    $.ajax({
        url: '../../Controlador/php/pedidoMostrarTramitados.php',
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            construirTablaPedidos(data);
        },
        error: function (xhr, status, error) {
            console.error('Error al obtener los pedidos:', error);
        }
    });
}

function construirTablaPedidos(pedidos) {
    // Obtener el div donde se colocará la tabla
    var tablaDiv = $('#tablaPedidos');
    // Limpiar el contenido anterior del div
    tablaDiv.empty();

    // Construir la tabla
    var tabla = '<table class="table">';
    tabla += '<thead>';
    tabla += '<tr><th>Proveedor</th><th>Producto</th><th>Cantidad</th><th>Unidad de Medida</th></tr>';
    tabla += '</thead>';
    tabla += '<tbody>';

    // Recorrer los datos de los pedidos y construir filas
    $.each(pedidos, function (proveedor, productos) {
        $.each(productos, function (index, producto) {
            tabla += '<tr>';
            tabla += '<td>' + proveedor + '</td>';
            tabla += '<td>' + producto.descripcion + '</td>';
            tabla += '<td>' + producto.cantidad + '</td>';
            tabla += '<td>' + producto.unidad + '</td>';
            tabla += '</tr>';
        });
    });

    tabla += '</tbody>';
    tabla += '</table>';

    tablaDiv.html(tabla);

    //$('#modalPedidoSemanal').modal('show');
}










