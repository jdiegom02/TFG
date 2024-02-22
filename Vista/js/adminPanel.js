window.addEventListener("load", principal, false);
let usuarioIniciado;
let contador=0;
function principal() {
    comprobarSesion(function (valor) {
        if (valor == 0) {
            location.href = "../html/index.html";
        } else {
            if (valor.esadmin) {
                document.getElementById("usuario").textContent = "Bienvenido " + valor.nombre;
                usuarioIniciado=valor.nombre;
                document.querySelector("#cerrar").appendChild(crearElemento("input", undefined, { "type": "button", "id": "cerrarsesion", "class": "btn btn-danger", "value": "Cerrar Sesión" }));
                document.querySelector("#cerrarsesion").addEventListener("click", () => {
                    cerrarSesion();
                });
            } else {
                location.href = "../html/pedidos.html";
            }
        }
    });
    document.getElementById("realizarPedido").addEventListener("click", manejadorClick);
    document.getElementById("revisarPedidos").addEventListener("click", manejadorClick);
    document.getElementById("gestionarResiduos").addEventListener("click", manejadorClick);
    document.getElementById("anadir").addEventListener("click", manejadorClick);
    document.getElementById("anadirProducto").addEventListener("click", insertarProducto);
    document.getElementById("gestionarUsuarios").addEventListener("click", manejadorClick);
    document.getElementById("gestionarProveedores").addEventListener("click", manejadorClick);
    document.getElementById("agregarResiduo").addEventListener("click", manejarsuma);
    document.getElementById("abrirModal").addEventListener("click", manejadorClick);
    
    
    $('#modalGestionarUsuarios').on('show.bs.modal', function () {
        cargarUsuarios();
    });



}

