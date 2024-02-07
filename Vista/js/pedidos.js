window.addEventListener("load", main);
function main(e) {
  recogerProductos();
  mostrarProductos("all");

  // Evento cuando se cambia la categoría seleccionada
  let categoriasUnicas = obtenerCategorias(productos);
  document
    .getElementById("categorySelect")
    .addEventListener("change", cambiaCategoria);
  // Evento cuando se envía el formulario (buscador)
  document.getElementById("filterForm").addEventListener("submit", filtrar);
  //CREAR LAS CATEGORIAS
  let selectCategoria = document.getElementById("categorySelect");
  // Limpiar el select de opciones previas
  selectCategoria.innerHTML = "";

  // Crear opción para "Todas"
  let optionTodas = document.createElement("option");
  optionTodas.value = "all";
  optionTodas.textContent = "Todas";
  selectCategoria.appendChild(optionTodas);

  // Crear opciones para cada categoría única
  categoriasUnicas.forEach((categoria) => {
    let option = document.createElement("option");
    option.value = categoria;
    option.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1); // Capitalizar la primera letra
    selectCategoria.appendChild(option);
  });
}
function filtrar(params) {
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
                        <td>${producto.categoria}</td>
                        <td>${producto.unidad}</td>
                    </tr>`;
  });
  $("#productTable").html(html);
}
function obtenerCategorias(productosArray) {
  let categorias = [];
  for (let clave in productosArray) {
    if (productosArray.hasOwnProperty(clave)) {
      let categoria = productosArray[clave].categoria;
      if (!categorias.includes(categoria)) {
        categorias.push(categoria);
      }
    }
  }

  return categorias;
}

function cambiaCategoria() {
  const categoria = $(this).val();
  mostrarProductos(categoria);
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
