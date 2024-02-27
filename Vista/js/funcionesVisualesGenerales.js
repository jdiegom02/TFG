//COSAS QUE SE EJECUTARAN EN TODAS LAS PAGINAS
document.addEventListener("DOMContentLoaded", () => {
    actualizarModoOscuro();
});
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

    if (document.head.lastChild.href == "../css/estilosgenerales.css") {
        console.log(document.head.lastChild)
        console.log("encontrado ultima pos")
        document.head.lastChild.parentNode.removeChild(document.head.lastChild);
        console.log("removido");
    }
    if (localStorage.getItem("darkModeActive") == "on") {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[1]) : console.log("no existe");
        let hojaEstilos = document.createElement('link');
        hojaEstilos.rel = 'stylesheet';
        hojaEstilos.href = '../css/estilosgenerales.css'; // Cambia 'estilos.css' por la ruta de tu hoja de estilos
        // Agregar la etiqueta <link> al head del documento
        document.head.appendChild(hojaEstilos);
        // Crear una nueva etiqueta <link> para la hoja de estilos
    } else {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[0]) : console.log("no existe");
        if (document.head.lastChild.href == "../css/estilosgenerales.css") {
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
    let enlaceEstilos = document.querySelector('link[href="../css/estilosgenerales.css"]');

    // Si el modo oscuro está activado y no hay un enlace de estilos, agregarlo
    if (localStorage.getItem("darkModeActive") == "on" && !enlaceEstilos) {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[1]) : console.log("no existe");
        let hojaEstilos = document.createElement('link');
        hojaEstilos.rel = 'stylesheet';
        hojaEstilos.href = '../css/estilosgenerales.css'; // Cambia 'estilos.css' por la ruta de tu hoja de estilos
        // Agregar la etiqueta <link> al head del documento
        document.head.appendChild(hojaEstilos);
    }
    // Si el modo oscuro está desactivado y hay un enlace de estilos, eliminarlo
    else if (localStorage.getItem("darkModeActive") != "on" && enlaceEstilos) {
        botonDarkMode ? botonDarkMode.children[0].setAttribute("src", imagenes[0]) : console.log("no existe");
        enlaceEstilos.parentNode.removeChild(enlaceEstilos);
    }
}
