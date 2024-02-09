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
    url: "../../Controlador/php/insertar.php",
    data: {
      datos: datos
    },
  }).done(function (a) {
    console.log("datos:"+a);
    console.log("hecho");
  });
}