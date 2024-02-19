window.addEventListener("load", principal, false);

function principal(e) {
    cargarPedidosDesdePHP();
    var btnValidarPedidos = document.getElementById('btnValidarPedidos');
    btnValidarPedidos.addEventListener('click', function() {
        validarPedidosYGenerarPDF();
    });
    document.getElementById('guardarCambiosPedido').addEventListener('click', function() {
        guardarCambiosPedido();
    });
}

function cargarPedidosDesdePHP() {
    // Realizar una solicitud AJAX para obtener los datos de los pedidos desde PHP
    $.ajax({
        url: '../../Controlador/php/pedidosmostrar.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            mostrarPedidos(data); // Llamar a la función mostrarPedidos con los datos obtenidos
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar los pedidos desde PHP:', error);
        }
    });
}

function mostrarPedidos(pedidos) {
    var tablaPedidosBody = document.getElementById('tabla-pedidos-body');
    tablaPedidosBody.innerHTML = '';
    pedidos.forEach(function(pedido) {
        var row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input"></td>
            <td>${pedido.fecha}</td>
            <td>${pedido.descripcion}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.unidad}</td>
            <td>${pedido.usuario}</td>
            <td>
                <button class="btn btn-primary" data-toggle="modal" data-target="#modalModificarPedido" onclick="prepararModalModificarPedido(${pedido.id})">Modificar</button>
                <button class="btn btn-danger" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
            </td>
        `;
        tablaPedidosBody.appendChild(row);
    });
}

function prepararModalModificarPedido(idPedido) {
    // Aquí puedes obtener los datos del pedido con el ID proporcionado y preparar el modal para su modificación
    var pedido = obtenerPedidoPorId(idPedido);
    document.getElementById('fechaPedido').value = pedido.fecha;
    document.getElementById('descripcionPedido').value = pedido.descripcion;
    document.getElementById('cantidadPedido').value = pedido.cantidad;
    document.getElementById('unidadPedido').value = pedido.unidad;
    document.getElementById('usuarioPedido').value = pedido.usuario;

    // Almacenar el ID del pedido que se está modificando en un atributo de datos del botón de guardar
    document.getElementById('guardarCambiosPedido').dataset.idPedido = idPedido;
}

function obtenerPedidoPorId(idPedido) {
    // Implementa aquí la lógica para obtener el pedido por su ID
    // Por ahora, solo se devolverá un pedido de ejemplo
    return { id: idPedido, fecha: '2024-02-19', descripcion: 'Pedido de ejemplo', cantidad: 5, unidad: 'unidad', usuario: 'Usuario de ejemplo' };
}

function guardarCambiosPedido() {
    // Obtener el ID del pedido que se está modificando desde el atributo de datos del botón de guardar
    var idPedido = document.getElementById('guardarCambiosPedido').dataset.idPedido;

    // Obtener los nuevos valores del pedido desde el formulario modal
    var nuevaDescripcion = document.getElementById('descripcionPedido').value;
    var nuevaCantidad = document.getElementById('cantidadPedido').value;
    var nuevaUnidad = document.getElementById('unidadPedido').value;

    // Aquí puedes implementar la lógica para guardar los cambios del pedido con el ID proporcionado
    console.log('Guardar cambios del pedido con ID:', idPedido);
    console.log('Nueva descripción:', nuevaDescripcion);
    console.log('Nueva cantidad:', nuevaCantidad);
    console.log('Nueva unidad:', nuevaUnidad);

    // Actualizar los valores en la tabla
    var filaPedido = document.getElementById('pedido' + idPedido);
    filaPedido.cells[2].textContent = nuevaDescripcion;
    filaPedido.cells[3].textContent = nuevaCantidad;
    filaPedido.cells[4].textContent = nuevaUnidad;

    // Cerrar el modal después de guardar los cambios
    $('#modalModificarPedido').modal('hide');
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
