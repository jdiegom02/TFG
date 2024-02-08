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