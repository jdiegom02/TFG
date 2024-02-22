function recogerProductos(callback) {
  $.ajax({
    type: "GET",
    url: "../../Controlador/php/productos.php",
    dataType: "json",
    success: function (data) {
      let productos = [];
      data.forEach(element => {
        productos.push(new Producto(element.id, element.descripcion, element.categoria, element.unidad));
      });
      callback(productos);
    },
  });
}
function cerrarSesion() {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/sesion.php",
    data: {
      sesion: false,
    },
  }).done(function () {
    location.href = "../html/index.html";
  });
}

function comprobarSesion(callback) {
  let valor;
  $.ajax({
    type: "GET",
    url: "../../Controlador/php/sesion.php",
    dataType: "json",
    success: function (data) {
      valor = data;
      callback(valor);
    },
  });
}
function insertarEnSolicitudes(pedido) {
  let datos = pedido;
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: {
      datos: datos
    },
  }).done(function (a) {
    console.log("datos:", a);
    console.log("hecho");
  });
}

function cargarPedidos(callback) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { carga: "" },
  }).done(function (a) {
    console.log("datos:", a);
    console.log("hecho");
    callback(a);
  });
}
function eliminarSolicitud(id) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { eliminarSolicitud: id },
  }).done(function (a) {
    console.log("datos:", a);
    console.log("hecho");

    cargarPedidosDesdePHP();
  });
}

function insertarEnPedidos(datos) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { addPedido: datos },
  }).done(function (a) {
    console.log(a);
    cargarPedidosDesdePHP();
  });
}

function cargarProveedoresDesdePHP(callback) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    dataType: 'json',
    data: { cargaProveedor: "true" },
    success: function (data) {
      console.log(data);
      callback(data);
    },
  });
}

function actualizarProveedor(datos) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    data: { actualizarProveedor: datos },
    success: function (data) {
      console.log(data);
      location.reload();
    },
  });
}

function addProveedor(datos) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    data: { addProveedor: datos },
    success: function (data) {
      console.log(data);
    },
    error: function (xhr, status, error) {
      console.error('Error al añadir los proveedores desde PHP:', error);
    },
    complete: function () {
      location.reload();
    },
  });
}