function manejadorClick(e) {
    //console.log(this.id);
    if (this.id === "anadir") {
        $('#modalGestionarProducto').modal('show');
        limpiarMemoria()
        cargarDatosProductos();
        //$('#modalAgregarProducto').modal('show');
        cargarResiduos();
    }
    else if (this.id === "abrirModal") {
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
    else if (this.id === "gestionarUsuarios") {
        $('#modalGestionarUsuarios').modal('show');
        document.getElementById("btnanadirUsuario").addEventListener("click", manejadorAnadir);
        
    }
    else if (this.id === "gestionarProveedores") {
        location.href = 'gestionarProveedores.html';
    }
}

function manejadorAnadir(e)
{
    $('#modalAgregarUsuario').modal('show');
}

function manejarsuma(e)
{
    e.preventDefault();
   contador++;
   agregarNuevoCampoResiduo(contador);

}

function agregarNuevoCampoResiduo(numero) {

   // Crear el nuevo campo de entrada de residuos
   var nuevoCampoResiduo = crearElemento('div', undefined, { 'class': 'input-group' });

   var inputResiduo = crearElemento('input', undefined, { 'type': 'number', 'class': 'form-control input-sm claseResiduos', 'id': 'residuos' + numero, 'placeholder': 'Residuos  ' + (numero + 1), 'style': 'max-width: 100px;' });

   var divAppend = crearElemento('div', undefined, { 'class': 'input-group-append' });

   var labelKilos = crearElemento('label', 'Kg', { 'for': 'kilos' });

   var selectDespegable = crearElemento('select', undefined, { 'class': 'form-control despegablesResiduos', 'id': 'despegableResiduos'+ numero });

   divAppend.appendChild(labelKilos);
   divAppend.appendChild(selectDespegable);

   nuevoCampoResiduo.appendChild(inputResiduo);
   nuevoCampoResiduo.appendChild(divAppend);

   // Agregar el nuevo campo de entrada de residuos al contenedor
   document.getElementById('contenedorResiduos').appendChild(nuevoCampoResiduo);
   cargarResiduos();
}



function cargarDatosProductos() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/productoResiduo.php",
        dataType: "JSON",
        success: function (data) {
            console.log(data);
            $('.producto').empty();

            // Objeto para almacenar productos con sus residuos agrupados
            var productosConResiduos = {};

            // Iterar sobre los datos y agrupar los residuos por producto
            $.each(data, function (index, producto) {
                // Verificar si ya hemos visto este producto
                if (!productosConResiduos[producto.nombre_producto]) {
                    productosConResiduos[producto.nombre_producto] = {
                        categoria: producto.categoria,
                        unidad: producto.unidad,
                        residuos: []  // Inicializar lista de residuos para este producto
                    };
                }
                // Agregar residuos al producto correspondiente
                productosConResiduos[producto.nombre_producto].residuos.push(producto.residuos);
            });

            // Iterar sobre los productos con sus residuos y generar el HTML
            $.each(productosConResiduos, function (nombre_producto, producto) {
                var productoID = nombre_producto.replace(/\s+/g, ''); // ID del producto

                // Generar HTML para los residuos
                var residuosHTML = '';
                $.each(producto.residuos, function (index, residuo) {
                    residuosHTML += '<li>' + residuo + '</li>';
                });

                // Generar HTML para el producto con sus residuos
                var productoHTML = '<div class="row mb-3" id="' + productoID + '" style="border: 1px solid black;">';
                productoHTML += '<div class="col-sm-3"><span>' + nombre_producto + '</span></div>';
                productoHTML += '<div class="col-sm-3"><span>' + producto.categoria + '</span></div>';
                productoHTML += '<div class="col-sm-3"><span>' + producto.unidad + '</span></div>';
                productoHTML += '<div class="col-sm-3"><ul>' + residuosHTML + '</ul></div>';
                productoHTML += '<div class="col-sm-3"><button type="button" class="btn btn-primary btnEditar" data-producto-id="' + productoID + '">Editar</button></div>';
                productoHTML += '</div>';

                // Agregar producto con sus residuos al contenedor
                $('#gestionPRO').append(productoHTML);
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function limpiarMemoria() {
    $('#gestionPRO').empty();
}










/*Funcion para mandar los productos al php para hacer la inserccion. */
function insertarProducto(e) {
    // Obtener los valores de los campos de entrada
    var nombreProducto = document.getElementById('nombreProducto').value.trim();
    var categoriaProducto = document.getElementById('categoriaProducto').value;
    var unidadMedida = document.getElementById('unidadMedida').value.trim();

    /*var residuosUnidad = document.getElementById('residuos').value.trim();
    var residuosTipo = document.getElementById('despegableResiduos').value.trim();*/

         // Crear arrays para almacenar los valores de los residuos
    var residuosUnidad = [];
    var residuosTipo = [];

    // Obtener todos los campos de residuos dinámicos
    var camposResiduos = document.querySelectorAll('.claseResiduos');

    // Iterar sobre los campos de residuos
    camposResiduos.forEach(function(campo) {
        // Obtener el valor del campo de residuos de unidad
        var residuoUnidad = campo.value.trim();
        if (residuoUnidad !== '') {
            residuosUnidad.push(residuoUnidad); // Agregar el valor al array de residuos de unidad

            // Obtener el valor del campo de residuos de tipo correspondiente
            var idNumero = campo.id.replace('residuos', ''); // Obtener el número de identificación del campo
            var residuoTipo = document.getElementById('despegableResiduos' + idNumero).value.trim(); // Obtener el valor del campo de residuos de tipo
            residuosTipo.push(residuoTipo); // Agregar el valor al array de residuos de tipo
        }
    });

    for (let index = 0; index < residuosUnidad.length; index++) {
        
        // console.log(residuosUnidad[index]);
        // console.log(residuosTipo[index]);
        
    }


    // Verificar los datos de entrada
    if (nombreProducto === '' || categoriaProducto === '' || unidadMedida === '' || residuosUnidad[0] === undefined) {
        // Mostrar mensaje de error si algún campo está vacío
        mostrarMensajeError('Por favor, complete todos los campos.');
        return;
    }

    var arrayDatosProducto = [
        nombreProducto,
        categoriaProducto,
        unidadMedida,
        residuosUnidad,
        residuosTipo
    ];
    
    // console.log(arrayDatosProducto);
    // console.log("Prueba "+arrayDatosProducto[3][1]+"-"+arrayDatosProducto[4][1]);

    // Realizar solicitud AJAX para enviar los datos al backend
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/funcionesProductos.php",
        data: {datosProducto : arrayDatosProducto},
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
    }, 2000);

    // Eliminar el mensaje después de 5 segundos
    setTimeout(function () {
        mensajeElemento.remove();
    }, 2000);

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
    }, 2000);

    // Eliminar el mensaje después de 5 segundos
    setTimeout(function () {
        mensajeElemento.remove();
    }, 2000);
}

