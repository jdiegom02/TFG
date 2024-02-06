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
  
  
  // Simulación de datos de productos
   const productos = [
    { id: 1, nombre: "Manzana", categoria: "frutas" },
    { id: 2, nombre: "Pera", categoria: "frutas" },
    { id: 3, nombre: "Lechuga", categoria: "verduras" },
    { id: 4, nombre: "Tomate", categoria: "verduras" },
    { id: 5, nombre: "Filete de ternera", categoria: "carnes" },
    { id: 6, nombre: "Plátano", categoria: "frutas" },
    { id: 7, nombre: "Piña", categoria: "frutas" },
    { id: 8, nombre: "Zanahoria", categoria: "verduras" },
    { id: 9, nombre: "Cebolla", categoria: "verduras" },
    { id: 10, nombre: "Pollo", categoria: "carnes" },
    { id: 11, nombre: "Naranja", categoria: "frutas" },
    { id: 12, nombre: "Sandía", categoria: "frutas" },
    { id: 13, nombre: "Espinaca", categoria: "verduras" },
    { id: 14, nombre: "Brócoli", categoria: "verduras" },
    { id: 15, nombre: "Costilla de cerdo", categoria: "carnes" },
    { id: 16, nombre: "Uvas", categoria: "frutas" },
    { id: 17, nombre: "Kiwi", categoria: "frutas" },
    { id: 18, nombre: "Patata", categoria: "verduras" },
    { id: 19, nombre: "Calabacín", categoria: "verduras" },
    { id: 20, nombre: "Chuleta de cerdo", categoria: "carnes" },
    { id: 21, nombre: "Cerezas", categoria: "frutas" },
    { id: 22, nombre: "Fresas", categoria: "frutas" },
    { id: 23, nombre: "Espárragos", categoria: "verduras" },
    { id: 24, nombre: "Coliflor", categoria: "verduras" },
    { id: 25, nombre: "Ternera picada", categoria: "carnes" }
        // Resto de datos de productos
    ];

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

    

    // Mostrar todos los productos al cargar la página
   