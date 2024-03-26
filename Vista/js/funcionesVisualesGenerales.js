//COSAS QUE SE EJECUTARAN EN TODAS LAS PAGINAS
document.addEventListener("DOMContentLoaded", () => {
    /*REVISAR INICIO DE SESION BASE */
    comprobarSesion(function (valor) {
        if (valor == 0) {
            location.href = "../html/index.html";
        } else {
            let docActual = window.location.href;
            let nombreArchivo = docActual.substring(docActual.lastIndexOf("/") + 1);
            if (nombreArchivo != "pedidos.html") {
                document.getElementById("carritoCompras").parentNode.innerHTML = "";
            }
            if (valor.esadmin) {
                document.getElementById("botonDarkMode").addEventListener("click", activarDesactivarModoOscuro);
                // document.querySelector("#desplegableFunciones").appendChild(crearElemento("input", undefined, { "type": "button", "id": "cerrarsesion", "class": "btn btn-danger", "value": "Cerrar Sesión" }));
            } else {
                //location.href = "../html/pedidos.html";
            }
            // mostrarDatosUsuario(valor.nombre, valor.esadmin);
            document.getElementById('botonMenuOpciones').addEventListener("click", function () {
                abrirCerrarMenuOpciones(valor);
            });
        }
    });
    actualizarModoOscuro();
});

function abrirCerrarMenuOpciones(valor) {
    document.getElementById("menuOpciones").classList.toggle("abrirCerrarMenuOpciones");
    let overlay = document.getElementById("overlayGeneral")
    overlay.style.display = "block";
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', function () {
        document.getElementById("menuOpciones").classList.remove("abrirCerrarMenuOpciones");
        overlay.style.display = "none";
        document.body.style.overflow = '';
    });
    if (valor.nombre) {
        crearMenuOpciones(valor.nombre, valor.esadmin);
    }
}

function crearMenuOpciones(nombre, esadmin) {
    document.getElementById("menuOpciones").innerHTML = "";
    menuOpciones = document.getElementById("menuOpciones")
    let cabecera = crearElemento("div", undefined, { id: "menu-cabecera" });
    let botonCerrarMenu = crearElemento("button", undefined, { id: "botonCerrarMenuOpciones", style: "background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" });
    let iconoCerrar = crearElemento("img", undefined, { "src": "../assets/iconoCerrar.svg" });
    botonCerrarMenu.appendChild(iconoCerrar)
    botonCerrarMenu.addEventListener("click", function () {
        let overlay = document.getElementById("overlayGeneral")
        document.getElementById("menuOpciones").classList.remove("abrirCerrarMenuOpciones");
        overlay.style.display = "none";
        document.body.style.overflow = '';
    });
    cabecera.appendChild(crearElemento("h2", "Menu de opciones"))
    cabecera.appendChild(botonCerrarMenu)
    menuOpciones.appendChild(cabecera)
    let opciones = crearOpcionesUsuario(nombre, esadmin);
    opciones.forEach(opcion => {
        menuOpciones.appendChild(opcion);
    });
}

function crearOpcionesUsuario(nombreUsuario, esAdministrador) {
    arrayOpciones = [];
    let docActual = window.location.href;
    let nombreArchivo = docActual.substring(docActual.lastIndexOf("/") + 1);
    if (nombreArchivo == "pedidos.html") {
        if (esAdministrador) {
            arrayOpciones.push(crearOpcionAdministrar(esAdministrador))
        }
        arrayOpciones.push(crearOpcionHistorial(nombreUsuario));
    } else {
        // document..innerHTML="";
        arrayOpciones.push(crearOpcionRegresar());
        document.getElementById("titulo-pagina").innerHTML = "Panel de Administracion"
    }
    arrayOpciones.push(crearOpcionCerrarSesion());
    return arrayOpciones;
}

