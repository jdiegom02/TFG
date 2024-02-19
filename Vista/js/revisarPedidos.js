window.addEventListener("load", principal, false);

function principal(e) {
    let pedidos = [];
    cargarPedidos(function (data) {
        pedidos = data;
        mostrarPedidos(pedidos);
    });
}



function mostrarPedidos(pedidos) {
    var listaPedidosContainer = document.getElementById('lista-pedidos');
    listaPedidosContainer.innerHTML = '';
    pedidos.forEach(function (pedido) {
        var pedidoTarjeta = document.createElement('div');
        pedidoTarjeta.classList.add('card', 'pedido');
        var tarjetaContenido = `
            <div class="card-body">
                <h5 class="card-title">Pedido ${pedido.cliente}</h5>
                <p class="card-text"><strong>Cliente:</strong> <span id="cliente${pedido.id}">${pedido.cliente}</span></p>
                <p class="card-text"><strong>Detalles:</strong> <span id="detalles${pedido.id}">${pedido.detalles}</span></p>
                <button class="btn btn-primary" data-toggle="modal" data-target="#modalModificarPedido${pedido.id}">Modificar Pedido</button>
            </div>
        `;
        pedidoTarjeta.innerHTML = tarjetaContenido;
        listaPedidosContainer.appendChild(pedidoTarjeta);
        var modalModificarPedido = `
            <div class="modal fade" id="modalModificarPedido${pedido.id}" tabindex="-1" role="dialog" aria-labelledby="modalModificarPedido${pedido.id}Label" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalModificarPedido${pedido.id}Label">Modificar Pedido ${pedido.id}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Cerrar">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="cliente${pedido.id}">Cliente</label>
                                    <input type="text" class="form-control" id="nuevoCliente${pedido.id}" value="${pedido.cliente}">
                                </div>
                                <div class="form-group">
                                    <label for="detalles${pedido.id}">Detalles</label>
                                    <input type="text" class="form-control" id="nuevosDetalles${pedido.id}" value="${pedido.detalles}">
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" class="btn btn-primary" onclick="guardarCambiosPedido(${pedido.id})">Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalModificarPedido);
    });
}

function guardarCambiosPedido(idPedido) {
    var nuevoCliente = document.getElementById(`nuevoCliente${idPedido}`).value;
    var nuevosDetalles = document.getElementById(`nuevosDetalles${idPedido}`).value;
    var clienteSpan = document.getElementById(`cliente${idPedido}`);
    var detallesSpan = document.getElementById(`detalles${idPedido}`);
    clienteSpan.textContent = nuevoCliente;
    detallesSpan.textContent = nuevosDetalles;
    $('#modalModificarPedido' + idPedido).modal('hide');
}

function validarPedidosYGenerarPDF() {
    // Aquí puedes recopilar todos los cambios y aplicarlos a la base de datos
    // Luego, generar el PDF con la información actualizada
    console.log('Validar pedidos y generar PDF');
}
