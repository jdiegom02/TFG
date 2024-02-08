var productos = [];
addEventListener("DOMContentLoaded", principal);
function principal() {
  recogerProductos();
}
/*METODOS DE RECOGIDA DE DATOS PETICION*/
function recogerProductos() {
  $.ajax({
    type: "GET",
    url: "../../Controlador/php/productos.php",
    dataType: "json",
    success: function (a) {
      a.forEach((element) => {
        productos.push(element);
      });
    },
  });
}
function EnviarSolicitudes(params) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/hacerPedido.php", // Nombre del archivo PHP que manejará la inserción
    data: { solicitudes: solicitudesJSON }, // Envía el array como JSON
    success: function (response) {
      console.log(response); // Maneja la respuesta del servidor si es necesario
    },
  });
}
