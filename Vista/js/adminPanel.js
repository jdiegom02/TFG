window.addEventListener("load", principal, false)



function principal() {
    comprobarSesion(function(valor) {
        if(valor == 0) {
            location.href = "../html/index.html";
        } else {
            document.getElementById("usuario").textContent = "Bienvenido " + valor.nombre;
            document.querySelector("#cerrar").appendChild(crearElemento("input",undefined, {"type":"button", "id":"cerrarsesion", "class":"btn btn-danger", "value":"Cerrar Sesión"}));
            document.querySelector("#cerrarsesion").addEventListener("click", () => {
                cerrarSesion();
            });
        }
    });
    document.getElementById("realizarPedido").addEventListener("click", manejadorClick);
    document.getElementById("revisarPedidos").addEventListener("click", manejadorClick);
    document.getElementById("gestionarResiduos").addEventListener("click", manejadorClick);
    document.getElementById("anadir").addEventListener("click", manejadorClick);
    document.getElementById("anadirProducto").addEventListener("click", insertarProducto);

}


function manejadorClick(e) {
    console.log(this.id);
    if (this.id === "anadir") {
        $('#modalAgregarProducto').modal('show');
    }
    else if (this.id === "revisarPedidos") {
        location.href = 'revisarPedidos.html';
    }
    else if (this.id === "realizarPedido") {
        location.href = 'pedidos.html';
    }
    else if (this.id === "gestionarResiduos") {
        location.href = 'gestionarResiduos.html';
    }

}

/*Funcion para mandar los productos al php para hacer la inserccion. */
/* HAY QUE HACER QUE SE MANDEN DEMOMENTO SOLO ES QUE FUNCIONA */
function insertarProducto(e) {
    // Obtener los valores de los campos de entrada
    var nombreProducto = document.getElementById('nombreProducto').value.trim();
    var categoriaProducto = document.getElementById('categoriaProducto').value;
    var unidadMedida = document.getElementById('unidadMedida').value.trim();
    var residuos = document.getElementById('residuos').value.trim();

    // Verificar los datos de entrada
    if (nombreProducto === '' || categoriaProducto === '' || unidadMedida === '' || residuos === '') {
        // Mostrar mensaje de error si algún campo está vacío
        mostrarMensajeError('Por favor, complete todos los campos.');
        return;
    }

    // Si los datos de entrada son correctos, mostrar el mensaje de éxito
    //mostrarMensajeExito();
    // Crear objeto con los datos del producto
    var producto = {
        nombre: nombreProducto,
        categoria: categoriaProducto,
        unidadMedida: unidadMedida,
        residuos: residuos
    };

    // Realizar solicitud AJAX para enviar los datos al backend
    $.ajax({
        type: "POST",
        url: "ruta-a-tu-script-de-backend.php", // Especifica la URL de tu script de backend
        data: producto,
        success: function (response) {
            // Manejar la respuesta del servidor
            console.log(response);
            // Mostrar mensaje de éxito
            mostrarMensajeExito();
            // Limpiar los campos del formulario después de la inserción exitosa
            document.getElementById('nombreProducto').value = '';
            document.getElementById('categoriaProducto').value = '';
            document.getElementById('unidadMedida').value = '';
            document.getElementById('residuos').value = '';
            // Cerrar el modal
            $('#modalAgregarProducto').modal('hide');
        },
        error: function (xhr, status, error) {
            // Manejar errores de la solicitud AJAX
            console.error(error);
            // Mostrar mensaje de error
            mostrarMensajeError('Hubo un error al procesar la solicitud.');
        }
    });

 }

function mostrarMensajeExito() {
    // Crear elemento de mensaje de éxito
    var mensajeElemento = crearElemento('div', 'Producto añadido a la base de datos', { 'class': 'mensaje-exito' });
    // Establecer estilos para el mensaje
    mensajeElemento.style.position = 'fixed';
    mensajeElemento.style.top = '20%';
    mensajeElemento.style.left = '50%';
    mensajeElemento.style.transform = 'translate(-50%, -50%)';
    mensajeElemento.style.backgroundColor = '#28a745';
    mensajeElemento.style.color = '#fff';
    mensajeElemento.style.padding = '20px';
    mensajeElemento.style.borderRadius = '10px';
    mensajeElemento.style.zIndex = '9999';
    mensajeElemento.style.fontSize = '24px';
    mensajeElemento.style.textAlign = 'center';
    mensajeElemento.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    // Agregar mensaje al body
    document.body.appendChild(mensajeElemento);

    // Difuminar el fondo
    var contenedorPrincipal = document.querySelector('.container');
    contenedorPrincipal.style.filter = 'blur(5px)';

    // Eliminar el efecto de difuminado después de 5 segundos
    setTimeout(function () {
        contenedorPrincipal.style.filter = 'none';
    }, 5000);

    // Eliminar el mensaje después de 5 segundos
    setTimeout(function () {
        mensajeElemento.remove();
    }, 3000);

    // Permitir al usuario quitar el mensaje haciendo clic en él
    mensajeElemento.addEventListener('click', function () {
        contenedorPrincipal.style.filter = 'none';
        mensajeElemento.remove();
    });
}

function mostrarMensajeError(mensaje) {
    // Crear elemento de mensaje de error
    var mensajeElemento = crearElemento('div', mensaje, { 'class': 'mensaje-error' });
    // Establecer estilos para el mensaje
    mensajeElemento.style.position = 'fixed';
    mensajeElemento.style.top = '20%';
    mensajeElemento.style.left = '50%';
    mensajeElemento.style.transform = 'translate(-50%, -50%)';
    mensajeElemento.style.backgroundColor = '#dc3545';
    mensajeElemento.style.color = '#fff';
    mensajeElemento.style.padding = '20px';
    mensajeElemento.style.borderRadius = '10px';
    mensajeElemento.style.zIndex = '9999';
    mensajeElemento.style.fontSize = '24px';
    mensajeElemento.style.textAlign = 'center';
    mensajeElemento.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    // Agregar mensaje al body
    document.body.appendChild(mensajeElemento);

    // Difuminar el fondo
    var contenedorPrincipal = document.querySelector('.container');
    contenedorPrincipal.style.filter = 'blur(5px)';

    // Eliminar el efecto de difuminado después de 5 segundos
    setTimeout(function () {
        contenedorPrincipal.style.filter = 'none';
    }, 5000);

    // Eliminar el mensaje después de 5 segundos
    setTimeout(function () {
        mensajeElemento.remove();
    }, 3000);
}



/* fUNCION PARA CREAR ELEMENTO */
function crearElemento(etiqueta, texto, atributos) {
    let elementoNuevo = document.createElement(etiqueta);
    if (texto !== undefined) {
        let contenidoTexto = document.createTextNode(texto);
        elementoNuevo.appendChild(contenidoTexto);
    }
    if (atributos !== undefined) {
        for (let clave in atributos) {
            elementoNuevo.setAttribute(clave, atributos[clave]);
        }
    }
    return elementoNuevo;
}




