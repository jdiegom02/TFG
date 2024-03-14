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
function cerrarSesion() {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/sesion.php",
    data: {
      sesion: false,
    },
  }).done(function () {
    location.href = "../html/index.html";
  });
}

function comprobarSesion(callback) {
  let valor;
  $.ajax({
    type: "GET",
    url: "../../Controlador/php/sesion.php",
    dataType: "json",
    success: function (data) {
      valor = data;
      callback(valor);
    },
  });
}
function recogerHistorial(usuario) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/historialPedidos.php", // Ruta al script PHP que manejará la solicitud
    data: { usuario: usuario },
    dataType: 'json',
    success: function (data) {
      mostrarHistorialUsuario(data); // Llamar a la función mostrarPedidos con los datos obtenidos
    },
  })
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
    console.log("datos:", a);
    console.log("hecho");
  });
}

function cargarPedidos(callback) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { carga: "" },
  }).done(function (a) {
    console.log("datos:", a);
    console.log("hecho");
    callback(a);
  });
}
function cargarPedidosDesdePHP() {
  $.ajax({
    url: '../../Controlador/php/pedidosmostrar.php',
    type: 'POST',
    dataType: 'json',
    success: function (data) {
      mostrarPedidos(data); // Llamar a la función mostrarPedidos con los datos obtenidos
    },
    error: function (xhr, status, error) {
      console.error('Error al cargar los pedidos desde PHP:', error);
    }
  });
}
function eliminarSolicitud(id) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { eliminarSolicitud: id },
  }).done(function (a) {
    console.log("datos:", a);
    console.log("hecho");

    cargarPedidosDesdePHP();
  });
}

function insertarEnPedidos(datos) {
  $.ajax({
    type: "POST",
    url: "../../Controlador/php/funcionesSolicitudes.php",
    data: { addPedido: datos },
  }).done(function (a) {
    console.log(a);
    cargarPedidosDesdePHP();
  });
}

function cargarProveedoresDesdePHP(callback) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    dataType: 'json',
    data: { cargaProveedor: "true" },
    success: function (data) {
      console.log(data);
      callback(data);
    },
  });
}

function actualizarProveedor(datos) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    data: { actualizarProveedor: datos },
    success: function (data) {
      console.log(data);
      location.reload();
    },
  });
}

function addProveedor(datos) {
  $.ajax({
    url: "../../Controlador/php/funcionesProveedores.php",
    type: 'POST',
    data: { addProveedor: datos },
    success: function (data) {
      console.log(data);
    },
    error: function (xhr, status, error) {
      console.error('Error al añadir los proveedores desde PHP:', error);
    },
    complete: function () {
      location.reload();
    },
  });
}


function generarPDFPedidos() {
  $.ajax({
    url: '../../Controlador/php/pedidoMostrarTramitados.php',
    type: 'POST',
    dataType: 'json',
    success: function (response) {
      console.log(response);
      // Asignar jsPDF a window.jsPDF
      window.jsPDF = window.jspdf.jsPDF;

      // Obtener el nombre del mes actual
      let date = new Date();
      let monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
      let monthName = monthNames[date.getMonth()];

      // Obtener el número de la semana del mes actual
      let semanaMes = Math.ceil(date.getDate() / 7);

      // Obtener el año actual
      let year = date.getFullYear();

      // Iterar sobre cada proveedor en el objeto response
      for (let proveedorNombre in response) {
        if (response.hasOwnProperty(proveedorNombre) && response[proveedorNombre].length > 0) {
          // Crear instancia de jsPDF para cada proveedor
          let doc = new window.jsPDF();

          // Definir el título del PDF
          doc.setFontSize(22);
          doc.setFont("helvetica", "bold");
          var tituloPDF = 'Pedido ' + proveedorNombre + ' - ';
          doc.text(tituloPDF, 105, 20, { align: 'center' });

          // Agregar subtítulo
          doc.setFontSize(16);
          doc.text(semanaMes + 'º semana de ' + monthName + ' de ' + year, 105, 30, { align: 'center' });

          // Definir posición inicial para la lista
          var y = 45;
          doc.text("Producto", 20, y, { align: 'left' });
          doc.text("Cantidad", 180, y, { align: 'right' });
          y += 10;
          doc.line(10, y, 200, y);
          y += 10;
          // Obtener los pedidos del proveedor actual
          let pedidos = response[proveedorNombre];

          // Iterar sobre cada pedido del proveedor
          for (let i = 0; i < pedidos.length; i++) {
            let pedido = pedidos[i];

            // Agregar descripción del pedido y cantidad
            doc.setFontSize(12);
            doc.setFont("helvetica", "normal");
            doc.text(pedido.descripcion, 20, y);
            doc.text(pedido.cantidad + " " + pedido.unidad + "/s", 180, y, { align: 'right' });
            y += 10;
            doc.line(10, y, 200, y);
            y += 10;
          }

          // Guardar el PDF con un nombre único para cada proveedor
          doc.save('pedido_' + proveedorNombre + '_' + year + '_' + monthName + '_' + semanaMes + '.pdf');
        }
      }
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  });
}

function generarPDFResiduos() {
  // Obtener el mes y el año seleccionados
  var mesSeleccionado = document.getElementById("mes").value.padStart(2, '0');
  var anioSeleccionado = document.getElementById("anio").value;
  var mesSeleccionadoNombre = document.getElementById(mesSeleccionado).innerText;
  // Realizar una solicitud AJAX para generar el PDF
  console.log(anioSeleccionado);
  $.ajax({
    url: '../../Controlador/php/generarPDF.php',
    type: 'POST',
    data: { mes: mesSeleccionado, anio: anioSeleccionado },
    dataType: 'json',
    success: function (response) {

      // Asignar jsPDF a window.jsPDF
      window.jsPDF = window.jspdf.jsPDF;

      // Crear instancia de jsPDF
      const doc = new window.jsPDF();

      // Definir el título del PDF
      doc.setFontSize(22);
      doc.setFont("helvetica", "bold");
      var tituloPDF = 'Residuos generados ' + mesSeleccionadoNombre + ' de ' + anioSeleccionado;
      doc.text(tituloPDF, 105, 20, { align: 'center' });

      // Agregar subtítulo
      doc.setFontSize(16);
      doc.text('', 105, 30, { align: 'center' });

      // Definir posición inicial para la lista
      var y = 45;

      // Agregar elementos a la lista
      doc.setFontSize(14);
      let claves = Object.keys(response);
      doc.text("Residuo", 10, y);
      doc.text("Cantidad", 175, y,);
      doc.setFontSize(12);
      doc.setFont("Helvetica", "normal");

      y += 10;
      let cont = 0;
      claves.forEach(residuo => {
        doc.line(10, y, 200, y);
        y += 10;
        doc.text(residuo, 10, y);
        doc.text(response[residuo].toString() + " Kg", 190, y, { align: 'right' });
        y += 10;
        cont++;
      });
      doc.line(10, y, 200, y);

      // Guardar el PDF
      doc.save('residuos.pdf');
    },
    error: function (xhr, status, error) {
      console.error(error);
    }
  });
}