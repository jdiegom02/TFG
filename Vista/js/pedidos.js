var pedido = [];
var categoriasUnicas = []
addEventListener("DOMContentLoaded", () => {
  mostrarSeleccionableCategorias(); mostrarProductos();
  document.getElementById("buscar").addEventListener("click", mostrarProductos)
  document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('pedir').addEventListener("click", pedirTodo);
});

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
        let inputCantidad = crearElemento("input", undefined, { class: "", type: "number", id: "cantidad" + productofiltrado.getId(), min: 1, style: "width:80%; height:50px ;text-align:center", value: 1 })
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
        //BOTON DE  PRODUCTO
        let boton = crearElemento("button", " al carrito", { "class": "btn", "value": " al carro", id: "boton", nombre: productofiltrado.getNombre(), unidad: productofiltrado.getUnidades(), identificador: productofiltrado.getId() })
        boton.addEventListener("click", añadirProducto)
        carta.appendChild(cantidadDiv)
        carta.appendChild(crearElemento("h6", productofiltrado.getUnidades(), { "class": "card-title" }));
        carta.appendChild(boton);
        contenedorCarta.appendChild(carta);
        divProductos.appendChild(contenedorCarta);
        i++;
      })
    } else {
      let contenedorCarta = crearElemento("div", undefined, { "class": "col-md-12" });
      let carta = crearElemento("div", undefined, { "class": "card grid-item", id: "producto" + i });
      carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
      carta.appendChild(crearElemento("input", undefined, { "class": "card-title", placeholder: "Nombre del Producto", id: "nuevoProducto" }));
      let botonMas = crearElemento("button", undefined, { id: "boton", class: "btn botones", nombre: document.getElementById("searchInput").value, unidad: "nodefinida", identificador: "nodefinida" });
      botonMas.addEventListener("click", añadirProducto)
      botonMas.appendChild(img);
      div.appendChild(botonMas);
    }
  });
}
function añadirProducto(params) {
  let id = this.id;
  let identificadorProducto = this.getAttribute("identificador");
  let nombre = this.getAttribute("nombre");
  let unidad = this.getAttribute("unidad");
  let inputCantidad = document.getElementById("cantidad" + identificadorProducto)
  let cantidad = inputCantidad.value
  console.log(id, identificadorProducto, nombre, unidad)
  aparecerVentanaEmergente("Se agrego al carrito:", cantidad + " " + unidad + " de " + nombre);
  añadirCarrito(nombre, unidad, cantidad, identificadorProducto)
  //reiniciar a 1 
  inputCantidad.value = 1;
}
function añadirCarrito(nombre, unidad, cantidad, identificadorProducto) {
  pedido.push([nombre, unidad, cantidad, ""]);
  // reutilizar
  // let fila = document.getElementById("producto" + this.getAttribute("identificador"));
  // let divBotones = fila.querySelector("#divBotones")
  // let botonCheck = crearElemento("button", undefined, { id: "botonCheck", class: "btn botones", identificador: pedido.length });
  // botonCheck.appendChild(crearElemento("img", undefined, { src: "../assets/botonCheck.svg" }))
  // divBotones.appendChild(botonCheck)
  // document.getElementById("cerrarPedido").click();
}
function aparecerVentanaEmergente(titulo, descripcion) {
  let contenedorVentanaEmergente = (crearElemento("div", undefined, { id: "contenedor-ventanaEmergente" }))
  let ventanaEmergente = crearElemento("div", undefined, { id: "ventanaEmergente" })
  ventanaEmergente.appendChild(crearElemento("h3", titulo, { id: "ventanaEmergente-titulo" }))
  ventanaEmergente.appendChild(crearElemento("h3", descripcion, { id: "ventanaEmergente-descripcion" }))
  contenedorVentanaEmergente.appendChild(ventanaEmergente)
  document.body.appendChild(contenedorVentanaEmergente);
  setTimeout(() => desaparecerElementoFadeOut(contenedorVentanaEmergente), 1000);
}
function desaparecerElementoFadeOut(elemento) {
  let elementoDesaparecer
  if (elemento == undefined) {
    elementoDesaparecer = document.getElementById("contenedor-ventanaEmergente");
  } else {
    elementoDesaparecer = elemento;
  }
  let opacidad = 1;
  let intervalo = setInterval(function () {
    if (opacidad <= 0.1) {
      clearInterval(intervalo);
      elementoDesaparecer.style.display = "none";
      elementoDesaparecer.parentNode.removeChild(elementoDesaparecer), 1000
    }
    elementoDesaparecer.style.opacity = opacidad;
    opacidad -= opacidad * 0.1;
  }, 50); // Velocidad de la animación (50 milisegundos)
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
  let divComentario = crearElemento('div', undefined, { class: 'form-floating' });
  divComentario.appendChild(crearElemento('label', 'Comentario', { for: 'comentarioPedido' }));
  divComentario.appendChild(crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px', resize: 'none' }));
  modalBody.appendChild(divComentario);
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
//obtener las categorias unicas:
function mostrarSeleccionableCategorias() {
  let categoriasDisponibles = [];
  let selectCategoria = document.getElementById("categorySelect");
  recogerProductos(function (productos) {
    productos.forEach(producto => {
      // Verifica si la categoría del objeto ya existe en el array de categorías únicas
      if (!categoriasDisponibles.includes(producto.getCategoria())) {
        // Si no existe, añade la categoría al array de categorías únicas
        categoriasDisponibles.push(producto.getCategoria())
        categoriasUnicas.push(producto.getCategoria());
        let textoCategoria = producto.getCategoria().charAt(0).toUpperCase() + producto.getCategoria().slice(1);
        let option = crearElemento("option", textoCategoria, { value: producto.getCategoria() });
        selectCategoria.appendChild(option);
      }
    });
  })
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