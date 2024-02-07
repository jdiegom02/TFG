window.addEventListener("load", main);
function main(e) {
  recogerProductos();
  mostrarProductos("all");

  // Evento cuando se cambia la categoría seleccionada
  $("#categorySelect").change(function () {
    const categoria = $(this).val();
    mostrarProductos(categoria);
  });

  // Evento cuando se envía el formulario (buscador)
  $("#filterForm").submit(function (event) {
    event.preventDefault();
    const categoria = $("#categorySelect").val();
    const busqueda = $("#searchInput").val().toLowerCase();
    let productosFiltrados = productos.filter((producto) => {
      return (
        (categoria === "all" || producto.categoria === categoria) &&
        producto.descripcion.toLowerCase().includes(busqueda)
      );
    });
    let html = "";
    productosFiltrados.forEach((producto) => {
      html += `<tr>
                        <td>${producto.descripcion}</td>
                        <td>${producto.descripcion}</td>
                        <td>${producto.unidad}</td>
                    </tr>`;
    });
    $("#productTable").html(html);
  });
}
// Función para mostrar los productos según la categoría seleccionada
function mostrarProductos(categoria) {
  console.log("ENTRO EN mostrarProductos");
  let html = "";
  productos.forEach((producto) => {
    if (categoria === "all" || producto.categoria === categoria) {
      html += `<tr>
                            <td>${producto.descripcion}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.categoria}</td>
                        </tr>`;
    }
  });
  $("#productTable").html(html);
}
