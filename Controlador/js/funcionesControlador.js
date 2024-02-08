addEventListener("DOMContentLoaded", principal);

function principal() {
}
/*METODOS DE RECOGIDA DE DATOS PETICION*/
function recogerProductos() {

  $.get("../../Controlador/php/productos.php",
    { $productos: true },
    function (response) {
      let productosArray = JSON.parse(response);
      productosArray.forEach(element => {
        console.log(element);
        productos.push(element);
      });
    }
  )
}

// function recogerProductos() {
//   $.ajax({
//     type: "GET",
//     url: "../../Controlador/php/productos.php",
//     dataType: "json",
//     success: function (a) {
//       a.forEach((element) => {
//         console.log(element);
//         productos.push(element);
//       });
//     },
//   });
// }

//HACER PHP PARA GESTIONAR ESTA FUNCION
// function EnviarSolicitudes(params) {
//   $.ajax({
//     type: "POST",
//     url: "../../Controlador/php/hacerPedido.php", // Nombre del archivo PHP que manejará la inserción
//     data: { solicitudes: solicitudesJSON }, // Envía el array como JSON
//     success: function (response) {
//       console.log(response); // Maneja la respuesta del servidor si es necesario
//     },
//   });
// }
