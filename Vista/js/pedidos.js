var pedido = [];
addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  document.getElementById("buscar").addEventListener("click", mostrarProductos)
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});

function mostrarProductos() {
  recogerProductos(function (productos) {
    let tabla = document.querySelector("#productTable");
    let div = tabla.parentElement.parentElement.children[1];
    tabla.innerHTML = "";
    div.innerHTML = ""
    let resultadosFiltrados
    let i = 1;
    if (document.getElementById("searchInput".replaceAll(/\s+/g, "" === ""))) {
      resultadosFiltrados = productos.filter(producto =>
        producto.getNombre().toLowerCase().includes(document.getElementById("searchInput").value.replaceAll(/\s+/g, "").toLowerCase())
      );
    }
    if (resultadosFiltrados.length != 0) {
      resultadosFiltrados.forEach(productofiltrado => {
        let fila = crearElemento("tr", undefined, { id: "producto" + i });
        fila.appendChild(crearElemento("td", productofiltrado.getNombre()));
        fila.appendChild(crearElemento("td", productofiltrado.getUnidades()));
        let img = crearElemento("img", undefined, { src: "../assets/botonMas.svg" })
        let divBotones = crearElemento("div", undefined, { id: "divBotones", class: "container-fluid" })
        let botonMas = crearElemento("button", undefined, { id: "botonMas", class: "btn botones", "data-bs-toggle": "modal", "data-bs-target": "#pedidoModal", nombre: productofiltrado.getNombre(), unidad: productofiltrado.getUnidades(), identificador: productofiltrado.getId() });
        let td = crearElemento("td");
        botonMas.addEventListener("click", añadirProducto)
        botonMas.appendChild(img)
        divBotones.appendChild(botonMas);
        td.appendChild(divBotones)
        fila.appendChild(td);
        tabla.appendChild(fila);
        i++;
      })
    } else {
      div.appendChild(crearElemento("div", undefined, {}))
      div.appendChild(crearElemento("h2", "No se encontraron elementos con ese nombre", { style: "color:red" }))
      div.appendChild(crearElemento("div", undefined, { id: "mensajeTablaVacia" }))
      div.appendChild(crearElemento("h5", "Si desea hacer el pedido de este producto igualmente click aqui ->", { style: "color:red" }))
      let img = crearElemento("img", undefined, { src: "../assets/botonMas.svg" })
      let botonMas = crearElemento("button", undefined, { id: "botonMas", class: "btn botones", "data-bs-toggle": "modal", "data-bs-target": "#pedidoModal", nombre: document.getElementById("searchInput").value, unidad: "nodefinida", identificador: "nodefinida" });
      botonMas.addEventListener("click", añadirProducto)
      botonMas.appendChild(img);
      div.appendChild(botonMas);
    }
  });
}
function añadirProducto(event) {
  let id = this.id;
  let identificador = this.getAttribute("identificador");
  let nombre = this.getAttribute("nombre");
  let unidad = this.getAttribute("unidad");
  let modal = document.getElementById("pedidoModalContent");
  let modalHeader = modal.children[0]
  let modalBody = modal.children[1];
  let modalFooter = modal.children[2];
  modalHeader.innerHTML = "";
  modalHeader.appendChild(crearElemento("h5", "Pedir " + nombre))
  let divInputGroup;
  if (unidad == "nodefinida") {
    divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
    divInputGroup.appendChild(crearElemento('span', "Cantidad: ", { class: 'input-group-text' }));
    divInputGroup.appendChild(crearElemento('input', undefined, { type: "number", min: "1", id: "cantidadPedido", class: 'form-control' }));
    divInputGroup.appendChild(crearElemento('span', "Unidad: ", { class: 'input-group-text' }));
    divInputGroup.appendChild(crearElemento('input', undefined, { id: "unidadPedido", type: "text", class: 'form-control', placeholder: "Ingrese la unidad" }));
  } else {
    divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
    divInputGroup.appendChild(crearElemento('span', "Cantidad: ", { class: 'input-group-text' }));
    divInputGroup.appendChild(crearElemento('input', undefined, { type: "number", min: "1", id: "cantidadPedido", class: 'form-control' }));
    divInputGroup.appendChild(crearElemento('span', unidad, { class: 'input-group-text' }));
  }
  modalBody.innerHTML = ""
  modalBody.appendChild(divInputGroup)
  let divComentario = crearElemento('div', undefined, { class: 'form-floating' });
  divComentario.appendChild(crearElemento('label', 'Comentario', { for: 'comentarioPedido' }));
  divComentario.appendChild(crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px', resize: 'none' }));
  modalBody.appendChild(divComentario);
  modalFooter.innerHTML = ""
  modalFooter.appendChild(crearElemento("button", "Cancelar", { id: "cerrarPedido", class: "btn btn-danger", type: "button", "data-bs-dismiss": "modal" }))
  modalFooter.appendChild(crearElemento("button", "Pedir", { id: "añadirPedido", class: "btn btn-primary", type: "button", identificador: identificador, nombre: nombre, unidad: unidad }))
  document.getElementById('añadirPedido').addEventListener("click", añadirCarrito);
}
function añadirCarrito(event) {
  if (this.getAttribute("unidad") == null) {
    let unidad = document.getElementById("unidadPedido").value;
    pedido.push([this.getAttribute("nombre"), unidad, document.getElementById("cantidadPedido").value, document.getElementById('comentarioPedido').value]);
  } else {
    pedido.push([this.getAttribute("nombre"), this.getAttribute("unidad"), document.getElementById("cantidadPedido").value, document.getElementById('comentarioPedido').value]);
    let fila = document.getElementById("producto" + this.getAttribute("identificador"));
    let divBotones = fila.querySelector("#divBotones")
    let botonCheck = crearElemento("button", undefined, { id: "botonCheck", class: "btn botones", identificador: pedido.length});
    botonCheck.appendChild(crearElemento("img", undefined, { src: "../assets/botonCheck.svg" }))
    divBotones.appendChild(botonCheck)
  }
  document.getElementById("cerrarPedido").click();
}
function modalCarritoCrearTabla(event) {
  const theads = ["Producto", "Unidad", "Cantidad", "Comentario", "Quitar Del Carrito"];
  let modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = "";
  if (pedido.length != 0) {
    let tablaCarrito = crearElemento("table", undefined, { id: "tablaCarrito", class: "table " })
    let thead = crearElemento("thead", undefined, { id: "theadCarrito", class: "thead-light" })
    let tbody = crearElemento("tbody", undefined, { id: "tbodyCarrito" })
    for (let i = 0; i < theads.length; i++) {
      thead.appendChild(crearElemento("th", theads[i]));
    }
    for (let i = 0; i < pedido.length; i++) {
      let filaPedido = crearElemento("tr", undefined, { id: "filaPedido" + (i + 1), identificador: i });
      filaPedido.appendChild(crearElemento("td", pedido[i][0]));
      filaPedido.appendChild(crearElemento("td", pedido[i][1]));
      filaPedido.appendChild(crearElemento("td", pedido[i][2]));
      filaPedido.appendChild(crearElemento("td", pedido[i][3]));
      let botonBorrar = crearElemento("button", "Remover", { id: i + 1, type: "button", class: "btn btn-danger", value: "Remover", style: "margin:auto; width:80%; height:100%;" })
      botonBorrar.addEventListener("click", borrarFilaPedido);
      let tdBorrar = crearElemento("td", undefined);
      tdBorrar.appendChild(botonBorrar)
      filaPedido.appendChild(tdBorrar);
      tbody.appendChild(filaPedido);
    }
    tablaCarrito.appendChild(thead);
    tablaCarrito.appendChild(tbody);
    modalBody.appendChild(tablaCarrito)
  } else {
    modalBody.appendChild(crearElemento("h4", "El carrito se encuentra vacío por ahora...", { style: "color:red; font-style:italic;" }));
  }
}
function borrarFilaPedido(event) {
  pedido.splice(this.id - 1, 1);
  modalCarritoCrearTabla();
}
function pedirTodo(event) {
  if (pedido.length == 0) {
  } else {
    insertarEnSolicitudes(pedido);
  }
}
//-------HERRAMIENTAS-------
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