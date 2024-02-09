var pedido = [];
addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});
function mostrarProductos() {
  recogerProductos(function (productos) {
    let i = 1;
    productos.forEach(producto => {
      let fila = crearElemento("tr", undefined, { id: "producto" + i });
      fila.appendChild(crearElemento("td", producto.getNombre()));
      fila.appendChild(crearElemento("td", producto.getUnidades()));
      let img = crearElemento("img", undefined, { src: "../assets/botonMas.svg" })
      let boton = crearElemento("button", undefined, { class: " btn btn-outline-success me-2 botones", "data-bs-toggle": "modal", "data-bs-target": "#pedidoModal", nombre: producto.getNombre(), unidad: producto.getUnidades(), id: producto.getId() });
      let td = crearElemento("td")
      boton.addEventListener("click", añadirProducto)
      boton.appendChild(img)
      td.appendChild(boton)
      fila.appendChild(td);
      document.querySelector("#productTable").appendChild(fila);
      i++;
    })
  });
}
function pedirTodo(event) {
  if (pedido.length == 0) {
    console.log("no hacer nada");
  } else {
    console.log("se pide todo dentro del array pedido");
    console.log(pedido);
  }

}
function modalCarritoCrearTabla(event) {
  let tabla = crearTabla(["Producto", "Unidad", "Cantidad", "Comentario", "Quitar Del Carrito"], pedido)
  for (let i = 0; i < pedido.length; i++) {
    document.getElementById('fila_0_columna_3');

  }
  let modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = "";
  modalBody.appendChild(tabla)
}
function añadirProducto(event) {
  console.log("añadirProducto: " + this.id);
  let modalBody = document.getElementById('pedidoModalBody');
  let modalLabel = document.getElementById('pedidoModalLabel');
  modalLabel.innerHTML = "";
  modalLabel.appendChild(crearElemento("h5", "Pedir " + this.getAttribute("nombre"), { id: this.id }))
  modalBody.innerHTML = ""
  // modalBody.appendChild(crearElemento("label", "CANTIDAD: "))
  // modalBody.appendChild(crearElemento("input", undefined, { type: "number", min: "1", id: "cantidadPedido" }))
  // modalBody.appendChild(crearElemento("label", this.getAttribute("unidad")))
  var divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
  // Crear el span con clase "input-group-text" y contenido "$"
  var spanDolar = crearElemento('span', "Cantidad: ", { class: 'input-group-text' });
  // Crear el input con clase "form-control" y atributo aria-label
  var input = crearElemento('input', undefined, { type: 'text', class: 'form-control', 'aria-label': 'Amount (to the nearest dollar)', type: "number", min: "1", id: "cantidadPedido" });
  // Crear el segundo span con clase "input-group-text" y contenido ".00"
  var spanPunto = crearElemento('span', this.getAttribute("unidad"), { class: 'input-group-text' });
  // Agregar los elementos al div principal en el orden deseado
  divInputGroup.appendChild(spanDolar);
  divInputGroup.appendChild(input);
  divInputGroup.appendChild(spanPunto);
  modalBody.appendChild(divInputGroup)
  // modalBody.appendChild(crearElemento("textarea", undefined, { , id: "comentarioPedido" }))
  var divPrincipal = crearElemento('div', undefined, { class: 'form-floating' });
  var label = crearElemento('label', 'Comentario', { for: 'comentarioPedido' });
  let textarea = crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px', resize: 'none' });
  divPrincipal.appendChild(label);
  divPrincipal.appendChild(textarea);
  modalBody.appendChild(divPrincipal)
  document.getElementById('pedirProducto').addEventListener("click", añadirCarrito);
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
  // Crear el thead y los títulos de columna
  let thead = crearElemento('thead');
  let trTitulos = crearElemento('tr');
  for (let i = 0; i < titulos.length; i++) {
    let th = crearElemento('th', titulos[i]);
    th.id = 'titulo_' + i; // Asignar un id único a cada título de columna
    trTitulos.appendChild(th);
  }
  thead.appendChild(trTitulos);
  tabla.appendChild(thead);
  // Crear el tbody y los datos de las filas
  let tbody = crearElemento('tbody');
  for (let j = 0; j < datos.length; j++) {
    let fila = datos[j];
    let tr = crearElemento('tr');
    for (let k = 0; k < fila.length; k++) {
      let td = crearElemento('td', fila[k]);
      td.id = 'fila_' + j + '_columna_' + k; // Asignar un id único a cada celda de datos
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