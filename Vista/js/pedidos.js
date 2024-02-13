var pedido = ["admin@example.com"]
addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});
function mostrarProductos() {
  recogerProductos(function (productos) {
    let i = 1;
    productos.forEach(producto => {

      let columna = crearElemento("div", undefined, {"class":"col-md-3"});
      document.querySelector("#productos").appendChild(columna);
      let card = crearElemento("div", undefined, {"class":"card"});
      columna.appendChild(card);
      card.appendChild(crearElemento("img", undefined, {"src":"../img/iconos/1654549.png", "class":"card-img-top"}));
      card.appendChild(crearElemento("h4",producto.getNombre(), {"class":"card-title"}));
      card.appendChild(crearElemento("input",undefined,{"class": "btn", "value":"Añadir al carro"}))
    })
  });
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
  /* antes en el for se iba al modal.legnth
  en la primera iteracion el length sempre será 0 
  por ello se lo he cambiado a tabla, que es lo mismo pero
  actualizado, buenos dias */
  for (let index = 0; index < tabla.querySelectorAll('[id^="filaPedido"]').length; index++) {
    let tr = modalBody.querySelectorAll('[id^="filaPedido"]')[index];
    console.log(tr);
    /*acceder al hijo de el de tbody(tabla.childern[1]) */
    tabla.children[1].children[index].appendChild(crearElemento("input", "boton", { value: "Quitar del carrito, falta funcionalidad", type:"button"}))
    console.log(tabla);
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