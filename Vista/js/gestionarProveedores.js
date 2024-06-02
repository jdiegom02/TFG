document.addEventListener("DOMContentLoaded", principal);

//Al cargar la pagina, carga los proveedores en una tabla con botones para realizar accioens
function principal(params) {

    actualizarModoOscuro();

    cargarProveedoresDesdePHP(function (proveedores) {
        let tabla = document.createElement("table");
        tabla.classList.add("table");
        // tabla.classList.add("table-responsive");
        let encabezado = tabla.createTHead();
        let filaEncabezado = encabezado.insertRow();
        let thDescripcion = document.createElement("th");
        thDescripcion.textContent = "Descripción";
        let thDireccion = document.createElement("th");
        thDireccion.textContent = "Dirección";
        let thEditar = document.createElement("th");
        thEditar.textContent = "Editar";
        filaEncabezado.appendChild(thDescripcion);
        filaEncabezado.appendChild(thDireccion);
        filaEncabezado.appendChild(thEditar);

        let cuerpoTabla = tabla.createTBody();

        proveedores.forEach(proveedor => {
            let fila = cuerpoTabla.insertRow();
            let descripcionCell = fila.insertCell();
            descripcionCell.textContent = proveedor.descripcion;

            let direccionCell = fila.insertCell();
            direccionCell.textContent = proveedor.direccion;

            let editarCell = fila.insertCell();
            let botonEditar = document.createElement("button");
            botonEditar.type = "button";
            botonEditar.classList.add("btn", "btn-sm", "ml-3", "botonEditar", "botonNegro");
            botonEditar.textContent = "Editar";
            botonEditar.setAttribute("data-toggle", "modal");
            botonEditar.setAttribute("data-target", "#editarProveedorModal");
            botonEditar.addEventListener("click", function () {
                editar(proveedor);
            });

            editarCell.appendChild(botonEditar);
        });

        let padre = document.querySelector("#infoProveedores");
        padre.innerHTML = "";
        padre.appendChild(tabla);
    });
    document.querySelector("#confirmarAccion").addEventListener("click", function () {

        let descripcion = document.querySelector("#addDescripcion").value;
        let direccion = document.querySelector("#addDireccion").value;
        let email = document.querySelector("#addEmail").value;
        let telefono = document.querySelector("#addTelefono").value;
        let observaciones = document.querySelector("#addObservaciones").value;

        if (descripcion.trim() !== "" && /^\d{9}$/.test(telefono) && direccion.trim() !== "" && email.trim() !== "" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            let datos = [descripcion, direccion, email, telefono, observaciones];
            console.log(datos);
            addProveedor(datos);
        }
        else { console.log("no entro"); }
    });

}

//Esto edita un proveedor con los datos que tenga en el formulario
function editar(hijo) {
    let nombre = hijo.descripcion;
    let direccion = hijo.direccion;
    let email = hijo.email;
    let telefono = hijo.telefono;
    let observaciones = hijo.observaciones;

    document.querySelector("#descripcion").value = nombre;
    document.querySelector("#direccion").value = direccion;
    document.querySelector("#email").value = email;
    document.querySelector("#telefono").value = telefono;
    document.querySelector("#observaciones").value = observaciones;

    function guardarCambios() {
        let id = hijo.id;
        let nombre = document.querySelector("#descripcion").value || "";
        let direccion = document.querySelector("#direccion").value || "";
        let email = document.querySelector("#email").value || "";
        let telefono = document.querySelector("#telefono").value || "";
        let observaciones = document.querySelector("#observaciones").value || "";
        let datos = [id, nombre, direccion, email, telefono, observaciones];
        if (nombre.trim() !== "" && /^\d{9}$/.test(telefono) && direccion.trim() !== "" && email.trim() !== "" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            console.log(datos);
            actualizarProveedor(datos);
        }
    }

    document.querySelector("#confirmarAccion").addEventListener("click", guardarCambios);
    document.querySelector("#cerrarModal").addEventListener("click", function () {
        document.querySelector("#cambioProveedor").removeEventListener("click", guardarCambios);
    });
}

//Funcion crear Elemento
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
