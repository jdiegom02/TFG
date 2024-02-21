window.addEventListener("load", principal, false);

function principal(e) {
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
    var contenedorPedidos = document.getElementById('contenedor-pedidos');
    contenedorPedidos.innerHTML = '';

    pedidos.forEach(function(pedido) {
        var pedidoContainer = document.createElement('div');
        pedidoContainer.classList.add('pedido-container');
        
        var fecha = document.createElement('div');
        fecha.textContent = `Fecha: ${pedido.fecha}`;
        pedidoContainer.appendChild(fecha);

        var nombre = document.createElement('div');
        nombre.textContent = `Nombre: ${pedido.nombre_pedido}`;
        pedidoContainer.appendChild(nombre);

        var cantidad = document.createElement('div');
        cantidad.textContent = `Cantidad: ${pedido.cantidad}`;
        pedidoContainer.appendChild(cantidad);

        var nombreUsuario = document.createElement('div');
        nombreUsuario.textContent = `Usuario: ${pedido.nombre_usuario}`;
        pedidoContainer.appendChild(nombreUsuario);

        var eliminarBtn = document.createElement('button');
        eliminarBtn.textContent = 'Eliminar';
        eliminarBtn.classList.add('btn', 'btn-danger');
        eliminarBtn.dataset.idPedido = pedido.id;
        eliminarBtn.addEventListener('click', function() {
            eliminarSolicitud(pedido.id);
        });
        pedidoContainer.appendChild(eliminarBtn);

        contenedorPedidos.appendChild(pedidoContainer);
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

function validarPedidosYGenerarPDF(idPedido) {
    // Aquí puedes recopilar todos los cambios y aplicarlos a la base de datos
    let checkeds = [];
    console.log(idPedido);
    idPedido.forEach(pedido => {
        let i = 0;
        let chequeo = document.querySelector(`tr[data-id-pedido="${pedido}"]`).children[0].children[0];
        if (chequeo.checked) {
            checkeds.push([
                chequeo.parentNode.parentNode.children[2].textContent, // Texto de la columna 2
                chequeo.parentNode.parentNode.children[3].textContent, // Texto de la columna 3
                chequeo.parentNode.parentNode.children[4].querySelector('select').selectedOptions[0].textContent, // Texto de la columna 4
                chequeo.parentNode.parentNode.children[5].querySelector('select').selectedOptions[0].textContent, // Texto seleccionado del select de la columna 5
                chequeo.parentNode.parentNode.children[6].textContent,
                chequeo.parentNode.parentNode.getAttribute('data-id-pedido')
            ]);
             }
        // console.log(chequeo.parentNode.parentNode.children[2].textContent);
    });
    console.log(checkeds);
    insertarEnPedidos(checkeds);

    // Luego, generar el PDF con la información actualizada
    console.log('Validar pedidos y generar PDF');
}

