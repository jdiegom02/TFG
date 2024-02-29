let categoriasUnicas = [];
let nombreUsuario;

document.addEventListener("DOMContentLoaded", () => {
  comprobarSesion((valor) => {
    if (valor == 0) {
      location.href = "../html/index.html";
    } else {
      if (valor.esadmin) {
        mostrarDatosUsuario(valor.nombre, valor.esadmin);
      }
      nombreUsuario = valor.nombre;
      if (!verificarSessionStorage(nombreUsuario)) {
        sessionStorage.setItem(nombreUsuario, "[]");
      }
      if (!localStorage.getItem("darkModeActive")) {
        localStorage.setItem("darkModeActive", "off");
      }
      actualizarContadorCarrito();
    }
  });
  actualizarModoOscuro();
  agregarEventListeners();
});

function agregarEventListeners() {
  botonDarkMode.addEventListener("click", activarDesactivarModoOscuro);
  mostrarSeleccionableCategorias();
  mostrarProductos();
  document.getElementById("categorySelect").addEventListener("change", mostrarProductos);
  document.getElementById("searchInput").addEventListener("input", mostrarProductos);
  document.getElementById('carritoCompras').addEventListener("click", abrirCarrito);
  document.getElementById("desplegablellamar").addEventListener("mouseover", desplegarBotonesUsuario)
  document.getElementById("desplegablellamar").addEventListener("click", desplegarBotonesUsuario)
  document.getElementById("desplegableFunciones").addEventListener("mouseover", desplegarBotonesUsuario)
}

function abrirCarrito(event) {
  let divCarrito = document.getElementById("carritoDerecha");
  let overlay = document.getElementById("overlayCarrito")
  console.log(overlay)
  overlay.style.display="block";
  divCarrito.style.display = "block";
  document.body.style.overflow = 'hidden';
  divCarrito.innerHTML = "";
  divCarrito.style.top = 0;
  divCarrito.style.right = 0;
  crearElementosCarrito(divCarrito);
  overlay.addEventListener('click', cerrarCarrito);
}

