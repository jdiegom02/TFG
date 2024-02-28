//COSAS QUE SE EJECUTARAN EN TODAS LAS PAGINAS
document.addEventListener("DOMContentLoaded", () => {
    /*REVISAR INICIO DE SESION BASE */

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
                mostrarDatosUsuario(usuarioIniciado)
            } else {
                location.href = "../html/pedidos.html";
            }
        }
    });
    actualizarModoOscuro();
});
/* DESPLEGABLE DE USUARIO */
function mostrarDatosUsuario(valor) {
    document.getElementById("usuarioNombre").innerHTML = valor;
    document.querySelector("#desplegableFunciones").innerHTML = ""
    // document.getElementById("usuariopedido").textContent = "Pedido de " + valor.nombre;
    let docActual = window.location.href;

    // Obtener el nombre del archivo de la URL
    let nombreArchivo = docActual.substring(docActual.lastIndexOf("/") + 1);
    document.querySelector("#desplegableFunciones").innerHTML="";
    if (nombreArchivo == "pedidos.html") {
        crearBotonAdministrar()
    } else {
        crearBotonRegresar();
    }
    let botonCerrarSesion = crearElemento("input", undefined, {
        type: "button",
        id: "cerrarsesion",
        class: "btn btn-danger",
        value: "Cerrar Sesión",
        style: "width:90%;margin:10px"
    });
    botonCerrarSesion.addEventListener("click", cerrarSesion);
    document.querySelector("#desplegableFunciones").appendChild(botonCerrarSesion);
}
function crearBotonAdministrar() {
    let botonAdministrar = crearElemento("input", undefined, {
        type: "button",
        id: "administrar",
        class: "btn",
        value: "Administrar",
        style: "width:90%;margin:10px"
    });
    botonAdministrar.addEventListener("click", () => {
        location.href = "../html/panelAdmin.html";
    });
    document.querySelector("#desplegableFunciones").appendChild(botonAdministrar);
}
function crearBotonRegresar() {
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
    document.querySelector("#desplegableFunciones").appendChild(botonRegresar);

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
function crearBarraDeNavegación() {
    console.log("crear barra")
    //barra de navegacion para todas las paginas del admin
    document.body.innerHTML += '<div class="darkMode-container col-sm-6"><button class="darkMode-button" id="botonDarkMode"><img src="../img/iconos/darkModeSun.svg" alt=""></button></div>'
}
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
    console.log("esta:")
    console.log(localStorage.getItem("darkModeActive"));
    let imagenes = ["../img/iconos/darkModeSun.svg", "../img/iconos/darkModeMoon.png"]
    let botonDarkMode = document.getElementById("botonDarkMode");
    console.log(document.head.lastChild)

    if (document.head.lastChild.href == "../css/estilosDarkMode.css") {
        console.log(document.head.lastChild)
        console.log("encontrado ultima pos")
        document.head.lastChild.parentNode.removeChild(document.head.lastChild);
        console.log("removido");
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
            console.log("removido");
        }
    }
}
function actualizarModoOscuro() {
    console.log("esta:")
    console.log(localStorage.getItem("darkModeActive"));
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