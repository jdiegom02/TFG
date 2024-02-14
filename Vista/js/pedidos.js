var pedido = [];
addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  document.getElementById("buscar").addEventListener("click", mostrarProductos)
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});
//FUNCION QUE FUNCIONA BIEN CON TABLA
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
//FUNCION QUE FUNCIONA CON CARTAS 
function mostrarProductos() {
  recogerProductos(function (productos) {
    let tabla = document.querySelector("#productTable");
    let div = tabla.parentElement.parentElement.children[1];
    tabla.innerHTML = "";
    div.innerHTML = ""
    let resultadosFiltrados
    let i = 1;
    productos.forEach(producto => {
      let columna = crearElemento("div", undefined, { "class": "col-md-3" });
      document.querySelector("#productos").appendChild(columna);
      let card = crearElemento("div", undefined, { "class": "card" });
      columna.appendChild(card);
      card.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
      card.appendChild(crearElemento("h6", producto.getNombre(), { "class": "card-title" }));
      card.appendChild(crearElemento("input", undefined, { "class": "btn", "value": "Añadir al carro" }))
    })
  });
}
//FUNCION FINAL DE mostrarProductos
function mostrarProductos(params) {
  /**
   * CREAR ELEMENTOS DENTRO DEL DIV mostrarProductos que contengan esto:
   * let columna = crearElemento("div", undefined, { "class": "col-md-3" }
   * añadimos con appendChild a 
   * let card = crearElemento("div", undefined, { "class": "card" });
   * 
   */

  recogerProductos(function (productos) {
    let divProductos = document.querySelector("#productos");
    divProductos.innerHTML = "";
    let resultadosFiltrados
    let i = 1;
    //filtrar productos devuelve el array filtado pasandole el array;
    resultadosFiltrados = filtrarProductos(productos);
    if (resultadosFiltrados.length != 0) {
      resultadosFiltrados.forEach(productofiltrado => {
        let contenedorCarta = crearElemento("div", undefined, { "class": "col-md-3" });
        let carta = crearElemento("div", undefined, { "class": "card grid-item", id: "producto" + i });
        carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
        carta.appendChild(crearElemento("h6", productofiltrado.getNombre(), { "class": "card-title" }));
        let botonMas = crearElemento("button", undefined, { "class": "btn", "value": "Añadir al carro", id: "botonMas", nombre: productofiltrado.getNombre(), unidad: productofiltrado.getUnidades(), identificador: productofiltrado.getId() })
        botonMas.addEventListener("click", añadirProducto)
        carta.appendChild(botonMas);
        contenedorCarta.appendChild(carta);
        divProductos.appendChild(contenedorCarta);
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
    let botonCheck = crearElemento("button", undefined, { id: "botonCheck", class: "btn botones", identificador: pedido.length });
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
function filtrarProductos(array) {
  let resultadosFiltrados
  if (document.getElementById("searchInput".replaceAll(/\s+/g, "" === ""))) {
    resultadosFiltrados = array.filter(producto =>
      producto.getNombre().toLowerCase().includes(document.getElementById("searchInput").value.replaceAll(/\s+/g, "").toLowerCase())
    );
  }
  return resultadosFiltrados;
}
function añadirCarrito(event) {
  let lineaPedido = [];
  filaProducto = document.getElementById("producto" + event.target.parentElement.parentElement.children[0].children[0].children[0].id);
  let celdas = filaProducto.getElementsByTagName("td");
  let descripcion = celdas[0].innerHTML;
  let unidades = celdas[1].innerHTML;
  let cantidad = document.getElementById('cantidadPedido').value;
  let observaciones = document.getElementById('comentarioPedido').value;
  lineaPedido.push(descripcion, unidades, cantidad, observaciones)
  pedido.push(lineaPedido)
  document.getElementById('cerrarPedido').click();
}
function crearTabla(titulos, datos) {
  let tabla = crearElemento('table');
  let thead = crearElemento('thead');
  let trTitulos = crearElemento('tr');
  for (let i = 0; i < titulos.length; i++) {
    let th = crearElemento('th', titulos[i]);
    th.id = 'titulo_' + i;
    trTitulos.appendChild(th);
  }
  thead.appendChild(trTitulos);
  tabla.appendChild(thead);
  let tbody = crearElemento('tbody');
  for (let j = 1; j < datos.length; j++) {
    let fila = datos[j];
    let tr = crearElemento('tr', undefined, { id: "filaPedido" + j + 1 });
    for (let k = 0; k < fila.length; k++) {
      let td = crearElemento('td', fila[k]);
      td.id = 'fila_' + j + '_columna_' + k;
      tr.appendChild(td);
    }
    tbody.appendChild(tr);
  }
  tabla.appendChild(tbody);
  return tabla;
}

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