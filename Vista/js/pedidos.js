var pedido = [];
var categoriasUnicas = obtenerCategoriasUnicas();
addEventListener("DOMContentLoaded", () => {
  mostrarSeleccionableCategorias(categoriasUnicas);
  mostrarProductos();
  document.getElementById("buscar").addEventListener("click", mostrarProductos)
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});
function mostrarSeleccionableCategorias(categoriasUnicas) {
  console.log(categoriasUnicas)
  let selectCategoria = document.getElementById("categorySelect");
  categoriasUnicas.forEach(categoria => {
    let textoCategoria = categoria.charAt(0).toUpperCase() + categoria.slice(1);
    let option = crearElemento("option", textoCategoria, { value: categoria });
    selectCategoria.appendChild(option);
  });
}
//FUNCION FINAL DE mostrarProductos
function mostrarProductos(categoria) {
  recogerProductos(function (productos) {
    let divProductos = document.querySelector("#productos");
    divProductos.innerHTML = "";
    let resultadosFiltrados
    //filtrar productos devuelve el array filtado pasandole el array;
    resultadosFiltrados = filtrarProductos(productos);
    let i = 1;
    if (resultadosFiltrados.length != 0) {
      resultadosFiltrados.forEach(productofiltrado => {
        let contenedorCarta = crearElemento("div", undefined, { "class": "col-md-12" });
        let carta = crearElemento("div", undefined, { "class": "card", id: "producto" + i });
        //IMAGEN 
        carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
        //TEXTO DE PRODUCTO
        carta.appendChild(crearElemento("h4", productofiltrado.getNombre(), { "class": "card-title" }));
        //ICONO MENOS MAS E INPUT CANTIDAD
        let cantidadDiv = crearElemento("div", undefined, { class: "container", id: "divCantidad" })
        let iconoMenos = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMenos", "src": "../assets/iconoMenos.png" });
        let inputCantidad = crearElemento("input", undefined, { class: "", type: "number", id: "cantidad", min: 1, style: "width:80%; height:50px ;text-align:center", value: 1 })
        let iconoMas = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMas", "src": "../assets/iconoMas.svg" });
        //asegurarme de que no sea menor que 1 nunca al teclear;
        inputCantidad.addEventListener("change", function () {
          let valor = parseInt(this.value);
          if (valor < 1 || isNaN(valor)) {
            this.value = 1;
          }
        });
        //que los botones funcionen bien
        iconoMas.addEventListener("click", function () {
          inputCantidad.value++;
        })
        iconoMenos.addEventListener("click", function () {
          if (inputCantidad.value > 1) {
            inputCantidad.value--;
          }
        })
        cantidadDiv.appendChild(iconoMenos);
        cantidadDiv.appendChild(inputCantidad);
        cantidadDiv.appendChild(iconoMas);
        //BOTON DE AÑADIR PRODUCTO
        let botonAñadir = crearElemento("button", "Añadir al carrito", { "class": "btn", "value": "Añadir al carro", id: "botonAñadir", nombre: productofiltrado.getNombre(), unidad: productofiltrado.getUnidades(), identificador: productofiltrado.getId() })
        botonAñadir.addEventListener("click", añadirProducto)
        carta.appendChild(cantidadDiv)
        carta.appendChild(crearElemento("h6", productofiltrado.getUnidades(), { "class": "card-title" }));
        carta.appendChild(botonAñadir);
        contenedorCarta.appendChild(carta);
        divProductos.appendChild(contenedorCarta);
        i++;
      })
    } else {
      let contenedorCarta = crearElemento("div", undefined, { "class": "col-md-12" });
      let carta = crearElemento("div", undefined, { "class": "card grid-item", id: "producto" + i });
      carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
      carta.appendChild(crearElemento("input", undefined, { "class": "card-title", placeholder: "Nombre del Producto", id: "nuevoProducto" }));
      let botonMas = crearElemento("button", undefined, { id: "botonAñadir", class: "btn botones", nombre: document.getElementById("searchInput").value, unidad: "nodefinida", identificador: "nodefinida" });
      botonMas.addEventListener("click", añadirProducto)
      botonMas.appendChild(img);
      div.appendChild(botonMas);
    }
  });
}
//añadir producto nuevo
function añadirProducto(event) {
  let id = this.id;
  let identificador = this.getAttribute("identificador");
  let nombre = this.getAttribute("nombre");
  let unidad = this.getAttribute("unidad");
  console.log(id, identificador, nombre, unidad)
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
//añadir producto antiguo
// function añadirProducto(event) {
//   let id = this.id;
//   let identificador = this.getAttribute("identificador");
//   let nombre = this.getAttribute("nombre");
//   let unidad = this.getAttribute("unidad");
//   console.log(id, identificador, nombre, unidad)
//   let modal = document.getElementById("pedidoModalContent");
//   let modalHeader = modal.children[0]
//   let modalBody = modal.children[1];
//   let modalFooter = modal.children[2];
//   modalHeader.innerHTML = "";
//   modalHeader.appendChild(crearElemento("h5", "Pedir " + nombre))
//   let divInputGroup;
//   if (unidad == "nodefinida") {
//     divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
//     divInputGroup.appendChild(crearElemento('span', "Cantidad: ", { class: 'input-group-text' }));
//     divInputGroup.appendChild(crearElemento('input', undefined, { type: "number", min: "1", id: "cantidadPedido", class: 'form-control' }));
//     divInputGroup.appendChild(crearElemento('span', "Unidad: ", { class: 'input-group-text' }));
//     divInputGroup.appendChild(crearElemento('input', undefined, { id: "unidadPedido", type: "text", class: 'form-control', placeholder: "Ingrese la unidad" }));
//   } else {
//     divInputGroup = crearElemento('div', undefined, { class: 'input-group mb-3' });
//     divInputGroup.appendChild(crearElemento('span', "Cantidad: ", { class: 'input-group-text' }));
//     divInputGroup.appendChild(crearElemento('input', undefined, { type: "number", min: "1", id: "cantidadPedido", class: 'form-control' }));
//     divInputGroup.appendChild(crearElemento('span', unidad, { class: 'input-group-text' }));
//   }
//   modalBody.innerHTML = ""
//   modalBody.appendChild(divInputGroup)
//   let divComentario = crearElemento('div', undefined, { class: 'form-floating' });
//   divComentario.appendChild(crearElemento('label', 'Comentario', { for: 'comentarioPedido' }));
//   divComentario.appendChild(crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px', resize: 'none' }));
//   modalBody.appendChild(divComentario);
//   modalFooter.innerHTML = ""
//   modalFooter.appendChild(crearElemento("button", "Cancelar", { id: "cerrarPedido", class: "btn btn-danger", type: "button", "data-bs-dismiss": "modal" }))
//   modalFooter.appendChild(crearElemento("button", "Pedir", { id: "añadirPedido", class: "btn btn-primary", type: "button", identificador: identificador, nombre: nombre, unidad: unidad }))
//   document.getElementById('añadirPedido').addEventListener("click", añadirCarrito);
// }
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
  let categoria = $("#categorySelect").val();
  let resultadosFiltradosporCategoria
  //primero filtro por categoria
  if (categoria !== "all") {
    resultadosFiltradosporCategoria = array.filter(producto =>
      producto.getCategoria().toLowerCase().includes(categoria.toLowerCase())
    )
  } else {
    resultadosFiltradosporCategoria = array
  }
  if (document.getElementById("searchInput".replaceAll(/\s+/g, "" === ""))) {
    resultadosFiltradosPorNombre = resultadosFiltradosporCategoria.filter(producto =>
      producto.getNombre().toLowerCase().includes(document.getElementById("searchInput").value.replaceAll(/\s+/g, "").toLowerCase())
    );
  }
  return resultadosFiltradosPorNombre;
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

//obtener las categorias unicas:
function obtenerCategoriasUnicas() {
  let categoriasUnicas = [];
  recogerProductos(function (productos) {
    productos.forEach(producto => {
      // Verifica si la categoría del objeto ya existe en el array de categorías únicas
      if (!categoriasUnicas.includes(producto.getCategoria())) {
        // Si no existe, añade la categoría al array de categorías únicas
        categoriasUnicas.push(producto.getCategoria());
      }
    });
  })
  return categoriasUnicas;
}
//recargar pagina al cambiar categoria
function cambiaCategoria() {
  //al cambiarse de categoria tambien se actualiza la tabla	
  const categoria = $(this).val();
  mostrarProductos(categoria);
  document.getElementById("searchInput").value = "";
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