function cerrarCarrito() {
  let divCarrito = document.getElementById("carritoDerecha");
  let overlay = document.getElementById("overlayCarrito")
  divCarrito.style.right = -divCarrito.offsetWidth + 'px';
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function crearElementosCarrito(divCarrito) {
  let contenedorCarrito = crearElemento("div", undefined, { id: "contenidoCarrito" })
  let cabecera = crearElemento("div", undefined, { id: "carrito-cabecera" });
  let cerrarBoton = crearElemento("button", undefined, { id: "cerrarBoton", style: "background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" });
  let iconoCerrar = crearElemento("img", undefined, { "src": "../assets/iconoCerrar.svg" });
  cerrarBoton.appendChild(iconoCerrar);
  cerrarBoton.addEventListener("click", cerrarCarrito)
  cabecera.appendChild(cerrarBoton);
  cabecera.appendChild(crearElemento("h2", "Carrito de Compras"));
  contenedorCarrito.appendChild(cabecera);
  divCarrito.appendChild(contenedorCarrito);
  if (JSON.parse(sessionStorage.getItem(nombreUsuario)).length != 0) {
    mostrarCarrito(contenedorCarrito);
    let botonPedir = crearElemento("button", "Pedir Productos", { id: "pedir", class: "btn", style: "width:100%;" });
    botonPedir.addEventListener("click", pedirTodo);
    contenedorCarrito.appendChild(botonPedir);
    divCarrito.appendChild(contenedorCarrito);
  } else {
    contenedorCarrito.appendChild(crearElemento("h3", "El carrito se encuentra vacío", { style: "color:black;margin-top:50px;padding:0px 15px" }));
    contenedorCarrito.appendChild(crearElemento("p", "Añade productos para hacer tu pedido", { style: "color:ligthgrey;padding:0px 30px" }))
    divCarrito.appendChild(contenedorCarrito);
  }
}

function mostrarCarrito(contenedor) {
  let contenedorProductos = crearElemento("div", undefined, { id: "carrito-productos", class: "grid-carrito" });
  let arrayPedido = JSON.parse(sessionStorage.getItem(nombreUsuario));
  for (let i = 0; i < arrayPedido.length; i++) {
    let productoCarrito = crearElemento("div", undefined, { id: "filaPedido" + (i + 1), identificador: i, class: "grid-item-carrito" });
    //Contenedor imagen
    let contenedorImagen = crearElemento("div", undefined, { class: "grid-img" })
    let imagenProducto = crearElemento("img", undefined, { "src": arrayPedido[i][4], class: "img-fluid", style: "width:50px; height:50px;" })
    contenedorImagen.appendChild(imagenProducto);
    productoCarrito.appendChild(contenedorImagen);
    //Contenedor Todo
    let contenedorTodo = crearElemento("div", undefined, { class: "grid-info" })
    let divDescripcion = crearElemento("div", undefined, { class: "descripcion" })
    divDescripcion.appendChild(crearElemento("h3", "" + arrayPedido[i][0]));
    contenedorTodo.appendChild(divDescripcion);
    let divInformacion = crearElemento("div", undefined, { class: "informacion" })
    let divCantidades = crearElemento("div", undefined, { class: "cantidades" })
    divCantidades.appendChild(crearElemento("h5", + arrayPedido[i][1] + " " + arrayPedido[i][2] + "(s)"))
    // divCantidades.appendChild(crearElemento("p", " " + arrayPedido[i][2]));
    let divBoton = crearElemento("div", undefined)
    let botonBorrar = crearElemento("button", undefined, { id: i + 1, type: "button", class: "", value: "", style: "margin:auto; width:100%; height:100%;background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" })
    botonBorrar.appendChild(crearElemento("img", undefined, { "src": "../assets/botonRemover1.png" }))
    botonBorrar.addEventListener("click", borrarFilaPedido);
    divBoton.appendChild(botonBorrar);
    divInformacion.appendChild(divCantidades);
    divInformacion.appendChild(divBoton)
    // contenedorTodo.appendChild(divDescripcion)
    contenedorTodo.appendChild(divInformacion)
    productoCarrito.appendChild(contenedorTodo);
    contenedorProductos.appendChild(productoCarrito)
  }
  contenedor.appendChild(contenedorProductos)
}
function borrarFilaPedido(event) {
  let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
  miArray = eliminarPosicionDelArray(miArray, this.id - 1)
  sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray))
  abrirCarrito();
  actualizarContadorCarrito();
  mostrarProductos();
}

function añadirNuevoProducto() {
  let nombreNuevoProducto = document.getElementById("nodefinidaNombre").value
  let cantidadNuevoProducto = document.getElementById("cantidadnodefinida").value;
  let unidad = document.getElementById("nodefinidaUnidad").value;
  crearPopUpConfirmacion("nuevoProducto", nombreNuevoProducto, cantidadNuevoProducto, unidad, "../img/iconos/iconoProductoNuevo.png");
  cantidadNuevoProducto = 1;
}
function añadirProducto(event) {
  if (this.getAttribute("identificador")) {
    let inputCantidad = document.getElementById("cantidad" + this.getAttribute("identificador"));
    let cantidad = parseInt(inputCantidad.value);
    crearPopUpConfirmacion(this.getAttribute("identificador"), this.getAttribute("nombre"), cantidad, this.getAttribute("unidad"), this.getAttribute("imagenRelacionada"));
    inputCantidad.value = 1;
  } else {
    let cantidad = document.getElementById("cantidad");
    crearPopUpConfirmacion(this.getAttribute("identificador"), this.getAttribute("nombre"), cantidad, this.getAttribute("unidad"), this.getAttribute("imagenRelacionada"));
    cantidad.value = 1;
  }
}

