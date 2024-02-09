window.addEventListener("load", main);
var carritoCompras = [];
function main(e) {
  mostrarProductos("all");
  // Evento cuando se cambia la categoría seleccionada y cuando se hace un submit
  let categoriasUnicas = obtenerCategoriasUnicas(productos);
  document
    .getElementById("categorySelect")
    .addEventListener("change", cambiaCategoria);
  document
    .getElementById("filterForm")
    .addEventListener("submit", filtrarInputSelect);
  // Crear opciones para cada categoría única
  crearSelectCategorias(categoriasUnicas);
  //evento para todos los botones clickeados

  let temporal = document.querySelectorAll('[id^="pedido_"]');
  temporal.forEach((elemento) => {
    console.log("hola");
    console.log(elemento);
    elemento.addEventListener("click", crearTablaPedidos);
  });
  document
    .getElementById("carritoCompras")
    .addEventListener("click", mostrarCarrito);
  // let botonesPedidos = document.querySelectorAll('[id^="añadir_"]');
  // botonesPedidos.forEach((botonPedido) => {
  //   botonPedido.addEventListener("click", añadirAlCarrito);
  // });
}
function mostrarCarrito() {
  let modalBody=document.getElementById('modalBody');

  for (let i = 0; i < carritoCompras.length; i++) {
     carritoCompras[i];
     modalBody.appendChild(carritoCompras[i].mostrarPedidosComoLista())
   
  }
}
function pedirTodo(event) {
  if (pedido.length == 0) {
    console.log("no hacer nada");
  } else {
    insertarEnSolicitudes(pedido);
    console.log("se pide todo dentro del array pedido");
    console.log(pedido);
  }
}

function modalCarritoCrearTabla(event) {
  let tabla = crearTabla(["Producto", "Unidad", "Cantidad", "Comentario", "Quitar Del Carrito"], pedido)
  let modalBody = document.getElementById('modalBody');
  for (let index = 0; index < modalBody.querySelectorAll('[id^="filaPedido"]').length; index++) {
    let td = modalBody.querySelectorAll('[id^="filaPedido"]').children[4];
    console.log(td);
    td.appendChild(crearElemento("input", undefined, { value: "creado" }))
  }
  // tds[4].appendChild(crearElemento("button",undefined,{class:"btn"}))
  modalBody.innerHTML = "";
  modalBody.appendChild(tabla);
}
function añadirProducto(event) {
  console.log("añadirProducto: " + this.id);
  let modalBody = document.getElementById('pedidoModalBody');
  let modalLabel = document.getElementById('pedidoModalLabel');
  modalLabel.innerHTML = "";
  modalLabel.appendChild(crearElemento("h5", "Pedir " + this.getAttribute("nombre"), { id: this.id }))
  modalBody.innerHTML = ""
  var divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
  var spanDolar = crearElemento('span', "Cantidad: ", { class: 'input-group-text' });
  var input = crearElemento('input', undefined, { type: 'text', class: 'form-control', 'aria-label': 'Amount (to the nearest dollar)', type: "number", min: "1", id: "cantidadPedido" });
  var spanPunto = crearElemento('span', this.getAttribute("unidad"), { class: 'input-group-text' });
  divInputGroup.appendChild(spanDolar);
  divInputGroup.appendChild(input);
  divInputGroup.appendChild(spanPunto);
  modalBody.appendChild(divInputGroup)
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