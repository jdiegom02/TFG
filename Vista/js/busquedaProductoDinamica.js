// Evento de clic para el botón
// Array de productos (puedes modificar según tus necesidades)
// Almacena los datos en sessionStorage

window.addEventListener("load", principal);
var misProductos = [];
function principal(event) {
  // Convierte el array de productos a formato JSON
  // Almacena los datos en sessionStorage
  recogerProductosBaseDatos();
  document.getElementById("inProducto").addEventListener("input", crearLista);
}
/*METODOS DE RECOGIDA DE DATOS PETICION*/
function recogerProductosBaseDatos() {
  $.ajax({
    type: "GET",
    url: "../../Controlador/php/productos.php",
    dataType: "json",
    success: function (a) {
      console.log(a);
      let arrayProductos = a;
      for (var i = 0; i < arrayProductos.length; i++) {
        var productoNuevo = new Producto();
        productoNuevo.crearProductoDesdeLiteral(arrayProductos[i]);
        misProductos.push(productoNuevo);
      }
      crearLista(arrayProductos);
    },
  });
}
function miXHRCambiaEstado(event) {
  var evento = window.evento || event;

  if (this.readyState === 4 && this.status === 200) {
    var misProductosServidor = JSON.parse(this.responseText);

    for (var i = 0; i < misProductosServidor.length; i++) {
      var productoNuevo = new Producto();
      productoNuevo.crearProductoDesdeLiteral(misProductosServidor[i]);
      misProductos.push(productoNuevo);
      // var productoNuevo = new Alumno();
      // productoNuevo.setCodigo(misProductosServidor[i].codigo);
      // productoNuevo.setNombre(misProductosServidor[i].nombre);
      // productoNuevo.setApellidos(misProductosServidor[i].apellidos);
      // productoNuevo.setFecha_nacimiento(misProductosServidor[i].fecha_nacimiento);
      // productoNuevo.setCurso(misProductosServidor[i].curso);
      // productoNuevo.setNota_media(misProductosServidor[i].nota_media);
      // misProductos.push(productoNuevo);
    }
  }
}
function crearLista(misProductos) {
  for (var i = 0; i < misProductos.length; i++) {
    var li = document.createElement("li");
    li.textContent = `${misProductos[i].descripcion} (ID: ${misProductos[i].id}) - (UNIDADES: ${misProductos[i].fk_unidades} - (OBSERVACIONES: ${misProductos[i].observaciones}))`;
    resultados.appendChild(li);
    console.log(misProductos[i].toString());
  }
}
/*FIN FIN FIN FIN METODOS DE RECOGIDA DE DATOS PETICION*/
function buscarDinamicamente(event) {
  let term = this.value.toLowerCase();
  let productos = misProductos || [];
  let resultados = document.getElementById("resultados");
  // Limpia los resultados anteriores
  resultados.innerHTML = "";
  // Filtra las productos que coinciden con el término de búsqueda
  let coincidencias = productos.filter(function (producto) {
    return (
      producto.descripcion.toLowerCase().includes(term) ||
      producto.observaciones.toLowerCase().includes(term)
    );
  });
  // Muestra los resultados
  coincidencias.forEach(function (coincidencia) {
    var li = document.createElement("li");
    li.textContent = `${coincidencia.descripcion} (ID: ${coincidencia.id}) - (UNIDADES: ${coincidencia.fk_unidades} - (OBSERVACIONES: ${coincidencia.observaciones}))`;
    resultados.appendChild(li);
  });
}
function crearElemento(tagNombre, opciones) {
  let elemento = document.createElement(tagNombre);
  if (
    opciones &&
    opciones.atributos &&
    typeof opciones.atributos === "object"
  ) {
    for (let clave in opciones.atributos) {
      elemento.setAttribute(clave, opciones.atributos[clave]);
    }
  }
  if (opciones && opciones.textoContenido) {
    elemento.textContent = opciones.textoContenido;
  }
  return elemento;
}
