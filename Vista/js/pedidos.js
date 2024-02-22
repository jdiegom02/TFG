let categoriasUnicas = [];
let nombreUsuario;

document.addEventListener("DOMContentLoaded", () => {
  comprobarSesion((valor) => {
    if (valor == 0) {
      location.href = "../html/index.html";
    } else {
      if (valor.esadmin) {
        crearBotonAdministrar();
      }
      nombreUsuario = valor.nombre;
      if (!verificarSessionStorage(nombreUsuario)) {
        sessionStorage.setItem(nombreUsuario, "[]");
      }
      actualizarContadorCarrito();

      mostrarDatosUsuario(valor);
    }
  });

  agregarEventListeners();
});

function crearBotonAdministrar() {
  let botonAdministrar = crearElemento("input", undefined, {
    type: "button",
    id: "administrar",
    class: "btn btn-primary",
    value: "Administrar"
  });
  botonAdministrar.addEventListener("click", () => {
    location.href = "../html/panelAdmin.html";
  });
  document.querySelector("#elementosnav").appendChild(botonAdministrar);
}

function mostrarDatosUsuario(valor) {
  document.getElementById("usuariopedido").textContent = "Pedido de " + valor.nombre;
  let botonCerrarSesion = crearElemento("input", undefined, {
    type: "button",
    id: "cerrarsesion",
    class: "btn btn-danger",
    value: "Cerrar Sesión"
  });
  botonCerrarSesion.addEventListener("click", cerrarSesion);
  document.querySelector("#elementosnav").appendChild(botonCerrarSesion);
}

function agregarEventListeners() {
  mostrarSeleccionableCategorias();
  mostrarProductos();
  document.getElementById("categorySelect").addEventListener("change", mostrarProductos);
  document.getElementById("searchInput").addEventListener("input", mostrarProductos);
  document.getElementById("buscar").addEventListener("click", mostrarProductos);
  document.getElementById('carritoCompras').addEventListener("click", abrirCarrito);
}

function abrirCarrito(event) {
  let divCarrito = document.getElementById("carritoDerecha");
  let overlay = document.getElementById("overlay");
  overlay.style.display = "block";
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
  let overlay = document.getElementById("overlay");
  divCarrito.style.right = -divCarrito.offsetWidth + 'px';
  overlay.style.display = 'none';
  document.body.style.overflow = '';
}

function crearElementosCarrito(divCarrito) {
  let cabecera = crearElemento("div", undefined, { id: "carrito-cabecera" });
  let cerrarBoton = crearElemento("button", undefined, { id: "cerrarBoton", style: "background-color: transparent;color: initial;border: initial;padding: initial;margin: initial;font: initial;cursor: pointer;text-align: inherit;text-decoration: none;" });
  let iconoCerrar = crearElemento("img", undefined, { "src": "../assets/iconoCerrar.svg" });
  cerrarBoton.appendChild(iconoCerrar);
  cerrarBoton.addEventListener("click", cerrarCarrito)
  cabecera.appendChild(cerrarBoton);
  cabecera.appendChild(crearElemento("h2", "Carrito de Compras"));
  divCarrito.appendChild(cabecera);
  if (sessionStorage.getItem(nombreUsuario) !== null) {
    mostrarCarrito(divCarrito);
    let botonPedir = crearElemento("button", "Pedir Productos", { id: "pedir", class: "btn btn-primary", style: "width:100%;" });
    botonPedir.addEventListener("click", pedirTodo);
    divCarrito.appendChild(botonPedir);
  }
}

