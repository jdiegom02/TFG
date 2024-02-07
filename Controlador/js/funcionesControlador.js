addEventListener("DOMContentLoaded",principal)
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
      a.forEach(element => {
        console.log(element);
      });
    }
  });
}