function crearPopUpConfirmacion(identificadorProducto, nombre, cantidad, unidad, imagenRelacionada) {
  let overlay = crearElemento("div", undefined, { id: "overlay1" })
  document.body.style.overflow = "hidden";
  let scrollPixel = window.pageYOffset !== undefined ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  let contenedorPopUp = crearElemento("div", undefined, { id: "contenedor-popUpConfirmacion", style: "position:absolute;top:" + scrollPixel + "px;" });
  let popUp = crearElemento("div", undefined, { id: "popUpConfirmacion", style: "" });
  popUp.appendChild(crearElemento("h2", "Datos del Pedido", { id: "popUpConfirmacion-titulo" }));
  popUp.appendChild(crearElemento("h4", "Deseas pedir: " + cantidad + " " + unidad + "(s) de " + nombre, { id: "popUpConfirmacion-descripcion" }));
  let divComentario = (crearElemento("div", undefined, { class: "form-floating" }))
  let labelComentario = crearElemento('label', "Comentarios: ", { for: "comentarioPedido", id: 'labelComentarioPedido' });
  let comentario = crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario o recomendacion a tomar en cuenta', style: 'height: 150px; margin-bottom:10%;', resize: 'none' });
  divComentario.appendChild(labelComentario);
  divComentario.appendChild(comentario);
  popUp.appendChild(divComentario);
  let divBotones = crearElemento("div", undefined, { id: "divBotonesPopUp" })
  let botonConfirmarProducto = crearElemento("button", "Confirmar Producto", { id: "confirmarProducto", class: "btn", identificador: identificadorProducto, nombre: nombre, cantidad: cantidad, unidad: unidad, imagenRelacionada: imagenRelacionada });
  divBotones.appendChild(botonConfirmarProducto);
  botonConfirmarProducto.addEventListener("click", confirmarProducto);
  let botonCancelarProducto = crearElemento("button", "Cancelar", { id: "cancelarProducto", class: "btn btn-danger" });
  divBotones.appendChild(botonCancelarProducto);
  popUp.appendChild(divBotones);
  botonCancelarProducto.addEventListener("click", cancelarProducto);
  contenedorPopUp.appendChild(popUp);
  document.body.appendChild(contenedorPopUp);
  document.body.appendChild(overlay);
}

