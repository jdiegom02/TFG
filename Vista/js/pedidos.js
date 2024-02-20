
var pedido = [];
var categoriasUnicas = []
var nombreUsuario;
addEventListener("DOMContentLoaded", () => {
  comprobarSesion(function (valor) {
    if (valor == 0) {
      location.href = "../html/index.html";
    } else {
      if (valor.esadmin) {
        document.querySelector("#elementosnav").appendChild(crearElemento("input", undefined, { "type": "button", "id": "administrar", "class": "btn btn-primary", "value": "Administrar" }));
        document.querySelector("#administrar").addEventListener("click", () => {
          location.href = "../html/panelAdmin.html";
        });
      }
      nombreUsuario = valor.nombre;
      document.getElementById("usuariopedido").textContent = "Pedido de " + valor.nombre;
      document.querySelector("#elementosnav").appendChild(crearElemento("input", undefined, { "type": "button", "id": "cerrarsesion", "class": "btn btn-danger", "value": "Cerrar Sesión" }));
      document.querySelector("#cerrarsesion").addEventListener("click", () => {
        cerrarSesion();
      });
    }
  });
  mostrarSeleccionableCategorias(); mostrarProductos();
  document.getElementById("categorySelect").addEventListener("change", mostrarProductos)
  document.getElementById("searchInput").addEventListener("input", mostrarProductos)
  document.getElementById("buscar").addEventListener("click", mostrarProductos)
  // document.getElementById('carritoCompras').addEventListener("click", modalCarritoCrearTabla);
  document.getElementById('carritoCompras').addEventListener("click", abrirCarrito);
  // document.getElementById('pedir').addEventListener("click", pedirTodo);
});
function abrirCarrito(event) {
  let divCarrito = document.getElementById("carritoDerecha");
  let overlay = document.getElementById("overlay");
  //actualizar posiciones antes de la transicion
  overlay.style.display = "block";
  divCarrito.style.display = "block";
  document.body.style.overflow = 'hidden'; // Deshabilitar scroll en la página principal
  divCarrito.innerHTML = "";
  divCarrito.style.top = 0;
  divCarrito.style.right = 0;
  //que aparezca y luego se mueva;
  //CREAR ELEMENTOS DEL CARRITO:
  let cabecera = crearElemento("div", undefined, { id: "carrito-cabecera" });
  let cerrarBoton = crearElemento("button", undefined, { id: "cerrarBoton", style: "background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" });
  let iconoCerrar = crearElemento("img", undefined, { "src": "../assets/iconoCerrar.svg" });
  cerrarBoton.appendChild(iconoCerrar)
  cabecera.appendChild(cerrarBoton);
  cabecera.appendChild(crearElemento("h2", "Carrito de Compras",))
  divCarrito.appendChild(cabecera)
  if (sessionStorage.getItem(nombreUsuario) !== null) {
    mostrarCarrito();
    let divComentario = crearElemento('div', undefined, { class: 'form-floating' });
    divComentario.appendChild(crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px; margin-bottom:50px;', resize: 'none' }));
    divCarrito.appendChild(divComentario)
    let botonPedir = crearElemento("button", "Pedir Productos", { id: "pedir", class: "btn btn-primary", style: "width:100%;" })
    botonPedir.addEventListener("click", pedirTodo);
    divCarrito.appendChild(botonPedir);
  }

  overlay.addEventListener('click', function () {
    divCarrito.style.right = -divCarrito.offsetWidth + 'px';
    overlay.style.display = 'none'; // Ocultar overlay
    document.body.style.overflow = '';
  });
  cerrarBoton.addEventListener('click', function () {
    // Establecer la propiedad right al valor negativo del ancho del div
    divCarrito.style.right = -divCarrito.offsetWidth + 'px';
    overlay.style.display = 'none'; // Ocultar overlay
    document.body.style.overflow = ''; // Deshabilitar scroll en la página principal
  });
}
function mostrarCarrito(params) {
  let contenedorProductos = crearElemento("div", undefined, { id: "carrito-productos", class: "grid-carrito" });
  let arrayPedido = JSON.parse(sessionStorage.getItem(nombreUsuario));
  for (let i = 0; i < arrayPedido.length; i++) {
    let productoCarrito = crearElemento("div", undefined, { id: "filaPedido" + (i + 1), identificador: i, class: "grid-item-carrito" });
    //Contenedor imagen
    let contenedorImagen = crearElemento("div", undefined, { class: "grid-img" })
    let imagenProducto = crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", class: "img-fluid", style: "width:50px; height:50px;" })
    contenedorImagen.appendChild(imagenProducto);
    productoCarrito.appendChild(contenedorImagen);
    //Contenedor Todo
    let contenedorTodo = crearElemento("div", undefined, { class: "grid-info" })
    let divDescripcion = crearElemento("div", undefined, { class: "descripcion" })
    divDescripcion.appendChild(crearElemento("p", "" + arrayPedido[i][0]));
    contenedorTodo.appendChild(divDescripcion);
    let divInformacion = crearElemento("div", undefined, { class: "informacion" })
    let divCantidades = crearElemento("div", undefined, { class: "cantidades" })
    divCantidades.appendChild(crearElemento("p", "En carro:" + arrayPedido[i][1]))
    divCantidades.appendChild(crearElemento("p", " " + arrayPedido[i][2]));
    let divBoton = crearElemento("div", undefined)
    let botonBorrar = crearElemento("button", undefined, { id: i + 1, type: "button", class: "", value: "", style: "margin:auto; width:100%; height:100%;background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" })
    botonBorrar.appendChild(crearElemento("img", undefined, { "src": "../assets/botonRemover1.png" }))
    botonBorrar.addEventListener("click", borrarFilaPedido);
    divBoton.appendChild(botonBorrar);
    divInformacion.appendChild(divCantidades);
    divInformacion.appendChild(divBoton)
    console.log(arrayPedido[i][0]);
    contenedorTodo.appendChild(divDescripcion)
    contenedorTodo.appendChild(divInformacion)
    productoCarrito.appendChild(contenedorTodo);
    contenedorProductos.appendChild(productoCarrito)
  }
  carritoDerecha.appendChild(contenedorProductos)
}
function mostrarProductos() {
  recogerProductos(function (productos) {
    let divProductos = document.querySelector("#productos");
    divProductos.innerHTML = "";
    let resultadosFiltrados
    //filtrar productos devuelve el array filtado pasandole el array;
    resultadosFiltrados = filtrarProductos(productos);
    let i = 1;
    if (resultadosFiltrados.length != 0) {
      resultadosFiltrados.forEach(productofiltrado => {
        let contenedorCarta = crearElemento("div", undefined, { "class": "col-xl-3 col-md-4 col-sm-6" });
        let carta = crearElemento("div", undefined, { "class": "card", id: "producto" + i });
        //IMAGEN 
        carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
        //TEXTO DE PRODUCTO
        carta.appendChild(crearElemento("h6", productofiltrado.getNombre(), { "class": "card-title" }));
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
        let boton = crearElemento("button", "Añadir al carrito", { "class": "btn btn-primary add", "value": " al carro", id: "boton", nombre: productofiltrado.getNombre(), unidad: productofiltrado.getUnidades(), identificador: productofiltrado.getId() })
        boton.addEventListener("click", añadirProducto)
        carta.appendChild(cantidadDiv)
        carta.appendChild(crearElemento("h6", productofiltrado.getUnidades(), { "class": "card-title" }));
        carta.appendChild(boton);
        contenedorCarta.appendChild(carta);
        divProductos.appendChild(contenedorCarta);
        i++;
      })
    } else {
      let carta = crearElemento("div", undefined, { id: "producto" + i });
      carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top" }));
      carta.appendChild(crearElemento("input", undefined, { "class": "card-title", placeholder: "Nombre del Producto", id: "nuevoProducto" }));
      let botonMas = crearElemento("button", undefined, { id: "boton", class: "btn botones", nombre: document.getElementById("searchInput").value, unidad: "nodefinida", identificador: "nodefinida" });
      botonMas.addEventListener("click", añadirProducto)
      botonMas.appendChild(img);
      div.appendChild(botonMas);
      divProductos.appendChild(div)
    }
  });
}
function añadirProducto(params) {
  //buscar si existe antes
  let encontrado = false;
  let posicionEnArray = 0;
  let inputCantidad = document.getElementById("cantidad" + this.getAttribute("identificador"))
  let cantidad = inputCantidad.value
  for (let i = 0; i <= pedido.length; i++) {
    if (pedido[i] == undefined || pedido[i][0] !== this.getAttribute("nombre")) {
      let encontrado = false
    } else {
      posicionEnArray += i;
      encontrado = true
    }
  }
  if (!encontrado) {
    aparecerVentanaEmergente("Se agrego al carrito:", cantidad + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre"));
    añadirCarrito(this.getAttribute("nombre"), this.getAttribute("unidad"), cantidad)
    //reiniciar a 1 
  } else {
    let inputCantidad = document.getElementById("cantidad" + this.getAttribute("identificador"))
    let cantidad = parseInt(inputCantidad.value)
    pedido[posicionEnArray][1] += cantidad;
    //SUMARLE A LA CANTIDAD DEL CARRITO
  }
  inputCantidad.value = 1;
}
function añadirCarrito(nombre, unidad, cantidad) {
  pedido.push([nombre, parseInt(cantidad), unidad]);
  console.log("agregado al carrito");
  sessionStorage.setItem(nombreUsuario, JSON.stringify(pedido))
  console.log(sessionStorage.getItem(nombreUsuario));
}
function aparecerVentanaEmergente(titulo, descripcion) {
  let overlay = document.getElementById("overlay2");
  overlay.style.display = "block";
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
      let overlay = document.getElementById("overlay2");
      overlay.style.display = "none";
      elementoDesaparecer.parentNode.removeChild(elementoDesaparecer), 1000
    }
    elementoDesaparecer.style.opacity = opacidad;
    opacidad -= opacidad * 0.1;
  }, 50); // Velocidad de la animación (50 milisegundos)
}

function borrarFilaPedido(event) {
  pedido.splice(this.id - 1, 1);
  let elemento = event.target.parentNode.parentNode.parentNode.parentNode;
  elemento.parentNode.removeChild(elemento);
}
function pedirTodo(event) {
  if (sessionStorage.getItem(nombreUsuario) == null) {
  } else {
    let pedidoArray = JSON.parse(sessionStorage.getItem(nombreUsuario))
    pedidoArray["comentario"] = document.getElementById("comentarioPedido").value;
    console.log(pedido);
    insertarEnSolicitudes(pedidoArray);
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