/* --------------- PARA CARGAR LAS OPCIONES DE LA CATEGORIA Y UNIDADES DE MEDIDA EN EL MODAL---------------- */


function cargarOpcionesCategoria() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/categorias2.php",
        dataType: "json",
        success: function (data) {
            // Limpiar el select
            $('#categoriaProducto').empty();
            // Agregar la opción por defecto
            $('#categoriaProducto').append('<option value="">Seleccione una categoría...</option>');
            // Iterar sobre los datos recibidos y agregar las opciones al select
            $.each(data, function (index, categoria) {
                $('#categoriaProducto').append('<option value="' + categoria.descripcion + '">' + categoria.descripcion + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function cargarOpcionesUnidadMedida() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/unidades.php",
        dataType: "json",
        success: function (data) {
            // Limpiar el select
            $('#unidadMedida').empty();
            // Agregar la opción por defecto
            $('#unidadMedida').append('<option value="">Seleccione una unidad...</option>');
            // Iterar sobre los datos recibidos y agregar las opciones al select
            $.each(data, function (index, unidad) {
                $('#unidadMedida').append('<option value="' + unidad.unidad + '">' + unidad.unidad + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

// Llamar a la función para cargar las opciones del select de unidades de medida al cargar la página
cargarOpcionesUnidadMedida();
cargarOpcionesCategoria();

$('#anadirProducto').click(function () {
    insertarProducto();
});

/* --------------- PARA CARGAR LAS OPCIONES DE LA CATEGORIA Y UNIDADES DE MEDIDA EN EL MODAL-------FIN--------- */


/*-------------------------Para MODAL GESTIONAR USUARIOS--------------------- */

function cargarUsuarios() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/usuarios.php",
        dataType: "json",
        success: function(data) {
            // Limpiar el contenedor de usuarios
            $('#tablaUsuarios').empty();
            // Iterar sobre los datos de los usuarios y agregarlos al modal
            data.forEach(function(usuario) {
                var esAdmin = usuario.esAdmin;
                var activo = usuario.activo;
                var nombreUsuario = usuario.nombre;
                // Verificar si el usuario es un administrador
                if (esAdmin === "Sí" && nombreUsuario === usuarioIniciado) {
                    // Si el usuario es un administrador, no se agregan los botones
                    var fila = '<tr>' +
                        '<td>' + usuario.nombre + '</td>' +
                        '<td>' + usuario.email + '</td>' +
                        '<td>' + usuario.telefono + '</td>' +
                        '<td>' + esAdmin + '</td>' +
                        '<td>' + activo + '</td>' +
                        '</tr>';
                } else {
                    // Si el usuario no es un administrador, se agregan los botones de editar y cambiar contraseña
                    var fila = '<tr>' +
                        '<td>' + usuario.nombre + '</td>' +
                        '<td>' + usuario.email + '</td>' +
                        '<td>' + usuario.telefono + '</td>' +
                        '<td>' + esAdmin + '</td>' +
                        '<td>' + activo + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-primary btn-editar-usuario" id="'+usuario.id+'" data-id="' + usuario.id + '">Editar</button>' +
                        '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-primary btn-cambiar-contrasena ml-2" data-id="' + usuario.id + '">Cambiar Contraseña</button>' +
                        '</td>' +
                        '</tr>';
                }
                // Agregar la fila a la tabla
                $('#tablaUsuarios').append(fila);
            });
            

            // Agregar evento a los botones "Editar" de los usuarios
            $('.btn-editar-usuario').click(function() {
                var fila = $(this).closest('tr'); // Obtener la fila más cercana al botón de editar
                var idUsuario = $(this).data('id'); // Obtener el ID del usuario
                var nombre = fila.find('td:eq(0)').text(); // Obtener el texto del primer td (columna) de la fila
                var email = fila.find('td:eq(1)').text(); // Obtener el texto del segundo td (columna) de la fila
                var telefono = fila.find('td:eq(2)').text(); // Obtener el texto del tercer td (columna) de la fila
                $('#nombreEditar').val(nombre);
                $('#emailEditar').val(email);
                $('#telefonoEditar').val(telefono);
                $('#guardarCambios').data('idUsuario', idUsuario);
                $('#modalEditar .modal-title').text('Editar Usuario: ' + nombre);
                //SE ABRE MODAL DE EDITAR
                $('#modalEditar').modal('show');

            });

            // Agregar evento a los botones "Cambiar Contraseña" de los usuarios 
            $('.btn-cambiar-contrasena').click(function() {
                var fila = $(this).closest('tr'); 
                var nombre = fila.find('td:eq(0)').text(); // Obtener el texto del primer td (columna) de la fila
                $('#modalCambiarContrasena .modal-title').text('Cambiar Contraseña de: ' + nombre);
                $('#guardarPass').data('idUsuario', $(this).data('id'));
                $('#modalCambiarContrasena').modal('show');
            });

            $('#guardarCambios').click(function() {
                if($('#nombreEditar').val().length > 0 && /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test($('#emailEditar').val()) && /^\d{9}$/.test($('#telefonoEditar').val())) {
                    $.ajax({
                        type: "POST",
                        url: "../../Controlador/php/gestionarUsuarios.php",
                        data: {
                            id: $(this).data('idUsuario'),
                            nombre: $('#nombreEditar').val(),
                            email: $('#emailEditar').val(),
                            telefono: $('#telefonoEditar').val(),
                            admin: $('#adminEditar').val(),
                            activo: $('#activoEditar').val()

                        },
                      }).done(function (a) {
                        $('#modalEditar').modal('hide');
                        cargarUsuarios();
                    });
                }

            });

            $('#guardarPass').click(function() {
                if($('#nuevaContrasena').val() === $('#repetirNuevaContrasena').val()) {
                    if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/.test($('#nuevaContrasena').val())){
                        $.ajax({
                            type: "POST",
                            url: "../../Controlador/php/gestionarUsuarios.php",
                            data: {
                                id: $(this).data('idUsuario'),
                                password: $('#nuevaContrasena').val()
                            },
                          }).done(function (a) {
                            $('#modalCambiarContrasena').modal('hide');
                        });
                    } else {
                        console.log("La contraseña tiene poca seguridad");
                    }
                } else {
                    console.log("Las contraseñas no coinciden");
                }

            });

            $('#guardarUsuario').click(function() {
            
                if($('#nombreAgregar').val().length > 0 && /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test($('#emailAgregar').val()) && /^\d{9}$/.test($('#telefonoAgregar').val()) && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/.test($('#passwordAgregar').val())){
                        $.ajax({
                            type: "POST",
                            url: "../../Controlador/php/gestionarUsuarios.php",
                            data: {
                                nombreA: $('#nombreAgregar').val(),
                                emailA: $('#emailAgregar').val(),
                                telefonoA: $('#telefonoAgregar').val(),
                                adminA: $('#adminAgregar').val(),
                                activoA: $('#activoAgregar').val(),
                                passwordA: $('#passwordAgregar').val()
                            },
                          }).done(function (a) {
                            $('#modalAgregarUsuario').modal('hide');
                            cargarUsuarios();
                        });
                } else {
                    console.log("fallo");
                }

            });
        },
        error: function(xhr, status, error) {
            console.error(error);
            // Manejar errores, como mostrar un mensaje al usuario
            $('#tablaUsuarios').html('<tr><td colspan="6">Error al cargar usuarios</td></tr>');
        }
    });
    
}


/*-------------------------Para MODAL GESTIONAR USUARIOS-------- FIN----------------- */

/*---------------------------PARA LOS RESIDUOS DE AÑADIR---------------------------------------------------- */



function cargarResiduos() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/residuos.php", 
        dataType: "json",
        success: function (data) {
            // Limpiar el select
            $('#despegableResiduos').empty();
            // Agregar las opciones al select
            $.each(data, function (index, opcion) {
                $('#despegableResiduos').append('<option value="' + opcion.descripcion + '">' + opcion.descripcion + '</option>');
                $('.despegablesResiduos').append('<option value="' + opcion.descripcion + '">' + opcion.descripcion + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}



/*---------------------------PARA LOS RESIDUOS DE AÑADIR-----------------FIN----------------------------------- */




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