function mostrarCarrito(params) {
  let contenedorProductos = crearElemento("div", undefined, { id: "carrito-productos", class: "grid-carrito" });
  let arrayPedido = JSON.parse(sessionStorage.getItem(nombreUsuario));
  for (let i = 0; i < arrayPedido.length; i++) {
    let productoCarrito = crearElemento("div", undefined, { id: "filaPedido" + (i + 1), identificador: i, class: "grid-item-carrito" });
    //Contenedor imagen
    let contenedorImagen = crearElemento("div", undefined, { class: "grid-img" })
    console.log(arrayPedido[i][4])
    let imagenProducto = crearElemento("img", undefined, { "src": arrayPedido[i][4], class: "img-fluid", style: "width:50px; height:50px;" })
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
    contenedorTodo.appendChild(divDescripcion)
    contenedorTodo.appendChild(divInformacion)
    productoCarrito.appendChild(contenedorTodo);
    contenedorProductos.appendChild(productoCarrito)
  }
  carritoDerecha.appendChild(contenedorProductos)
}
function borrarFilaPedido(event) {
  let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
  miArray = eliminarPosicionDelArray(miArray, this.id - 1)
  sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray))
  abrirCarrito();
  actualizarContadorCarrito();

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
  let overlay = document.getElementById("overlay");
  let contenedorPopUp = crearElemento("div", undefined, { id: "contenedor-popUpConfirmacion" });
  let popUp = crearElemento("div", undefined, { id: "popUpConfirmacion" });
  popUp.appendChild(crearElemento("h3", "Datos del Pedido", { id: "popUpConfirmacion-titulo" }));
  popUp.appendChild(crearElemento("h3", "Nombre: " + nombre + " Cantidad " + cantidad + " Unidad de Medida " + unidad, { id: "popUpConfirmacion-descripcion" }));
  let comentario = crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px; margin-bottom:50px;', resize: 'none' });
  popUp.appendChild(comentario);
  let botonConfirmarProducto = crearElemento("button", "Confirmar Producto", { id: "confirmarProducto", class: "btn btn-success", nombre: nombre, cantidad: cantidad, unidad: unidad, imagenRelacionada: imagenRelacionada });
  popUp.appendChild(botonConfirmarProducto);
  botonConfirmarProducto.addEventListener("click", confirmarProducto);
  let botonCancelarProducto = crearElemento("button", "Cancelar", { id: "cancelarProducto", class: "btn btn-danger" });
  popUp.appendChild(botonCancelarProducto);
  botonCancelarProducto.addEventListener("click", cancelarProducto);
  contenedorPopUp.appendChild(popUp);
  document.body.appendChild(contenedorPopUp);

}

