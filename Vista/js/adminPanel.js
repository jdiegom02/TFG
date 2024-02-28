window.addEventListener("load", principal, false);
let usuarioIniciado;
let contador = 0;
let cargarBoton = false;
function principal() {
    comprobarSesion(function (valor) {
        if (valor == 0) {
            location.href = "../html/index.html";
        } else {
            if (valor.esadmin) {
                document.getElementById("botonDarkMode").addEventListener("click", activarDesactivarModoOscuro);
                document.getElementById("desplegablellamar").addEventListener("mouseover", desplegarBotonesUsuario)
                document.getElementById("desplegablellamar").addEventListener("click", desplegarBotonesUsuario)
                document.getElementById("desplegableFunciones").addEventListener("mouseover", desplegarBotonesUsuario)
                usuarioIniciado = valor.nombre;
                document.querySelector("#desplegableFunciones").appendChild(crearElemento("input", undefined, { "type": "button", "id": "cerrarsesion", "class": "btn btn-danger", "value": "Cerrar Sesión" }));
                document.querySelector("#cerrarsesion").addEventListener("click", () => {
                    cerrarSesion();
                });
                console.log(valor.nombre)
                mostrarDatosUsuario(usuarioIniciado)
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

    document.getElementById("crearCategoria").addEventListener("click", manejadoranadirCategoria);
    document.getElementById("crearUnidad").addEventListener("click", manejadoranadirUnidad);

    document.getElementById("anadirCategoriaGuardar").addEventListener("click", anadirCategoria);
    document.getElementById("anadirUnidadGuardar").addEventListener("click", anadirUnidad);

    //document.getElementById("anadirResiduoAUnProducto").addEventListener("click", manejadorAnadirResiduoAPRoducto);
    document.getElementById("guardarAnadirResiduoAProducto").addEventListener("click", manejadorResiduoInsertarBase);


    $('#modalGestionarUsuarios').on('show.bs.modal', function () {
        cargarUsuarios();
    });

    $('#guardarCambios2').click(modificarProducto);

}

function manejadorClick(e) {
    //console.log(this.id);
    if (this.id === "anadir") {
        $('#modalGestionarProducto').modal('show');
        limpiarMemoria()
        cargarDatosProductos();
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



function manejadoranadirUnidad(e) {
    $('#modalAnadirUnidad').modal('show');
}

function manejadoranadirCategoria(e) {
    $('#modalAnadirCategoria').modal('show');
}

function manejadorAnadir(e) {
    $('#modalAgregarUsuario').modal('show');
}

function manejarsuma(e) {
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

    var selectDespegable = crearElemento('select', undefined, { 'class': 'form-control despegablesResiduos', 'id': 'despegableResiduos' + numero });

    divAppend.appendChild(labelKilos);
    divAppend.appendChild(selectDespegable);

    nuevoCampoResiduo.appendChild(inputResiduo);
    nuevoCampoResiduo.appendChild(divAppend);

    // Agregar el nuevo campo de entrada de residuos al contenedor
    document.getElementById('contenedorResiduos').appendChild(nuevoCampoResiduo);
    cargarResiduos();
}



function cargarDatosProductos() {
    let sumatorio = 0;
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/productoResiduo.php",
        dataType: "JSON",
        success: function (data) {
            $('.producto').empty();

            $.each(data, function (index, producto) {
                var productoID = producto.producto_id

                var categoriasHTML = '';
                $.each(producto.categorias, function (index, categoria) {
                    categoriasHTML += '<li>' + categoria + '</li>';
                });

                var residuosHTML = '';
                $.each(producto.residuos, function (index, residuo) {
                    residuosHTML += '<li>' + residuo + '</li>';
                });

                var productoHTML = '<div class="row mb-3" id="' + productoID + '" style="border: 1px solid black;">';
                productoHTML += '<div class="col-sm-3"><span>' + producto.nombre_producto + '</span></div>';
                productoHTML += '<div class="col-sm-3"><ul>' + categoriasHTML + '</ul></div>';
                productoHTML += '<div class="col-sm-3"><span>' + producto.unidad + '</span></div>';
                productoHTML += '<div class="col-sm-3"><ul>' + residuosHTML + '</ul></div>';
                productoHTML += '<div class="col-sm-3"><button type="button" id="' + producto.producto_id + '" class="btn btnEditar" data-producto-id="' + producto.producto_id + '">Editar</button></div>';
                productoHTML += '</div>';

                $('#gestionPRO').append(productoHTML);
            });

            $(document).on('click', '.btnEditar', function () {
                var productoID2 = $(this).data('producto-id');

                cargarResiduosPorProducto(productoID2);

                var producto = data.find(prod => prod.producto_id == productoID2);

                if (producto) {
                    sumatorio++;
                    $('#productoIDModificar').val(producto.producto_id);
                    $('#nombreProductoModificar').val(producto.nombre_producto);
                    $('#unidadProductoModificar').val(producto.unidad);

                    $('#tablaResiduos tbody').empty();
                    /* $.each(producto.residuos, function (index, residuo) {
                         var newRow = '<tr>' +
                             '<td>' + residuo.cantidad + '</td>' +
                             '<td>' + residuo.unidad + '</td>' +
                             '<td>' + residuo.tipo + '</td>' +
                             '<td><button type="button" class="btn btn-danger eliminar-residuo">Eliminar</button></td>' +
                             '</tr>';
 
                         $('#tablaResiduos tbody').append(newRow);
                     });
 
                     $(document).on('click', '.eliminar-residuo', function () {
                         $(this).closest('.residuo-row').remove();
                     });*/

                    $('#categoriaProductoModificar').empty();
                    $.each(producto.categorias, function (index, categoria) {
                        var nuevoDivSelect = $('<div class="form-group"></div>');
                        var nuevoCategoriaDropdown = '<select class="form-control categoriaProductoModi" id="categoria_' + producto.producto_id + '_' + index + '">' +
                            '<option value="' + categoria + '">' + categoria + '</option>' +
                            '</select>';
                        nuevoDivSelect.append(nuevoCategoriaDropdown);
                        $('#categoriaProductoModificar').append(nuevoDivSelect);
                        cargarOpcionesCategoriaModiPro(producto.categorias);
                    });

                    $('#editarProductoModal').modal('show');
                    cargarResiduosModiPro();
                    if (!cargarBoton) {
                        cargarBoton = true;
                        $('#formularioEditarProducto').append(crearElemento("button", "Añadir residuo", {
                            "type": "button",
                            "class": "btn btn-secondary",
                            "data-producto-id": " " + producto.producto_id + " ",
                            "id": "anadirResiduoAUnProducto"
                        }));
                        document.getElementById("anadirResiduoAUnProducto").addEventListener("click", manejadorAnadirResiduoAPRoducto);
                    } else { }

                } else {
                    console.error("Producto no encontrado");
                }
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function cargarResiduosPorProducto(productoID) {
    // Realizar solicitud AJAX para obtener los residuos del producto
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/productoResiduosparatabla.php",
        dataType: "JSON",
        data: { producto_id: productoID },
        success: function (data) {
            $('#tablaResiduos tbody').empty();

            $.each(data.residuos, function (index, residuo) {
                var newRow = '<tr>' +
                    '<td>' + residuo.cantidad + '</td>' +
                    '<td>' + "Kilogramos" + '</td>' +
                    '<td>' + residuo.nombre_residuo + '</td>' +
                    '<td><button type="button" class="btn btn-danger eliminar-residuo" data-residuo-id=' + productoID + "-" + residuo.nombre_residuo + '>Eliminar</button></td>' +
                    '</tr>';

                $('#tablaResiduos tbody').append(newRow);
            });

            $('.eliminar-residuo').click(function () {
                var producto_residuo = $(this).data('residuo-id');
                $(this).closest('tr').remove();
                eliminarResiduo(producto_residuo);
            });

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function eliminarResiduo(producto_residuo) {


    $.ajax({

        type: "POST",
        url: "../../Controlador/php/eliminarResiduo.php",
        dataType: "JSON",
        data: { productoID: producto_residuo },
        success: function (response) {

        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });

}





function modificarProducto() {
    // Obtener los valores de los campos del modal de edición
    var idProducto = $('#productoIDModificar').val();
    var nombreProducto = $('#nombreProductoModificar').val();
    var unidadesProducto = $('#unidadProductoModificar').val();
    // Inicializar un array para almacenar las categorías y los residuos seleccionados
    var categorias = [];
    var residuos = [];

    // Recorrer cada checkbox de categorías y obtener los valores seleccionados
    $('#categoriaProductoModificar input[type="checkbox"]').each(function () {
        if ($(this).is(':checked')) { // Verificar si el checkbox está marcado
            categorias.push($(this).val());
        }
    });


    // Recorrer cada fila de la tabla de residuos y obtener los valores de residuos
    $('#tablaResiduos tbody tr').each(function () {
        var cantidad = $(this).find('td:eq(0)').text();
        var nombre_residuo = $(this).find('td:eq(2)').text();
        var residuo = {
            cantidad: cantidad,
            nombre_residuo: nombre_residuo
        };
        residuos.push(residuo);
    });



    // Realizar solicitud AJAX para enviar los datos al backend
    var arrayModificarProducto = {
        idProducto: idProducto,
        nombreProducto: nombreProducto,
        unidadesProducto: unidadesProducto,
        categorias: categorias,
        residuos: residuos
    };

    $.ajax({
        type: "POST",
        url: "../../Controlador/php/modificarProducto.php",
        data: { modificar: arrayModificarProducto },
        success: function (response) {
            // console.log(response);
            // Actualizar la interfaz de usuario, cerrar el modal
            $('#editarProductoModal').modal('hide');

            cargarDatosProductos();
        },
        error: function (xhr, status, error) {
            console.error(error);
            alert("Hubo un error al procesar la solicitud.");
        }
    });
    $('#modalGestionarProducto').modal('hide');
    $('#modalGestionarProducto').modal('show');
}



/*Las llamadas a las fiuncoines para que se rellenen las opciones */
cargarOpcionesUnidadMedidaModiPro();
/* Estas tres funciones estan mas abajo, pero estan modificadas para el modal de editar productos */
function cargarOpcionesCategoriaModiPro(categoriasSeleccionadas) {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/categorias2.php",
        dataType: "json",
        success: function (data) {
            // Limpiar el contenedor de categorías
            $('#categoriaProductoModificar').empty();

            // Iterar sobre los datos y agregar casillas de verificación
            $.each(data, function (index, categoria) {
                // Crear el input checkbox
                var checkbox = $('<input>').attr({
                    type: 'checkbox',
                    id: 'categoria_' + index,
                    class: 'categoriasCheck', // Asignar un ID único a cada checkbox
                    value: categoria.descripcion // Asignar el valor de la categoría
                });

                // Crear una etiqueta para el checkbox
                var label = $('<label>').attr('for', 'categoria_' + index).text(categoria.descripcion);

                // Verificar si la categoría está seleccionada
                if (categoriasSeleccionadas.includes(categoria.descripcion)) {
                    checkbox.prop('checked', true); // Marcar la casilla de verificación
                }

                // Agregar el checkbox y la etiqueta al contenedor
                $('#categoriaProductoModificar').append(checkbox).append(label).append('<br>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}




function cargarOpcionesUnidadMedidaModiPro() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/unidades.php",
        dataType: "json",
        success: function (data) {
            // Limpiar el select del modal de edición
            $('#unidadProductoModificar').empty();
            $('#unidadProductoModificar').append('<option value="">Seleccione una unidad...</option>');
            // Iterar sobre los datos recibidos y agregar las opciones al select del modal de edición
            $.each(data, function (index, unidad) {
                $('#unidadProductoModificar').append('<option value="' + unidad.unidad + '">' + unidad.unidad + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}
function cargarResiduosModiPro() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/residuos.php",
        dataType: "json",
        success: function (data) {

            $('.despegablesResiduosModi').empty();

            $.each(data, function (index, opcion) {
                $('.despegablesResiduosModi').append('<option value="' + opcion.descripcion + '">' + opcion.descripcion + '</option>');
            });
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

/* Estas tres funciones estan mas abajo, pero estan modificadas para el modal de editar productos  FIN*/



function abrirModificarProducto(e) {
    console.log(this.id);
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


    // Crear arrays para almacenar los valores de los residuos
    var residuosUnidad = [];
    var residuosTipo = [];

    // Obtener todos los campos de residuos dinámicos
    var camposResiduos = document.querySelectorAll('.claseResiduos');

    // Iterar sobre los campos de residuos
    camposResiduos.forEach(function (campo) {
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
        residuosTipo,
    ];

    // Realizar solicitud AJAX para enviar los datos al backend
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/funcionesProductos.php",
        data: { datosProducto: arrayDatosProducto },
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
            $('#modalGestionarProducto').modal('hide');
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
        success: function (data) {
            // Limpiar el contenedor de usuarios
            $('#tablaUsuarios').empty();
            // Iterar sobre los datos de los usuarios y agregarlos al modal
            data.forEach(function (usuario) {
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
                        '<button type="button" class="btn btn-editar-usuario" id="' + usuario.id + '" data-id="' + usuario.id + '">Editar</button>' +
                        '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-cambiar-contrasena ml-2" data-id="' + usuario.id + '">Cambiar Contraseña</button>' +
                        '</td>' +
                        '</tr>';
                }
                // Agregar la fila a la tabla
                $('#tablaUsuarios').append(fila);
            });


            // Agregar evento a los botones "Editar" de los usuarios
            $('.btn-editar-usuario').click(function () {
                var fila = $(this).closest('tr'); // Obtener la fila más cercana al botón de editar
                var idUsuario = $(this).data('id'); // Obtener el ID del usuario
                var nombre = fila.find('td:eq(0)').text(); // Obtener el texto del primer td (columna) de la fila
                var email = fila.find('td:eq(1)').text(); // Obtener el texto del segundo td (columna) de la fila
                var telefono = fila.find('td:eq(2)').text(); // Obtener el texto del tercer td (columna) de la fila
                var admin = fila.find('td:eq(3)').text(); // Obtener el estado de administrador del usuario

                $('#nombreEditar').val(nombre);
                $('#emailEditar').val(email);
                if (admin === 'Sí') {
                    $('#primero').val("Sí");
                    $('#primero').text("Sí");

                    $('#segundo').val("No");
                    $('#segundo').text("No");

                } else {
                    $('#primero').val("No");
                    $('#primero').text("No");

                    $('#segundo').val("Sí");
                    $('#segundo').text("Sí");
                }
                console.log($('#adminEditar').val());
                $('#telefonoEditar').val(telefono);
                $('#guardarCambios').data('idUsuario', idUsuario);
                $('#modalEditar .modal-title').text('Editar Usuario: ' + nombre);
                //SE ABRE MODAL DE EDITAR
                $('#modalEditar').modal('show');

            });

            // Agregar evento a los botones "Cambiar Contraseña" de los usuarios 
            $('.btn-cambiar-contrasena').click(function () {
                var fila = $(this).closest('tr');
                var nombre = fila.find('td:eq(0)').text(); // Obtener el texto del primer td (columna) de la fila
                $('#modalCambiarContrasena .modal-title').text('Cambiar Contraseña de: ' + nombre);
                $('#guardarPass').data('idUsuario', $(this).data('id'));
                $('#modalCambiarContrasena').modal('show');
            });

            $('#guardarCambios').click(function () {
                if ($('#nombreEditar').val().length > 0 && /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test($('#emailEditar').val()) && /^\d{9}$/.test($('#telefonoEditar').val())) {
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

            $('#guardarPass').click(function () {
                if ($('#nuevaContrasena').val() === $('#repetirNuevaContrasena').val()) {
                    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/.test($('#nuevaContrasena').val())) {
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

            $('#guardarUsuario').click(function () {

                if ($('#nombreAgregar').val().length > 0 && /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/.test($('#emailAgregar').val()) && /^\d{9}$/.test($('#telefonoAgregar').val()) && /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/.test($('#passwordAgregar').val())) {
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
        error: function (xhr, status, error) {
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
/* FUNCIONES DE VISUALIZACION */
function name(params) {

}

/*---------------------------PARA LOS RESIDUOS DE AÑADIR-----------------FIN----------------------------------- */




function anadirCategoria(e) {

    let categoriaNueva = document.getElementById("nuevaCategoria").value;
    let observacionesCat = document.getElementById("observacionCategoria").value;
    var datosCategoria = {
        categoriasNueva: categoriaNueva,
        observaciones: observacionesCat
    };

    $.ajax({
        type: "POST",
        url: "../../Controlador/php/anadirCategoria.php",
        data: { anadirCategoria: datosCategoria },
        success: function (response) {
            console.log(response);
            // Actualizar la interfaz de usuario, cerrar el modal
            $('#modalAnadirCategoria').modal('hide');

            cargarDatosProductos();
        },
        error: function (xhr, status, error) {
            console.error(error);
            alert("Hubo un error al procesar la solicitud.");
        }
    });
}


function anadirUnidad(e) {
    let unidadNueva = document.getElementById("nuevaUnidad").value;
    let observacionesUni = document.getElementById("observacionesUnidad").value;
    var datosUnidad = {
        unidadNueva: unidadNueva,
        observaciones: observacionesUni
    };

    $.ajax({
        type: "POST",
        url: "../../Controlador/php/anadirUnidad.php",
        data: { anadirUnidad: datosUnidad },
        success: function (response) {
            console.log(response);
            // Actualizar la interfaz de usuario, cerrar el modal
            $('#modalAnadirUnidad').modal('hide');

            cargarDatosProductos();
        },
        error: function (xhr, status, error) {
            console.error(error);
            alert("Hubo un error al procesar la solicitud.");
        }
    });
}




function manejadorAnadirResiduoAPRoducto(e) {
    let idproducto = $(this).data('producto-id'); // Ahora necesito enviar este dato de id a la consulta de php
    $('#modalanadirResiduoAProducto').modal('show');
    $('#idProductoModal').val(idproducto);
    cargarResiduosModiPro();
}


function manejadorResiduoInsertarBase(e) {
    let productoID = $('#idProductoModal').val(); // Obtener el ID del producto del campo oculto
    let nuevoResiduo = $('#nuevoResiduo').val();
    let cantidad = $('#cantidadResiduo').val();


    if (cantidad > 0) {
        let residuoNuevo = {
            nuevoResiduo: nuevoResiduo,
            idProducto: productoID,
            cantidad: cantidad
        }

        $.ajax({
            type: "POST",
            url: "../../Controlador/php/anadirResiduo.php",
            data: { anadirResiduo: residuoNuevo },
            success: function (response) {
                console.log(response);
            },
            error: function (xhr, status, error) {
                console.error(error);
                alert("Hubo un error al procesar la solicitud.");
            }
        });

        $('#modalanadirResiduoAProducto').modal('hide');
        $('#editarProductoModal').modal('hide');
        $('#modalGestionarProducto').modal('hide');
        $('#modalGestionarProducto').modal('show');
    }
    else {
        console.log("Añadir mensaje de error, que meta cantidad");

    }


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

