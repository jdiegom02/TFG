window.addEventListener("load", principal, false);
let usuarioIniciado;
let contador = 0;
let cargarBoton = false;
function principal() {
    // comprobarSesion(function (valor) {
    //     // crearBarraDeNavegación();
    //     if (valor == 0) {
    //         location.href = "../html/index.html";
    //     } else {
    //         if (valor.esadmin) {
    //             document.getElementById("botonDarkMode").addEventListener("click", activarDesactivarModoOscuro);
    //             usuarioIniciado = valor.nombre;
    //             // document.querySelector("#desplegableFunciones").appendChild(crearElemento("input", undefined, { "type": "button", "id": "cerrarsesion", "class": "btn btn-danger", "value": "Cerrar Sesión" }));
    //         } else {
    //             //location.href = "../html/pedidos.html";
    //         }
    //         // mostrarDatosUsuario(valor.nombre, valor.esadmin)
    //         document.getElementById('botonMenuOpciones').addEventListener("click", function () {
    //             abrirCerrarMenuOpciones(valor);
    //         });
    //     }
    // });
    actualizarModoOscuro();
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
function enfocarModalPorId(idModal) {
    // Mostrar el modal con el ID especificado
    $('#' + idModal).modal('show');

    // Enfocar el modal
    $('#' + idModal).focus();
}
function setScrollOnTopModal() {
    // Obtener todos los modals que están visibles
    var $visibleModals = $('.modal.show');

    // Si hay al menos un modal visible
    if ($visibleModals.length > 0) {
        // Obtener el modal que está más arriba en la pila
        var $topModal = $visibleModals.last();

        // Asegurarse de que el body no tiene scroll
        $('body').addClass('modal-open');

        // Deshabilitar el scroll en todos los modals visibles
        $visibleModals.css('overflow', 'hidden');

        // Habilitar el scroll en el modal superior
        $topModal.css('overflow', 'auto');
    } else {
        // Si no hay modals visibles, permitir el scroll en el body
        $('body').removeClass('modal-open');
    }
}

// Llamar a la función cuando un modal se muestra
$('.modal').on('shown.bs.modal', function () {
    setScrollOnTopModal();
});

// Llamar a la función cuando un modal se oculta
$('.modal').on('hidden.bs.modal', function () {
    setScrollOnTopModal();
});

function agregarNuevoCampoResiduo(numero) {

    // Crear el nuevo campo de entrada de residuos
    var nuevoCampoResiduo = crearElemento('div', undefined, { 'class': 'input-group' });

    var inputResiduo = crearElemento('input', undefined, { 'type': 'number', 'class': 'form-control input-sm claseResiduos', 'id': 'residuos' + numero, 'placeholder': 'Residuos  ' + (numero + 1), 'style': 'max-width: 100px;', 'min': '0' });

    var labelKilos = crearElemento('label', 'Kg', { 'for': 'kilos' });

    var selectDespegable = crearElemento('select', undefined, { 'class': 'form-control despegablesResiduos', 'id': 'despegableResiduos' + numero });

    nuevoCampoResiduo.appendChild(inputResiduo);
    nuevoCampoResiduo.appendChild(labelKilos);
    nuevoCampoResiduo.appendChild(selectDespegable);

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
            renderProductos(data);
            initializeEditButtonHandler(data);
        },
        error: function (xhr, status, error) {
            console.error(error);
        }
    });
}

function renderProductos(data) {
    $('.producto').empty();

    $.each(data, function (index, producto) {
        let productoHTML = createProductoHTML(producto);
        $('#gestionPRO').append(productoHTML);
    });
}

function createProductoHTML(producto) {
    let categoriasHTML = createListHTML(producto.categorias);
    let residuosHTML = createListHTML(producto.residuos);

    return `
        <div class="filaProducto" id="${producto.producto_id}" style="border: 1px solid black;">
            <div><span>${producto.nombre_producto}</span></div>
            <div><ul>${categoriasHTML}</ul></div>
            <div><span>${producto.unidad}</span></div>
            <div><ul>${residuosHTML}</ul></div>
            <div><button type="button" id="${producto.producto_id}" class="btn btnEditar" data-producto-id="${producto.producto_id}">Editar</button></div>
        </div>
    `;
}

function createListHTML(items) {
    return items.map(item => `<li>${item}</li>`).join('');
}