function confirmarProducto(event) {
  let observacion = document.getElementById("comentarioPedido").value;
  let cantidadAtributo = parseInt(this.getAttribute("cantidad"));
  let encontrado = false;
  let posicionEnArray = 0;
  if (verificarSessionStorage(nombreUsuario)) {
    let almacenado = JSON.parse(sessionStorage.getItem(nombreUsuario));
    for (let i = 0; i <= almacenado.length; i++) {
      if (almacenado[i] == undefined || almacenado[i][0] !== this.getAttribute("nombre")) {
        console.log("no encontrado");
      } else {
        console.log("encontrado");
        posicionEnArray = i;
        encontrado = true;
      }
    }

  }
  if (!encontrado) {
    aparecerVentanaEmergente("Se agrego al carrito:", cantidadAtributo + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre"), "../assets/checkmark.gif");
    console.log(this.getAttribute("imagenRelacionada"))
    añadirCarrito(this.getAttribute("nombre"), this.getAttribute("unidad"), cantidadAtributo, observacion, this.getAttribute("imagenRelacionada"));
  } else {
    let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
    miArray[posicionEnArray][1] += cantidadAtributo;
    miArray[posicionEnArray][3] = observacion;
    console.log(miArray);
    sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray));
    aparecerVentanaEmergente("Se actualizó el carrito:", "Pediste " + cantidadAtributo + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre") + " más", "../assets/checkmark.gif");
  }
  document.getElementById('contenedor-popUpConfirmacion').parentNode.removeChild(document.getElementById('contenedor-popUpConfirmacion'));
  actualizarContadorCarrito()
}
function cancelarProducto(params) {
  document.getElementById('contenedor-popUpConfirmacion').parentNode.removeChild(document.getElementById('contenedor-popUpConfirmacion'));
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
  let overlay = document.getElementById("overlay2");
  overlay.style.display = "block";
  let contenedorVentanaEmergente = (crearElemento("div", undefined, { id: "contenedor-ventanaEmergente" }))
  let ventanaEmergente = crearElemento("div", undefined, { id: "contenedor-ventanaEmergente" })
  contenedorVentanaEmergente.appendChild(ventanaEmergente)
  document.body.appendChild(contenedorVentanaEmergente);
  ventanaEmergente.innerHTML = `
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
      let overlay = document.getElementById("overlay2");
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
    // let pedidoArray = JSON.parse(sessionStorage.getItem(nombreUsuario))
    // pedidoArray["comentario"] = document.getElementById("comentarioPedido").value;
    insertarEnSolicitudes(JSON.parse(sessionStorage.getItem(nombreUsuario)));
    sessionStorage.removeItem(nombreUsuario);
    aparecerVentanaEmergente("Se ha realizado el pedido", "Contacta con el administrador en caso de problemas", "../assets/checkmark.gif")
    abrirCarrito();
    if (!verificarSessionStorage(nombreUsuario)) {
      sessionStorage.setItem(nombreUsuario, "[]")
    }
  }
  actualizarContadorCarrito()
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

function reiniciarBusquedas(event) {
  document.getElementById("searchInput").value = "";
  document.getElementById("categorySelect").value = "all";
  mostrarProductos();

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
}
function crearTarjetaProducto(producto) {
  let grid = "col-xl-3 col-md-4 col-sm-6";
  let identificador;
  let atributoImagenSrc;
  let titulo;
  let unidades;

  if (producto) {
    grid = "col-xl-3 col-md-4 col-sm-6";
    identificador = producto.getId();
    atributoImagenSrc = obtenerImagenURL(producto.getCategoria());
    titulo = producto.getNombre();
    unidades = producto.getUnidades();
  } else {
    grid = "col-xl-10 col-md-10 col-sm-12";
    identificador = "nodefinida";
  }

  let contenedorCarta = crearElemento("div", undefined, { "class": grid });
  let carta = crearElemento("div", undefined, { "class": "card", id: "producto" + identificador });

  if (atributoImagenSrc != undefined) {
    carta.appendChild(crearElemento("img", undefined, { "src": atributoImagenSrc, "class": "card-img-top", "style": "height:100px;width:100px;margin:auto;" }));
  }

  if (titulo == undefined) {
    carta.appendChild(crearElemento("h6", "Agrega Nuevo Producto", { "class": "card-title" }));
    let label = crearElemento("label", "Nombre del Producto:", { for: identificador });
    let input = crearElemento("input", undefined, { id: identificador + "Nombre", class: "form-control", type: "text", style: "width:60%;margin-bottom:50px" });
    carta.appendChild(label);
    carta.appendChild(input);
  } else {
    carta.appendChild(crearElemento("h6", titulo, { "class": "card-title" }));
  }

  let cantidadDiv = crearElemento("div", undefined, { class: "container", id: "divCantidad" });
  let iconoMenos = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMenos", "src": "../assets/iconoMenos.png" });
  let inputCantidad = crearElemento("input", undefined, { class: "", type: "number", id: "cantidad" + identificador, min: 1, style: "width:100%; height:100px ;text-align:center", value: 1 });
  let iconoMas = crearElemento("img", undefined, { class: "grupoIconos", id: "iconoMas", "src": "../assets/iconoMas.svg" });

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
    let boton = crearElemento("button", "Añadir al carrito", { "class": "btn btn-primary add", "value": " al carro", id: "boton", nombre: titulo, unidad: unidades, identificador: identificador, imagenRelacionada: atributoImagenSrc });
    boton.addEventListener("click", añadirProducto);
    carta.appendChild(boton);
  } else {
    carta.appendChild(crearElemento("h6", "Unidad Solicitada:", { "class": "card-title" }))
    let label = crearElemento("label", "Unidad:", { for: identificador });
    let input = crearElemento("input", undefined, { id: identificador + "Unidad", class: "form-control", type: "text", style: "width:60%;margin-bottom:50px" });
    carta.appendChild(label);
    carta.appendChild(input);
    let boton = crearElemento("button", "Añadir al carrito", { "class": "btn btn-primary add", "value": " al carro", id: "boton", nombre: titulo, unidad: unidades, identificador: identificador });
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

// Ejecutar la función al cargar la página para mostrar la cantidad inicial

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