function crearOpcionCerrarSesion(params) {
    let botonCerrarSesion = crearElemento("input", undefined, {
        type: "button",
        id: "cerrarsesion",
        class: "btn btn-danger",
        value: "Cerrar Sesión",
        style: "width:90%;margin:10px"
    });
    botonCerrarSesion.addEventListener("click", cerrarSesion);
    return botonCerrarSesion;
}
function crearOpcionHistorial(nombreUsuario) {
    let botonHistorial = crearElemento("input", undefined, {
        type: "button",
        id: "historial",
        class: "btn",
        value: "Historial",
        style: "width:90%;margin:10px;border:1px black solid"
    })
    botonHistorial.addEventListener("click", () => {
        recogerHistorial(nombreUsuario);
    })
    return botonHistorial
}
function crearBotonDetalles() {
    let botonDetalles = crearElemento("input", undefined, {
        type: "button",
        id: "detallesHistorial",
        class: "btn",
        value: "Ver Detalles",
        style: "width:90%;margin:10px;border:1px black solid"
    })
    botonDetalles.addEventListener("click", (event) => {
        abrirPopupHistorial();
        recogerLineasPedidos(event.target.parentNode.parentNode.id);
    })
    return botonDetalles;
}
function mostrarHistorialUsuario(pedidos) {
    document.getElementById("informacionProductos").innerHTML = "";
    document.getElementById("informacionProductos").appendChild(crearElemento("button", "Pedir Productos", { id: "botonPedirProductos", class: "btn" }));
    document.getElementById('botonPedirProductos').addEventListener('click', function () {
        location.reload();
    });
    let objeto;
    pedidos.forEach(pedido => {
        objeto = pedido;
    });
    let tablaHistorial = crearElemento('table', undefined, { id: "tablaHistorial" });

    let encabezado = crearElemento('tr');
    for (let key in objeto) {
        if (key != "numeroPedido") {
            let th = crearElemento('th', key);
            encabezado.appendChild(th);
        }
    }
    encabezado.appendChild(crearElemento('th', "Detalles"))
    tablaHistorial.appendChild(encabezado);

    // Crear filas de datos
    pedidos.forEach(pedido => {
        let filaDatos = crearElemento('tr', undefined, { id: pedido.numeroPedido });
        for (let key in pedido) {
            if (key != "numeroPedido") {
                let td = crearElemento('td', pedido[key]);
                filaDatos.appendChild(td);
            }
        }
        let detallesTd = crearElemento('td')
        detallesTd.appendChild(crearBotonDetalles());
        filaDatos.appendChild(detallesTd)
        tablaHistorial.appendChild(filaDatos);
    });
    document.getElementById("informacionProductos").appendChild(tablaHistorial);
    document.getElementById("informacionProductos").appendChild(crearElemento("div", undefined, { id: "contenedorLineaPedido" }))
}
function mostrarLineasPedidos(lineasPedidos) {
    document.getElementById("informacionHistorialProductos").innerHTML = ""
    let lista = crearElemento("div", undefined);
    lineasPedidos.forEach(lineaPedido => {
        let elementoLista = crearElemento("p", lineaPedido.cantidad + " " + lineaPedido.unidad + " de " + lineaPedido.descripcion)
        lista.appendChild(elementoLista)
    });
    document.getElementById("informacionHistorialProductos").appendChild(lista)
}
function crearOpcionAdministrar(admin) {
    let botonAdministrar = crearElemento("input", undefined, {
        type: "button",
        id: "administrar",
        class: "btn",
        value: "Administrar",
        style: "width:90%;margin:10px;"
    });
    botonAdministrar.addEventListener("click", () => {
        location.href = "../html/panelAdmin.html";
    });
    return botonAdministrar;
}
function crearOpcionRegresar() {
    let botonRegresar = crearElemento("input", undefined, {
        type: "button",
        id: "regresar",
        class: "btn btn",
        value: "Regresar",
        style: "width:90%;margin:10px"
    });
    botonRegresar.addEventListener("click", () => {
        location.href = "../html/panelAdmin.html";
    });
    return botonRegresar;
}
function desplegarBotonesUsuario(params) {
    let contenido = document.getElementById("desplegableFunciones")
    contenido.style.display = 'block';
    contenido.addEventListener("mouseleave", cerrarBotonesUsuario)
    this.addEventListener("mouseleave", cerrarBotonesUsuario)
}
function cerrarBotonesUsuario() {
    let contenido = document.getElementById("desplegableFunciones")
    contenido.style.display = 'none';
}
/* FIN DE DESPLEGABLE DE USUARIO */
function activarDesactivarModoOscuro(event) {
    if (localStorage.getItem("darkModeActive") == "off") {
        localStorage.setItem("darkModeActive", "on")
        actualizarModoOscuro();
    } else {
        localStorage.setItem("darkModeActive", "off")
        actualizarModoOscuro();
    }
}
function actualizarModoOscuro() {
    let imagenes = ["../img/iconos/darkModeSun.svg", "../img/iconos/darkModeMoon.png"]
    let botonDarkMode = document.getElementById("botonDarkMode");

    if (document.head.lastChild.href == "../css/estilosDarkMode.css") {
        document.head.lastChild.parentNode.removeChild(document.head.lastChild);
    }
    if (localStorage.getItem("darkModeActive") == "on") {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[1]) : console.log("no existe");
        let hojaEstilos = document.createElement('link');
        hojaEstilos.rel = 'stylesheet';
        hojaEstilos.href = '../css/estilosDarkMode.css'; // Cambia 'estilos.css' por la ruta de tu hoja de estilos
        // Agregar la etiqueta <link> al head del documento
        document.head.appendChild(hojaEstilos);
        // Crear una nueva etiqueta <link> para la hoja de estilos
    } else {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[0]) : console.log("no existe");
        if (document.head.lastChild.href == "../css/estilosDarkMode.css") {
            document.head.lastChild.parentNode.removeChild(document.head.lastChild);
        }
    }
}
function actualizarModoOscuro() {
    let imagenes = ["../img/iconos/darkModeSun.svg", "../img/iconos/darkModeMoon.png"];
    let botonDarkMode = document.getElementById("botonDarkMode");

    // Verificar si ya hay un enlace de estilos presente en el documento
    let enlaceEstilos = document.querySelector('link[href="../css/estilosDarkMode.css"]');

    // Si el modo oscuro está activado y no hay un enlace de estilos, agregarlo
    if (localStorage.getItem("darkModeActive") == "on" && !enlaceEstilos) {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[1]) : console.log("no existe");
        let hojaEstilos = document.createElement('link');
        hojaEstilos.rel = 'stylesheet';
        hojaEstilos.href = '../css/estilosDarkMode.css'; // Cambia 'estilos.css' por la ruta de tu hoja de estilos
        // Agregar la etiqueta <link> al head del documento
        document.head.appendChild(hojaEstilos);
    }
    // Si el modo oscuro está desactivado y hay un enlace de estilos, eliminarlo
    else if (localStorage.getItem("darkModeActive") != "on" && enlaceEstilos) {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[0]) : console.log("no existe");
        enlaceEstilos.parentNode.removeChild(enlaceEstilos);
    }
}
// FUNCION CREAR ELEMENTO
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