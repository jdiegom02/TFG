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

function crearElemento(etiqueta, texto, atributos) {
  let elementoNuevo = document.createElement(etiqueta);
  if(texto !== undefined) {
      let contenidoTexto = document.createTextNode(texto);
      elementoNuevo.appendChild(contenidoTexto);
  }
  if(atributos !== undefined) {
      for(let clave in atributos) {
          elementoNuevo.setAttribute(clave, atributos[clave]);
      }
  }
  return elementoNuevo;
}