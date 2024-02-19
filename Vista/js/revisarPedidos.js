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

    // Agregar event listener para detectar cambios en las celdas editables
    document.querySelectorAll('.editable').forEach(function(cell, index) {
        cell.addEventListener('input', function() {
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
        row.dataset.idPedido = pedido.id;
        row.innerHTML = `
            <td><input type="checkbox" class="form-check-input"></td>
            <td>${pedido.fecha}</td>
            <td class="editable nombre-editable" contenteditable>${pedido.nombre_pedido}</td>
            <td class="editable cantidad-editable" contenteditable>${pedido.cantidad}</td>
            <td class="unidad-editable"></td>
            <td>${pedido.nombre_usuario}</td>
            <td>
                <button class="btn btn-danger" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
            </td>
        `;
        tablaPedidosBody.appendChild(row);
        cargarUnidades(pedido.id); // Cargar las unidades para este pedido
    });
}



function cargarUnidades(idPedido) {
    $.ajax({
        url: "../../Controlador/php/unidades.php", // Ruta al script PHP que devuelve las unidades
        type: "POST",
        dataType: "json",
        success: function(unidades) {
            var selectUnidad = document.createElement('select');
            selectUnidad.classList.add('form-control');
            unidades.forEach(function(unidad) {
                var option = document.createElement('option');
                option.value = unidad.unidad;
                option.textContent = unidad.unidad;
                selectUnidad.appendChild(option);
            });
            var filaPedido = document.querySelector(`tr[data-idPedido="${idPedido}"]`);
            if (filaPedido) {
                var tdUnidad = filaPedido.querySelector('.unidad-editable'); // Obtener la celda de unidad
                tdUnidad.innerHTML = ''; // Limpiar el contenido existente
                tdUnidad.appendChild(selectUnidad);
            } else {
                console.error('No se encontró la fila de pedido con ID:', idPedido);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al cargar las unidades:', error);
        }
    });
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
