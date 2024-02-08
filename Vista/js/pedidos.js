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
function crearTablaPedidos(event) {
  let tabla;
  let thead;
  let tbody;
  console.log(
    "CREAR TABLA PEDIDOS  " +
      this.id +
      "descripcion " +
      this.getAttribute("descripcion") +
      " Unidades" +
      this.getAttribute("unidad")
  );
  if (!document.getElementById("tablaPedidos")) {
    let tabla = crearElemento("table", undefined, {
      id: "tablaPedidos",
      class: "table",
    });
    //BORRAR TABLA DE 0
    tabla.innerHTML = "";
    //CREAR CABECERA DE TABLA e iniciar TBODY
    thead = crearElemento("thead", undefined, { class: "thead-light" });
    let headRow = crearElemento("tr", undefined);
    headRow.appendChild(crearElemento("th", "Producto"));
    headRow.appendChild(crearElemento("th", "Unidad de medida"));
    headRow.appendChild(crearElemento("th", "Cantidad Escogida"));
    headRow.appendChild(crearElemento("th", "Comentario"));
    headRow.appendChild(crearElemento("th", "Enviar?"));
    thead.appendChild(headRow);
    tbody = crearElemento("tbody", undefined, { id: "tbodypedido" });
    console.log("se creó la cabecera");
    tabla.appendChild(thead);
    tabla.appendChild(tbody);
    document.getElementById("contenedor-pedidos").appendChild(tabla);
  }
  if (document.getElementById("tablaPedidos")) {
    let cuerpo = document.getElementById("tbodypedido");
    let bodyRow = crearElemento("tr", undefined, {
      id: "fila_" + this.id,
    });
    let descripcion = crearElemento("td", this.getAttribute("descripcion"));
    let unidad = crearElemento("td", this.getAttribute("unidad"));
    let cantidad = crearElemento("td");
    cantidad.appendChild(
      crearElemento("input", undefined, {
        type: "number",
        id: "cantidad_" + this.id,
      })
    );
    let comentario = crearElemento("td", "Comentario");
    let botonEnviar = crearElemento("td", undefined);
    botonEnviar.appendChild(
      crearElemento("input", undefined, {
        type: "button",
        id: "solicitar_" + this.id,
        value: "Solicitar",
      })
    );
    botonEnviar.addEventListener("click", añadirAlCarrito);
    bodyRow.appendChild(descripcion);
    bodyRow.appendChild(unidad);
    bodyRow.appendChild(cantidad);
    bodyRow.appendChild(comentario);
    bodyRow.appendChild(botonEnviar);
    // Agregar las celdas a la fila
    cuerpo.appendChild(bodyRow);
  }
}
function añadirAlCarrito(event) {
  let fechaFormateada = devolverFechaActual();
  let idCompleto = event.target.id;
  let numero = idCompleto.replaceAll(/\D/g, "");
  var fila = document.getElementById("fila_pedido_" + numero);
  console.log(numero);
  // Obtener todas las celdas (td) dentro de la fila
  var celdas = fila.getElementsByTagName("td");
  // Iterar sobre las celdas y obtener su innerHTML
  let descripcion = celdas[0].innerHTML;
  let unidad = celdas[1].innerHTML;
  let cantidad = document.getElementById("cantidad_pedido_" + numero).value;
  let observaciones = celdas[3].innerHTML;
  console.log(numero);
  console.log(descripcion);
  console.log(unidad);
  console.log(cantidad);
  console.log(observaciones);
  let pedido = new Pedido(
    numero,
    fechaFormateada,
    descripcion,
    unidad,
    cantidad,
    observaciones,
    "USUARIO ENN SESION",
    1
  );
  carritoCompras.push(pedido);
}
function crearSelectCategorias(categoriasUnicas) {
  let selectCategoria = document.getElementById("categorySelect");
  selectCategoria.innerHTML = "";
  let optionTodas = document.createElement("option");
  optionTodas.value = "all";
  optionTodas.textContent = "Todas";
  selectCategoria.appendChild(optionTodas);
  categoriasUnicas.forEach((categoria) => {
    let option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1); // pasar a mayuscula la primera letra de la categoria para mostrar en tabla
    selectCategoria.appendChild(option);
  });
}
function filtrarInputSelect(params) {
  event.preventDefault();
  const categoria = $("#categorySelect").val();
  const busqueda = $("#searchInput").val().toLowerCase();
  let productosFiltrados = productos.filter((producto) => {
    return (
      (categoria === "all" || producto.categoria === categoria) &&
      producto.descripcion.toLowerCase().includes(busqueda)
    );
  });
  let html = "";
  productosFiltrados.forEach((producto) => {
    html +=
      `<tr>
                        <td>${producto.descripcion}</td>
                        <td>${producto.unidad}</td>
                        <td><button class="btn btn-outline-light me-2" id="pedido_` +
      producto.id +
      `" descripcion="` +
      producto.descripcion +
      `" unidad="` +
      producto.unidad +
      `"><img src="../assets/plus-large-svgrepo-com.svg" alt="" /></td>
                    </tr>`;
  });
  $("#productTable").html(html);
  //<td><input type="number" id="` +producto.id + `" class="campo" placeholder="Seleccione la cantidad" /></td>
  let temporal = document.querySelectorAll('[id^="pedido_"]');
  temporal.forEach((elemento) => {
    console.log("hola");
    console.log(elemento);
    elemento.addEventListener("click", crearTablaPedidos);
  });
}
function obtenerCategoriasUnicas(arrayObjetos) {
  const categoriasUnicas = [];
  arrayObjetos.forEach((elemento) => {
    // Verifica si la categoría del objeto ya existe en el array de categorías únicas
    if (!categoriasUnicas.includes(elemento.categoria)) {
      // Si no existe, añade la categoría al array de categorías únicas
      categoriasUnicas.push(elemento.categoria);
    }
  });
  return categoriasUnicas;
}

