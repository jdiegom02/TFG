window.addEventListener("load", principal, false);

function principal(e) {
    document.getElementById("btnRealizarPedidos").addEventListener("click", abrirModal)
    cargarPedidosDesdePHP();
    var btnValidarPedidos = document.getElementById('btnValidarPedidos');
    btnValidarPedidos.addEventListener('click', function () {
        let pedidos = [];
        let filasPedidos = document.querySelectorAll('#tabla-pedidos-body tr');

        filasPedidos.forEach(function (fila) {
            pedidos.push(fila.dataset.idPedido);
        });
        validarPedidosYGenerarPDF(pedidos);
    });
    // document.getElementById('guardarCambiosPedido').addEventListener('click', function() {
    //     guardarCambiosPedido();
    // });

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
    var filaPedido = document.querySelector(`tr[data-id-pedido="${idPedido}"]`);
    if (filaPedido) {
        var selectUnidad = document.createElement('select');
        selectUnidad.classList.add('form-control');

        $.ajax({
            url: "../../Controlador/php/unidades.php",
            type: "POST",
            dataType: "json",
            success: function (unidades) {
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
    var selectTemplate = $('<select>').addClass('form-control select-proveedor');
    var opcionInicial = $('<option>').val('noValue').text('Seleccione un proveedor');
    selectTemplate.append(opcionInicial);

    proveedores.forEach(function (proveedor) {
        var opcion = $('<option>').val(proveedor.id).text(proveedor.descripcion);
        selectTemplate.append(opcion.clone());
    });

    $('.proveedor-editable').each(function () {
        $(this).empty().append(selectTemplate.clone());
        var mensajeErrorDiv = $('<div>').attr('id', 'mensajeErrorProveedor').css('color', 'red').text('No se agregó el pedido por falta de proveedor').hide();
        $(this).append(mensajeErrorDiv);
    });
}

function cargarProveedores(idPedido, proveedor) {
    var filaPedido = document.querySelector(`tr[data-id-pedido="${idPedido}"]`);
    if (filaPedido) {
        var selectProveedor = document.createElement('select');
        selectProveedor.classList.add('form-control');

        //obtener los proveedores desde el servidor
        $.ajax({
            url: "../../Controlador/php/proveedores.php",
            type: "POST",
            dataType: "json",
            success: function (proveedores) {
                proveedores.forEach(function (proveedorActual) {
                    var option = document.createElement('option');
                    option.value = proveedorActual.descripcion;
                    option.textContent = proveedorActual.descripcion;
                    if (proveedorActual.descripcion === proveedor) { // si el proveedor actual coincide con el del pedido
                        option.selected = true; // establecer como preseleccionado
                    }
                    selectProveedor.appendChild(option);
                });

                var tdProveedor = filaPedido.querySelector('.proveedor-editable');
                tdProveedor.innerHTML = '';
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

    console.log('Guardar cambios del pedido con ID:', idPedido);
    console.log('Columna:', columna);
    console.log('Nuevo valor:', nuevoValor);
}

function eliminarPedido(idPedido) {
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
    var tablaDiv = $('#tablaPedidos');
    tablaDiv.empty();

    var tabla = '<table class="table">';
    tabla += '<thead>';
    tabla += '<tr><th>Proveedor</th><th>Producto</th><th>Cantidad</th><th>Unidad de Medida</th></tr>';
    tabla += '</thead>';
    tabla += '<tbody>';

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