function confirmarProducto(event) {
  document.body.style.overflow = "auto";
  let observacion = document.getElementById("comentarioPedido").value;
  let identificador = event.target.getAttribute("identificador")
  let cantidadAtributo = parseInt(this.getAttribute("cantidad"));
  let encontrado = false;
  let posicionEnArray = 0;
  if (verificarSessionStorage(nombreUsuario)) {
    let almacenado = JSON.parse(sessionStorage.getItem(nombreUsuario));
    for (let i = 0; i <= almacenado.length; i++) {
      if (almacenado[i] == undefined || almacenado[i][0] !== this.getAttribute("nombre")) {
      } else {
        posicionEnArray = i;
        encontrado = true;
      }
    }
  }
  if (!encontrado) {
    // aparecerVentanaEmergente("Se agrego al carrito:", cantidadAtributo + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre"), "../assets/checkmark.gif");
    añadirCarrito(this.getAttribute("nombre"), this.getAttribute("unidad"), cantidadAtributo, observacion, this.getAttribute("imagenRelacionada"));
  } else {
    let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
    miArray[posicionEnArray][1] += cantidadAtributo;
    miArray[posicionEnArray][3] = observacion;
    sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray));
    // aparecerVentanaEmergente("Se actualizó el carrito:", "Pediste " + cantidadAtributo + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre") + " más", "../assets/checkmark.gif");
  }
  document.getElementById("contenedor-popUpConfirmacion").parentNode.removeChild(document.getElementById("contenedor-popUpConfirmacion"));
  actualizarContadorCarrito()
  agregarCheck()

}
function cancelarProducto(event) {
  document.body.style.overflow = "auto";
  document.getElementById("contenedor-popUpConfirmacion").parentNode.removeChild(document.getElementById("contenedor-popUpConfirmacion"));
}
function añadirCarrito(nombre, unidad, cantidad, observacion, imagenRelacionada) {
  let almacenar = ([nombre, parseInt(cantidad), unidad, observacion, imagenRelacionada]);
  if (sessionStorage.getItem(nombreUsuario) != null) {
    let almacenado = JSON.parse(sessionStorage.getItem(nombreUsuario));
    almacenado.push([nombre, parseInt(cantidad), unidad, observacion, imagenRelacionada]);
    sessionStorage.setItem(nombreUsuario, JSON.stringify(almacenado));
  } else {
    let almacenado = almacenar;
    sessionStorage.setItem(nombreUsuario, almacenado);
  }
}
function aparecerVentanaEmergente(titulo, descripcion, imagenMuestra) {
  let overlay = document.getElementById("overlayVentanaEmergente");
  overlay.style.display = "block";
  let contenedorVentanaEmergente = (crearElemento("div", undefined, { id: "contenedor-ventanaEmergente", class: "col-xl-12" }))
  document.body.appendChild(contenedorVentanaEmergente);
  contenedorVentanaEmergente.innerHTML = `
    <div id="popUpEmergente" style="position: fixed; background-color: white; padding: 20px; border-radius: 10px; text-align: center;">
      <div id="popUpEmergente-mensajes"> 
        <h2>${titulo}</h2>
      </div>
      <div id="popUpEmergente-descripcion">
        <p class="text-start fs-1">${descripcion}</p>
        <div id="popUpEmergente-contenedorimagen">
          <img id="popUpEmergente-imagen" src="${imagenMuestra}">
        </div>
      </div>
    </div>
  `;
  setTimeout(() => desaparecerElementoFadeOut(contenedorVentanaEmergente), 2000);
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
      let overlay = document.getElementById("overlayVentanaEmergente");
      overlay.style.display = "none";
      elementoDesaparecer.parentNode.removeChild(elementoDesaparecer), 1000
    }
    elementoDesaparecer.style.opacity = opacidad;
    opacidad -= opacidad * 0.1;
  }, 50); // Velocidad de la animación (50 milisegundos)
}
function verificarSessionStorage(nombreUsuario) {
  return sessionStorage.getItem(nombreUsuario) !== null;
}
function pedirTodo(event) {
  if (sessionStorage.getItem(nombreUsuario) == null) {
  } else {
    insertarEnSolicitudes(JSON.parse(sessionStorage.getItem(nombreUsuario)));
    sessionStorage.setItem(nombreUsuario, "[]");
    if (localStorage.getItem("darkModeActive") == "off") {
      console.log("off")
      aparecerVentanaEmergente("Se ha realizado el pedido", "Contacta con el administrador en caso de problemas", "../assets/checkmark.gif")
    } else {
      aparecerVentanaEmergente("Se ha realizado el pedido", "Contacta con el administrador en caso de problemas", "../assets/checkmarkDarkMode.gif")
    }
    abrirCarrito();
    if (!verificarSessionStorage(nombreUsuario)) {
      sessionStorage.setItem(nombreUsuario, "[]");
    }
  }
  mostrarProductos()
  actualizarContadorCarrito();
}
function agregarCheck() {
  recogerProductos(function (productos) {
    productos.forEach(producto => {
      let carta = document.getElementById("producto" + producto.getId())
      let iconoCheckMark = crearElemento("img", undefined, { class: "iconoCheckMark", src: "../img/iconos/verificar.png" })
      let contenedorCheckMark = crearElemento("div", undefined, { class: "contenedorCheckMark" })
      if (verificarProductoEnSesionStorage(producto.getNombre())) {
        if (carta.querySelector('div.contenedorCheckMark') !== null) {
        } else {
          contenedorCheckMark.appendChild(iconoCheckMark)
          carta.appendChild(contenedorCheckMark)
        }
      }
    });
  });
}
function cerrarSesion() {
  sessionStorage.clear();
  location.href = "../html/index.html";
}
function verificarSessionStorage(nombreDelKeyDeLaSesion) {
  return sessionStorage.getItem(nombreDelKeyDeLaSesion) != null;
}
// Obtener las categorías únicas y mostrarlas en el selector de categorías
function mostrarSeleccionableCategorias() {
  let selectCategoria = document.getElementById("categorySelect");
  recogerProductos(function (productos) {
    let categoriasDisponibles = [];
    productos.forEach(producto => {
      if (!categoriasDisponibles.includes(producto.getCategoria())) {
        categoriasDisponibles.push(producto.getCategoria());
        let textoCategoria = producto.getCategoria().charAt(0).toUpperCase() + producto.getCategoria().slice(1);
        let option = crearElemento("option", textoCategoria, { value: producto.getCategoria() });
        selectCategoria.appendChild(option);
      }
    });
  });
}
function mostrarProductos() {
  recogerProductos(function (productos) {
    let productosFiltrados = filtrarProductos(productos);
    document.getElementById("nuevosProductos").innerHTML = ""
    let contenedorProductos = document.getElementById("productos");
    contenedorProductos.innerHTML = ""; // Limpiar el contenedor antes de mostrar los productos
    if (productosFiltrados.length > 0) {
      productosFiltrados.forEach(producto => {
        contenedorProductos.appendChild(crearTarjetaProducto(producto));
      });
    } else {
      document.getElementById("nuevosProductos").innerHTML = ""; // Limpiar el contenedor antes de mostrar los producto
      contenedorProductos.innerHTML = "<p>No se encontraron productos</p>";
      document.getElementById("nuevosProductos").appendChild(crearTarjetaProducto())
    }
  });
  agregarCheck()

}
function crearTarjetaProducto(producto) {
  let grid = "col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-4 col-xs-12";
  let identificador;
  let atributoImagenSrc;
  let titulo;
  let unidades;

  if (producto) {
    grid = "col-xxl-3 col-xl-3 col-lg-4 col-md-4 col-sm-6 col-xs-12";
    identificador = producto.getId();
    atributoImagenSrc = obtenerImagenURL(producto.getCategoria());
    titulo = producto.getNombre();
    unidades = producto.getUnidades();
  } else {
    grid = "col-xxl-4 col-xl-4  col-lg-6 col-md-8 col-sm-12";
    identificador = "nodefinida";
  }

  let contenedorCarta = crearElemento("div", undefined, { "class": grid + " contenedor-card" });
  let carta = crearElemento("div", undefined, { "class": "card", id: "producto" + identificador, style: "" });
  if (atributoImagenSrc != undefined) {
    carta.appendChild(crearElemento("img", undefined, { "src": atributoImagenSrc, "class": "card-img-top", "style": "height:auto;width:40%;margin:auto;" }));
  }

  if (titulo == undefined) {
    carta.appendChild(crearElemento("h3", "Pide un nuevo Producto", { "class": "card-title", style: "margin:20px;" }));
    let label = crearElemento("label", "Nombre del Producto:", { for: identificador });
    let input = crearElemento("input", undefined, { id: identificador + "Nombre", class: "form-control", type: "text", style: "width:60%;margin:auto;margin-bottom:10px;" });
    carta.appendChild(label);
    carta.appendChild(input);
  } else {
    carta.appendChild(crearElemento("h5", titulo, { "class": "card-title" }));
  }

  let cantidadDiv = crearElemento("div", undefined, { class: "container", id: "divCantidad" });
  let iconoMenos = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMenos", "src": "../assets/iconoMenos.png" });
  let inputCantidad = crearElemento("input", undefined, { class: "", type: "number", id: "cantidad" + identificador, min: 1, style: "width:100%; height:100px ;text-align:center", value: 1 });
  let iconoMas = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMas", "src": "../assets/iconoMas.png" });

  inputCantidad.addEventListener("change", function () {
    let valor = parseInt(this.value);
    if (valor < 1 || isNaN(valor)) {
      this.value = 1;
    }
  });

  iconoMas.addEventListener("click", function () {
    inputCantidad.value++;
  });

  iconoMenos.addEventListener("click", function () {
    if (inputCantidad.value > 1) {
      inputCantidad.value--;
    }
  });

  cantidadDiv.appendChild(iconoMenos);
  cantidadDiv.appendChild(inputCantidad);
  cantidadDiv.appendChild(iconoMas);
  carta.appendChild(cantidadDiv);

  if (unidades != undefined) {
    carta.appendChild(crearElemento("h6", unidades, { "class": "card-title", style: "padding:10px" }));
    let boton = crearElemento("button", "Añadir al carrito", { "class": "btn add", "value": " al carro", id: "boton", nombre: titulo, unidad: unidades, identificador: identificador, imagenRelacionada: atributoImagenSrc });
    boton.addEventListener("click", añadirProducto);
    carta.appendChild(boton);
  } else {
    let label = crearElemento("label", "Unidad:", { for: identificador });
    let input = crearElemento("input", undefined, { id: identificador + "Unidad", class: "form-control", type: "text", style: "width:60%;margin:auto;margin-bottom:50px" });
    carta.appendChild(label);
    carta.appendChild(input);
    let boton = crearElemento("button", "Añadir al carrito", { "class": "btn add", "value": " al carro", id: "boton", nombre: titulo, unidad: unidades, identificador: identificador });
    boton.addEventListener("click", añadirNuevoProducto);
    carta.appendChild(boton);
  }

  contenedorCarta.appendChild(carta);
  return contenedorCarta;
}

