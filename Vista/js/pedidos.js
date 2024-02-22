
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
      if (!verificarSessionStorage(nombreUsuario)) {
        sessionStorage.setItem(nombreUsuario, "[]")
      }
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
        carta.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", "class": "card-img-top","style":"height:100px;width:100px;margin:auto;" }));
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
      //crear accion en caso de que no exista un producto en la base de datos:
      let nombre = document.getElementById("search")
      let carta = crearElemento("div", undefined, { id: "nuevoProducto", class: "col-md-12", style: "border-radius:10px;border:3px #000 solid;width:100%;padding:20px;  box-shadow: 0 5px 4px rgba(0, 0, 0, 0.2);" });
      carta.appendChild(crearElemento("h2", "Solicitar nuevo producto: ", { style: "color:green;" }))
      let divImagen = crearElemento("div", undefined, { id: "contenedor-imagen" })
      divImagen.appendChild(crearElemento("img", undefined, { "src": "../img/iconos/1654549.png", id: "imagen-producto", style: "width:20%;margin:auto;" }))
      carta.appendChild(divImagen);
      carta.appendChild(crearElemento("label", "Nombre del Producto: ", { for: "nuevoProductoNombre" }))
      carta.appendChild(crearElemento("input", undefined, { value: document.getElementById("searchInput").value, type: "text", class: "form-control", id: "input-nuevoProducto" }))
      carta.appendChild(crearElemento("label", "Cantidad"));
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
      cantidadDiv.appendChild(iconoMenos)
      cantidadDiv.appendChild(inputCantidad)
      cantidadDiv.appendChild(iconoMas)
      carta.appendChild(cantidadDiv)
      //   <label for="exampleInputEmail1">Email address</label>
      //   <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email">
      // <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
      let botonMas = crearElemento("button", "Pedir Producto", { id: "boton", class: "btn btn-primary", unidad: "nodefinida", identificador: "nodefinida" });
      botonMas.addEventListener("click", añadirProducto)
      carta.appendChild(botonMas);
      divProductos.appendChild(carta)
    }
  });
}
function crearPopUpConfirmacion(identificadorProducto, nombre, cantidad, unidad) {
  console.log("POPUP");
  let overlay = document.getElementById("overlay")
  let contenedorPopUp = crearElemento("div", undefined, { id: "contenedor-popUpConfirmacion" })
  let popUp = crearElemento("div", undefined, { id: "popUpConfirmacion" })
  popUp.appendChild(crearElemento("h3", "Datos del Pedido", { id: "popUpConfirmacion-titulo" }))
  popUp.appendChild(crearElemento("h3", "Nombre: " + nombre + " Cantidad " + cantidad + " Unidad de Medida " + unidad, { id: "popUpConfirmacion-descripcion" }))
  //crear comentario
  let comentario = crearElemento('textarea', undefined, { class: 'form-control', id: 'comentarioPedido', placeholder: 'Deja tu comentario', style: 'height: 150px; margin-bottom:50px;', resize: 'none' });
  popUp.appendChild(comentario)
  let botonConfirmarProducto = crearElemento("button", "Confirmar Producto", { id: "confirmarProducto", class: "btn btn-success", nombre: nombre, cantidad: cantidad, unidad: unidad })
  popUp.appendChild(botonConfirmarProducto)
  botonConfirmarProducto.addEventListener("click", confirmarProducto);
  let botonCancelarProducto = crearElemento("button", "Cancelar", { id: "cancelarProducto", class: "btn btn-danger" })
  popUp.appendChild(botonCancelarProducto)
  botonCancelarProducto.addEventListener("click", cancelarProducto)
  contenedorPopUp.appendChild(popUp)
  document.body.appendChild(contenedorPopUp);
}
function confirmarProducto(event) {
  //recoger todo y mandarlo al carrito
  // document.getElementById("comentarioPedido").value;
  let observacion = document.getElementById("comentarioPedido").value;
  let cantidadAtributo = parseInt(this.getAttribute("cantidad"));
  console.log(this.getAttribute("nombre"));
  console.log(cantidadAtributo);
  let encontrado = false;
  let posicionEnArray = 0;
  if (verificarSessionStorage(nombreUsuario)) {
    let almacenado = JSON.parse(sessionStorage.getItem(nombreUsuario));
    for (let i = 0; i <= almacenado.length; i++) {
      if (almacenado[i] == undefined || almacenado[i][0] !== this.getAttribute("nombre")) {
        console.log("noo encontrado");
      } else {
        console.log("encontrado");
        posicionEnArray = i;
        encontrado = true;
      }
    }
  }
  if (!encontrado) {
    aparecerVentanaEmergente("Se agrego al carrito:", cantidadAtributo + " " + this.getAttribute("unidad") + " de " + this.getAttribute("nombre"));
    añadirCarrito(this.getAttribute("nombre"), this.getAttribute("unidad"), cantidadAtributo, observacion)
    //reiniciar a 1 
  } else {
    //si se encuentra se actualiza el valor de la session storage
    let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
    miArray[posicionEnArray][1] += cantidadAtributo
    miArray[posicionEnArray][3] = observacion;
    console.log(miArray);
    sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray));
    //SUMARLE A LA CANTIDAD DEL CARRITO
  }
  document.getElementById('contenedor-popUpConfirmacion').parentNode.removeChild(document.getElementById('contenedor-popUpConfirmacion'));
}
function cancelarProducto(params) {
  //finalmente cerrar
  document.getElementById('contenedor-popUpConfirmacion').parentNode.removeChild(document.getElementById('contenedor-popUpConfirmacion'));
}
function añadirProducto(event) {
  //buscar si existe antes
  if (document.getElementById("cantidad" + this.getAttribute("identificador")) == undefined) {
    let inputCantidad = document.getElementById("cantidad")
    let cantidad = inputCantidad.value
    
  } else {
    if (this.getAttribute("identificador")) {
      let inputCantidad = document.getElementById("cantidad" + this.getAttribute("identificador"))
      let cantidad = parseInt(inputCantidad.value)
      crearPopUpConfirmacion(this.getAttribute("identificador"), this.getAttribute("nombre"), cantidad, this.getAttribute("unidad"));
      inputCantidad.value = 1;
    } else {
      let cantidad = document.getElementById("cantidad")
      crearPopUpConfirmacion(this.getAttribute("identificador"), this.getAttribute("nombre"), cantidad, this.getAttribute("unidad"));
      cantidad.value = 1;
    }
  }

}

