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
function insertarEnSolicitudes(pedido) {
  let datos = pedido;
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: {
      datos: datos
    },
  }).done(function (a) {
    console.log("datos:",a);
    console.log("hecho");
  });
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
