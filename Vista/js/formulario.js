  window.addEventListener("load",principal);


  function principal(){
      mostrarProductos("all");
      // Evento cuando se cambia la categoría seleccionada
    $('#categorySelect').change(function() {
        const categoria = $(this).val();
        mostrarProductos(categoria);
    });

    // Evento cuando se envía el formulario (buscador)
    $('#filterForm').submit(function(event) {
        event.preventDefault();
        const categoria = $('#categorySelect').val();
        const busqueda = $('#searchInput').val().toLowerCase();
        let productosFiltrados = productos.filter(producto => {
            return (categoria === "all" || producto.categoria === categoria) &&
                   producto.nombre.toLowerCase().includes(busqueda);
        });
        let html = "";
        productosFiltrados.forEach(producto => {
            html += `<tr>
                        <td>${producto.id}</td>
                        <td>${producto.nombre}</td>
                        <td>${producto.categoria}</td>
                    </tr>`;
        });
        $('#productTable').html(html);
    });
  }
  
    // Función para mostrar los productos según la categoría seleccionada
    function mostrarProductos(categoria) {
        let html = "";
        productos.forEach(producto => {
            if (categoria === "all" || producto.categoria === categoria) {
                html += `<tr>
                            <td>${producto.id}</td>
                            <td>${producto.nombre}</td>
                            <td>${producto.categoria}</td>
                        </tr>`;
            }
        });
        $('#productTable').html(html);
    }
function opcionesDinamico() {
    
}
    

    // Mostrar todos los productos al cargar la página
    function mostrarProductosDos(categoria) {
        const tabla = document.createElement('table');
        const cabecera = document.createElement('thead');
        const cuerpo = document.createElement('tbody');
        
        const cabeceraHTML = '<th>ID</th><th>Nombre</th><th>Categoría</th>';
        cabecera.innerHTML = cabeceraHTML;
        tabla.appendChild(cabecera);
        
        productos.forEach(producto => {
            if (categoria === "all" || producto.categoria === categoria) {
                const fila = document.createElement('tr');
                
                const id = document.createElement('td');
                id.textContent = producto.id;
                fila.appendChild(id);
                
                const nombre = document.createElement('td');
                nombre.textContent = producto.nombre;
                fila.appendChild(nombre);
                
                const categoria = document.createElement('td');
                categoria.textContent = producto.categoria;
                fila.appendChild(categoria);
                
                cuerpo.appendChild(fila);
            }
        });
        
        tabla.appendChild(cuerpo);
        
        const contenedorTabla = document.getElementById('productTable');
        contenedorTabla.innerHTML = '';
        contenedorTabla.appendChild(tabla);
    }
    