function initializeEditButtonHandler(data) {
    $(document).on('click', '.btnEditar', function () {
        let productoID = $(this).data('producto-id');
        let producto = data.find(prod => prod.producto_id == productoID);
        
        if (producto) {
            openEditModal(producto);
        } else {
            console.error("Producto no encontrado");
        }
    });
}


function openEditModal(producto) {
    $('#productoIDModificar').val(producto.producto_id);
    $('#nombreProductoModificar').val(producto.nombre_producto);
    $('#unidadProductoModificar').val(producto.unidad);
    $('#tablaResiduos tbody').empty();
    $('#categoriaProductoModificar').empty();

    producto.categorias.forEach((categoria, index) => {
        let nuevoDivSelect = $('<div class="form-group"></div>');
        let nuevoCategoriaDropdown = `
            <select class="form-control categoriaProductoModi" id="categoria_${producto.producto_id}_${index}">
                <option value="${categoria}">${categoria}</option>
            </select>
        `;
        nuevoDivSelect.append(nuevoCategoriaDropdown);
        $('#categoriaProductoModificar').append(nuevoDivSelect);
    });

    cargarOpcionesCategoriaModiPro(producto.categorias);
    $('#editarProductoModal').modal('show');
    cargarResiduosModiPro();
    updateAddResiduoButton(producto.producto_id);
}

function updateAddResiduoButton(productoID) {
    let addButton = $('#anadirResiduoAUnProducto');

    if (addButton.length === 0) {
        addButton = $('<button>', {
            type: "button",
            class: "btn btn-secondary",
            id: "anadirResiduoAUnProducto",
            text: "Añadir residuo"
        });
        $('#formularioEditarProducto').append(addButton);
        addButton.on("click", manejadorAnadirResiduoAPRoducto);
    }
    
    addButton.data("producto-id", productoID);
}


//fin refactorizacion de cargar productos original
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
            console.log(response);

            if (response === "1") {
                $('#noSePuedeModificar').modal('show');
                setTimeout(function () {
                    $('#noSePuedeModificar').modal('hide');
                }, 2500);
            } else { console.log("si"); }

            $('#editarProductoModal').modal('hide');
            $('body').addClass('modal-open');
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

            setTimeout(function () {
                //Recargar la pagina para actucalizar los productos
                location.reload();
            }, 1900);

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

    // Eliminar el efecto de difuminado después de 2 segundos
    setTimeout(function () {
        contenedorPrincipal.style.filter = 'none';
    }, 2000);

    // Eliminar el mensaje después de 2 segundos
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

/* --------------- PARA CARGAR LAS OPCIONES DE LA CATEGORIA Y UNIDADES DE MEDIDA EN EL MODAL-------FIN--------- */


/*-------------------------Para MODAL GESTIONAR USUARIOS--------------------- */



function cargarUsuarios() {
    $.ajax({
        type: "POST",
        url: "../../Controlador/php/usuarios.php",
        dataType: "json",
        success: function (data) {
            $('#tablaUsuarios').empty();
            data.forEach(function (usuario) {
                const fila = crearFilaUsuario(usuario);
                $('#tablaUsuarios').append(fila);
            });

            agregarEventosBotones();
        },
        error: function (xhr, status, error) {
            console.error(error);
            $('#tablaUsuarios').html('<tr><td colspan="6">Error al cargar usuarios</td></tr>');
        }
    });
}

function crearFilaUsuario(usuario) {
    const { id, nombre, email, telefono, esAdmin, activo } = usuario;
    const esUsuarioAdmin = esAdmin === "Sí" && nombre === usuarioIniciado;
    const botones = esUsuarioAdmin ? '' :
        `<td>
            <button type="button" class="btn btn-editar-usuario botonNegro" data-id="${id}">Editar</button>
        </td>
        <td>
            <button type="button" class="btn btn-cambiar-contrasena botonNegro ml-2" data-id="${id}">Cambiar Contraseña</button>
        </td>`;
    return `<tr>
        <td>${nombre}</td>
        <td>${email}</td>
        <td>${telefono}</td>
        <td>${esAdmin}</td>
        <td>${activo}</td>
        ${botones}
    </tr>`;
}