function obtenerImagenURL(categoria) {
  const imagenesPorCategoria = {
    "Fruteria": "../img/iconos/iconoFruta.png",
    "Carniceria": "../img/iconos/iconoCarne.png",
    "Pescaderia": "../img/iconos/iconoPescado.png",
    "Pasteleria": "../img/iconos/iconoPastel.png",
    "Congelados": "../img/iconos/iconoCongelado.png",
    "Economato y varios": "../img/iconos/iconoEconomato.png",
    "Cafeteria y restaurante": "../img/iconos/iconoCafe.png",
    "Pan": "../img/iconos/iconoPan.png",
    "Utiles y materiales": "../img/iconos/iconoUtiles.png"
    // Añadir más categorías y sus correspondientes imágenes según haya
  };

  // Verificar si la categoría está definida en el objeto
  if (categoria in imagenesPorCategoria) {
    return imagenesPorCategoria[categoria]; // Devolver la URL de la imagen
  } else {
    // Devolver una imagen por defecto o una URL genérica
    return "../img/iconos/default.jpg";
  }
}


function obtenerCantidadArticulos() {
  let arraySesion = JSON.parse(sessionStorage.getItem(nombreUsuario));
  let cantidad = 0;
  for (let i = 0; i < arraySesion.length; i++) {
    cantidad += parseInt(arraySesion[i][1]);
  }
  return cantidad;
}

