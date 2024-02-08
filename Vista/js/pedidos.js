addEventListener("DOMContentLoaded", () => {
  mostrarProductos();
});
function mostrarProductos() {
    recogerProductos(function (productos) {
    let i = 1;
    productos.forEach(producto => {
    let fila = crearElemento("tr", undefined, {"id":"producto" + i});
    fila.appendChild(crearElemento("td", producto.getNombre()));
    fila.appendChild(crearElemento("td", producto.getUnidades()));
    document.querySelector("#productTable").appendChild(fila);
    i++;
  })
  });
}