function agregarEventosBotones() {
    $('.btn-editar-usuario').click(function () {
        const fila = $(this).closest('tr');
        const idUsuario = $(this).data('id');
        const nombre = fila.find('td:eq(0)').text();
        const email = fila.find('td:eq(1)').text();
        const telefono = fila.find('td:eq(2)').text();
        const admin = fila.find('td:eq(3)').text();

        $('#nombreEditar').val(nombre);
        $('#emailEditar').val(email);
        $('#telefonoEditar').val(telefono);
        actualizarAdminSelect(admin);
        $('#guardarCambios').data('idUsuario', idUsuario);
        $('#modalEditar .modal-title').text('Editar Usuario: ' + nombre);
        $('#modalEditar').modal('show');
    });

    $('.btn-cambiar-contrasena').click(function () {
        const fila = $(this).closest('tr');
        const nombre = fila.find('td:eq(0)').text();
        $('#modalCambiarContrasena .modal-title').text('Cambiar Contraseña de: ' + nombre);
        $('#guardarPass').data('idUsuario', $(this).data('id'));
        $('#modalCambiarContrasena').modal('show');
    });

    $('#guardarCambios').click(guardarCambiosUsuario);
    $('#guardarPass').click(cambiarContrasenaUsuario);
    $('#guardarUsuario').click(guardarNuevoUsuario);
}

function actualizarAdminSelect(admin) {
    const opciones = admin === 'Sí' ? ['Sí', 'No'] : ['No', 'Sí'];
    $('#primero').val(opciones[0]).text(opciones[0]);
    $('#segundo').val(opciones[1]).text(opciones[1]);
}

function guardarCambiosUsuario() {
    const nombre = $('#nombreEditar').val();
    const email = $('#emailEditar').val();
    const telefono = $('#telefonoEditar').val();
    if (nombre.length > 0 && validarEmail(email) && validarTelefono(telefono)) {
        $.ajax({
            type: "POST",
            url: "../../Controlador/php/gestionarUsuarios.php",
            data: {
                id: $(this).data('idUsuario'),
                nombre: nombre,
                email: email,
                telefono: telefono,
                admin: $('#adminEditar').val(),
                activo: $('#activoEditar').val()
            },
        }).done(function () {
            $('#modalEditar').modal('hide');
            cargarUsuarios();
        });
    }
}

function cambiarContrasenaUsuario() {
    const nuevaContrasena = $('#nuevaContrasena').val();
    const repetirNuevaContrasena = $('#repetirNuevaContrasena').val();
    if (nuevaContrasena === repetirNuevaContrasena && validarContrasena(nuevaContrasena)) {
        $.ajax({
            type: "POST",
            url: "../../Controlador/php/gestionarUsuarios.php",
            data: {
                id: $(this).data('idUsuario'),
                password: nuevaContrasena
            },
        }).done(function () {
            $('#modalCambiarContrasena').modal('hide');
        });
    } else {
        console.log("Las contraseñas no coinciden o la seguridad es insuficiente");
    }
}

function guardarNuevoUsuario() {
    const nombre = $('#nombreAgregar').val();
    const email = $('#emailAgregar').val();
    const telefono = $('#telefonoAgregar').val();
    const password = $('#passwordAgregar').val();
    if (nombre.length > 0 && validarEmail(email) && validarTelefono(telefono) && validarContrasena(password)) {
        $.ajax({
            type: "POST",
            url: "../../Controlador/php/gestionarUsuarios.php",
            data: {
                nombreA: nombre,
                emailA: email,
                telefonoA: telefono,
                adminA: $('#adminAgregar').val(),
                activoA: $('#activoAgregar').val(),
                passwordA: password
            },
        }).done(function () {
            $('#modalAgregarUsuario').modal('hide');
            cargarUsuarios();
        });
    } else {
        console.log("fallo en la validación");
    }
}

function validarEmail(email) {
    const emailRegex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
    return emailRegex.test(email);
}

function validarTelefono(telefono) {
    const telefonoRegex = /^\d{9}$/;
    return telefonoRegex.test(telefono);
}

function validarContrasena(contrasena) {
    const contrasenaRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;
    return contrasenaRegex.test(contrasena);
}

/**Fin de refactorizacion cargar Usuarios */



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




function manejadorAnadirResiduoAPRoducto(event) {
    let idproducto = $(event.target).data('producto-id');
    console.log(idproducto);
    $('#modalanadirResiduoAProducto').modal('show');
    $('#idProductoModal').val(idproducto);
    cargarResiduosModiPro();
}



function manejadorResiduoInsertarBase(e) {
    let productoID = $('#idProductoModal').val();
    var nuevoResiduo = $('#nuevoResiduo').val();
    var cantidad = $('#cantidadResiduo').val();

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

