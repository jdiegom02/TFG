window.addEventListener("load", principal, false);

function principal(e) {
    cargarPedidosDesdePHP();
    var btnValidarPedidos = document.getElementById('btnValidarPedidos');
    btnValidarPedidos.addEventListener('click', function () {
        validarPedidosYGenerarPDF();
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
}

function cargarPedidosDesdePHP() {
    // Realizar una solicitud AJAX para obtener los datos de los pedidos desde PHP
    $.ajax({
        url: '../../Controlador/php/pedidosmostrar.php',
        type: 'POST',
        dataType: 'json',
        success: function (data) {
            mostrarPedidos(data); // Llamar a la función mostrarPedidos con los datos obtenidos
        },
        error: function (xhr, status, error) {
            console.error('Error al cargar los pedidos desde PHP:', error);
        }
    });
}

function mostrarPedidos(pedidos) {
    var tablaPedidosBody = document.getElementById('tabla-pedidos-body');
    tablaPedidosBody.innerHTML = '';
    pedidos.forEach(function (pedido) {
        var row = document.createElement('tr');
        row.dataset.idPedido = pedido.id;
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input"></td>
            <td>${pedido.fecha}</td>
            <td class="editable nombre-editable" contenteditable>${pedido.nombre_pedido}</td>
            <td class="editable cantidad-editable" contenteditable>${pedido.cantidad}</td>
            <td class="unidad-editable"></td>
            <td class="proveedor-editable"></td>
            <td>${pedido.nombre_usuario}</td>
            <td>
                <button class="btn btn-danger" id=pedido${pedido.id}>Eliminar</button>
            </td>
        `;
        tablaPedidosBody.appendChild(row);
        cargarUnidades(pedido.id, pedido.unidad); // Cargar las unidades para este pedido
        cargarProveedores(pedido.id, pedido.proveedor); // Cargar los proveedores para este pedido
        document.querySelector("#pedido" + pedido.id).addEventListener('click', function () {
            eliminarSolicitud(pedido.id);
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
    console.log('Eliminar pedido con ID:', idPedido);
}

function validarPedidosYGenerarPDF() {
    // Aquí puedes recopilar todos los cambios y aplicarlos a la base de datos
    // Luego, generar el PDF con la información actualizada
    console.log('Validar pedidos y generar PDF');
}
