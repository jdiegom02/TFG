document.addEventListener("DOMContentLoaded", principal);

function principal(params) {
    cargarProveedoresDesdePHP(function (proveedores) {
        let padre = document.querySelector("#infoProveedores");
        padre.innerHTML = "";
        let hijos = proveedores;

        hijos.forEach(hijo => {
            // Crear un elemento div para el row
            let container = crearElemento("div", { atributos: { class: "row mb-3" } }); // Agregar clase "mb-3" para separación vertical

            // Crear un elemento div para la descripción y el botón
            let descripcionYBoton = crearElemento("div", { atributos: { class: "d-flex justify-content-between w-100" } });

            // Crear el elemento p para la descripción
            let subContainer = crearElemento("p", { textoContenido: hijo.descripcion });

            let subContainer2 = crearElemento("p", { textoContenido: hijo.direccion });

            // Crear el botón "Editar" utilizando la función crearElemento
            let botonEditar = crearElemento("button", {
                atributos: {
                    type: "button",
                    class: "btn btn-sm btn-primary ml-3 botonEditar", // Agregar clase "ml-3" para separación horizontal
                    "data-toggle": "modal",
                    "data-target": "#editarProveedorModal"
                },
                textoContenido: "Editar"
            });
            botonEditar.addEventListener("click", function (params) {
                editar(hijo);
            });
            // Agregar la descripción, dirección y el botón al div de descripción y botón
            descripcionYBoton.appendChild(subContainer);
            descripcionYBoton.appendChild(subContainer2);
            descripcionYBoton.appendChild(botonEditar);

            // Agregar el div de descripción y botón al contenedor (al final)
            container.appendChild(descripcionYBoton);

            // Agregar el contenedor al padre
            padre.appendChild(container);
        });

    });
    document.querySelector("#confirmarAccion").addEventListener("click", function () {
        let descripcion = document.querySelector("#addDescripcion").value;
        let direccion = document.querySelector("#addDireccion").value;
        let email = document.querySelector("#addEmail").value;
        let telefono = document.querySelector("#addTelefono").value;
        let observaciones = document.querySelector("#addObservaciones").value;
        if (descripcion.trim() !== "" && /^\d{9}$/.test(telefono) && direccion.trim() !== "" && email.trim() !== "" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(direccion)) {
            let datos = [descripcion, direccion, email, telefono, observaciones];
            addProveedor(datos);
        }
    });
    
}

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
        if (nombre.trim() !== "" && /^\d{9}$/.test(telefono) && direccion.trim() !== "" && email.trim() !== "" && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(direccion)) {
            console.log(datos);
            actualizarProveedor(datos);
        }
    }
    

    // Agrega el evento al botón de guardar cambios solo una vez
    document.querySelector("#confirmarAccion").addEventListener("click", guardarCambios);

    // Agrega el evento al botón de cancelar para quitar el evento del botón de guardar cambios
    document.querySelector("#cerrarModal").addEventListener("click", function () {
        document.querySelector("#cambioProveedor").removeEventListener("click", guardarCambios);
    });
}


function crearElemento(tagNombre, opciones) {
    let elemento = document.createElement(tagNombre);
    if (opciones && opciones.atributos && typeof opciones.atributos === "object") {
        for (let clave in opciones.atributos) {
            elemento.setAttribute(clave, opciones.atributos[clave]);
        }
    }

    if (opciones && opciones.textoContenido) {
        elemento.textContent = opciones.textoContenido;
    }

    return elemento;
}