function cambiaCategoria() {
  //al cambiarse de categoria tambien se actualiza la tabla
  const categoria = $(this).val();
  mostrarProductos(categoria);
  document.getElementById("searchInput").value = "";
}
// Función para mostrar los productos según la categoría seleccionada
function mostrarProductos(categoria) {
  let html = "";
  productos.forEach((producto) => {
    if (categoria === "all" || producto.categoria === categoria) {
      html +=
        `<tr>
                            <td>${producto.descripcion}</td>
                            <td>${producto.unidad}</td>
                            <td><button class="btn btn-outline-light me-2" id="pedido_` +
        producto.id +
        `" descripcion="` +
        producto.descripcion +
        `" unidad="` +
        producto.unidad +
        `"><img src="../assets/plus-large-svgrepo-com.svg" alt="" /></td>
                        </tr>`;
    }
  });
  $("#productTable").html(html);
  let temporal = document.querySelectorAll('[id^="pedido_"]');
  temporal.forEach((elemento) => {
    console.log("hola");
    console.log(elemento);
    elemento.addEventListener("click", crearTablaPedidos);
  });
}
//HERRAMIENTAS
function crearElemento(etiqueta, texto, atributos) {
  let elementoNuevo = document.createElement(etiqueta);
  if (texto !== undefined) {
    let contenido = document.createTextNode(texto);
    elementoNuevo.appendChild(contenido);
  }
  if (atributos !== undefined) {
    for (let clave in atributos) {
      elementoNuevo.setAttribute(clave, atributos[clave]);
    }
  }
  return elementoNuevo;
}
function devolverFechaActual() {
  var fechaActual = new Date();

  // Obtener el año, mes y día
  let año = fechaActual.getFullYear();
  let mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2); // Agregar 1 porque los meses comienzan desde 0
  let dia = ("0" + fechaActual.getDate()).slice(-2);

  // Obtener la hora y los minutos
  let horas = ("0" + fechaActual.getHours()).slice(-2);
  let minutos = ("0" + fechaActual.getMinutes()).slice(-2);

  // Construir la cadena de fecha y hora
  let fechaHoraActual =
    año + "-" + mes + "-" + dia + " " + horas + ":" + minutos;

  // Mostrar la fecha y hora actual
  return fechaHoraActual;
}