// Actualizar el contador del carrito
function actualizarContadorCarrito() {
  let contador = document.getElementById("contador-carrito");
  contador.textContent = obtenerCantidadArticulos();
}


// ------- HERRAMIENTAS -------
function filtrarProductos(array) {
  let categoria = document.getElementById("categorySelect").value;
  let resultadosFiltradosPorNombre;
  // Primero filtrar por categoría
  let resultadosFiltradosPorCategoria;
  if (categoria !== "all") {
    resultadosFiltradosPorCategoria = array.filter(producto =>
      producto.getCategoria().toLowerCase().includes(categoria.toLowerCase())
    );
  } else {
    resultadosFiltradosPorCategoria = array;
  }
  // Luego, filtrar por nombre si hay una entrada en el campo de búsqueda
  if (document.getElementById("searchInput").value.trim() !== "") {
    resultadosFiltradosPorNombre = resultadosFiltradosPorCategoria.filter(producto =>
      producto.getNombre().toLowerCase().includes(document.getElementById("searchInput").value.trim().toLowerCase())
    );
  } else {
    resultadosFiltradosPorNombre = resultadosFiltradosPorCategoria;
  }
  return resultadosFiltradosPorNombre;
}
function eliminarPosicionDelArray(array, posicionEnArray) {
  let arrayTempo = [];
  if (posicionEnArray < array.length) {
    for (let i = 0; i < array.length; i++) {
      if (i != posicionEnArray) {
        arrayTempo.push(array[i]);
      }
    }
  }
  return arrayTempo;
}
function verificarProductoEnSesionStorage(nombreDelProducto) {
  // Obtener el array de sessionStorage
  var arrayPrincipal = JSON.parse(sessionStorage.getItem(nombreUsuario));
  // Verificar si el arrayPrincipal existe y es un array
  if (Array.isArray(arrayPrincipal)) {
    // Iterar sobre cada subarray dentro del arrayPrincipal
    for (var i = 0; i < arrayPrincipal.length; i++) {
      // Verificar si el argumento está en la primera posición del subarray actual
      if (arrayPrincipal[i][0] === nombreDelProducto) {
        return true; // El argumento está presente
      }
    }
  }

  return false; // El argumento no está presente
}