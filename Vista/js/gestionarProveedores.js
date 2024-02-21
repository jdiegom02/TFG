document.addEventListener("DOMContentLoaded", principal);

function principal(params) {
    cargarProveedoresDesdePHP(function (proveedores) {
        let padre = document.querySelector("#infoProveedores");
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
                    class: "btn btn-sm btn-primary ml-3" // Agregar clase "ml-3" para separación horizontal
                },
                textoContenido: "Editar"
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