function añadirCarrito(nombre, unidad, cantidad, observacion) {
  let almacenar = ([nombre, parseInt(cantidad), unidad, observacion])
  if (sessionStorage.getItem(nombreUsuario) != null) {
    let almacenado = JSON.parse(sessionStorage.getItem(nombreUsuario));
    almacenado.push([nombre, parseInt(cantidad), unidad, observacion])
    sessionStorage.setItem(nombreUsuario, JSON.stringify(almacenado))
  } else {
    let almacenado = almacenar
    sessionStorage.setItem(nombreUsuario, almacenado)
  }
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
  let miArray = JSON.parse(sessionStorage.getItem(nombreUsuario));
  miArray = eliminarPosicionDelArray(miArray, this.id - 1)
  sessionStorage.setItem(nombreUsuario, JSON.stringify(miArray))
  abrirCarrito();
}
function pedirTodo(event) {
  if (sessionStorage.getItem(nombreUsuario) == null) {
  } else {
    // let pedidoArray = JSON.parse(sessionStorage.getItem(nombreUsuario))
    // pedidoArray["comentario"] = document.getElementById("comentarioPedido").value;
    insertarEnSolicitudes(JSON.parse(sessionStorage.getItem(nombreUsuario)));
    sessionStorage.removeItem(nombreUsuario);
    aparecerVentanaEmergente("Se ha hecho el pedido", "todo biem capo")
    abrirCarrito();
    if (!verificarSessionStorage(nombreUsuario)) {
      sessionStorage.setItem(nombreUsuario, "[]")
    }
  }
}
function verificarSessionStorage(nombreDelKeyDeLaSesion) {
  return sessionStorage.getItem(nombreDelKeyDeLaSesion) != null;
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
