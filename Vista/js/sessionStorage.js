  // Evento de clic para el botón
  // Array de productos (puedes modificar según tus necesidades)  
  // Almacena los datos en localStorage
  localStorage.setItem("personas", JSON.stringify(productos));
  
  window.addEventListener("load", principal);
  function principal(event) {
    document.getElementById("busqueda").addEventListener("input", function () {
      var term = this.value.toLowerCase();
      var personas = JSON.parse(localStorage.getItem("personas")) || [];
      var resultados = document.getElementById("resultados");
  
      // Limpia los resultados anteriores
      resultados.innerHTML = "";
  
      // Filtra las personas que coinciden con el término de búsqueda
      var coincidencias = personas.filter(function (persona) {
        return (
          persona.id.toLowerCase().includes(term) ||
          persona.nombre.toLowerCase().includes(term) ||
          persona.descripcion.toLowerCase().includes(term)
        );
      });
  
      // Muestra los resultados
      coincidencias.forEach(function (coincidencia) {
        var li = document.createElement("li");
        li.textContent = `${coincidencia.nombre} (NIE: ${coincidencia.id}) - ${coincidencia.descripcion}`;
        resultados.appendChild(li);
      });
    });
  }
  
  var productos = [
    { id: 1, descripcion: 'Arroz', fk_unidades: 2, observaciones: 'Arroz blanco de alta calidad' },
    { id: 2, descripcion: 'Aceite de Oliva', fk_unidades: 3, observaciones: 'Aceite de oliva extra virgen' },
    { id: 3, descripcion: 'Leche', fk_unidades: 1, observaciones: 'Leche fresca' },
    { id: 4, descripcion: 'Pan Integral', fk_unidades: 2, observaciones: 'Pan integral recién horneado' },
    { id: 5, descripcion: 'Pollo Entero', fk_unidades: 2, observaciones: 'Pollo fresco entero' },
    { id: 6, descripcion: 'Huevos', fk_unidades: 1, observaciones: 'Docena de huevos orgánicos' },
    { id: 7, descripcion: 'Yogur Natural', fk_unidades: 1, observaciones: 'Yogur natural sin azúcar' },
    { id: 8, descripcion: 'Tomates', fk_unidades: 2, observaciones: 'Tomates frescos de la huerta' },
    { id: 9, descripcion: 'Pasta de Trigo Integral', fk_unidades: 2, observaciones: 'Pasta de trigo integral' },
    { id: 10, descripcion: 'Manzanas', fk_unidades: 2, observaciones: 'Manzanas orgánicas' },
    { id: 11, descripcion: 'Salmón Fresco', fk_unidades: 2, observaciones: 'Filetes de salmón fresco' },
    { id: 12, descripcion: 'Frijoles Negros', fk_unidades: 2, observaciones: 'Frijoles negros enlatados' },
    { id: 13, descripcion: 'Queso Cheddar', fk_unidades: 2, observaciones: 'Queso cheddar en bloque' },
    { id: 14, descripcion: 'Papas', fk_unidades: 2, observaciones: 'Papas russet para asar' },
    { id: 15, descripcion: 'Cereal Integral', fk_unidades: 2, observaciones: 'Cereal integral con fibra' },
    { id: 16, descripcion: 'Aguacates', fk_unidades: 2, observaciones: 'Aguacates maduros' },
    { id: 17, descripcion: 'Jamón Ahumado', fk_unidades: 2, observaciones: 'Jamón ahumado de calidad' },
    { id: 18, descripcion: 'Zanahorias', fk_unidades: 2, observaciones: 'Zanahorias frescas' },
    { id: 19, descripcion: 'Tofu', fk_unidades: 2, observaciones: 'Tofu orgánico' },
    { id: 20, descripcion: 'Café Molido', fk_unidades: 3, observaciones: 'Café molido de tueste oscuro' },
    { id: 21, descripcion: 'Fresas', fk_unidades: 2, observaciones: 'Fresas frescas' },
    { id: 22, descripcion: 'Pimiento Rojo', fk_unidades: 2, observaciones: 'Pimiento rojo fresco' },
    { id: 23, descripcion: 'Cebollas', fk_unidades: 2, observaciones: 'Cebollas amarillas' },
    { id: 24, descripcion: 'Filetes de Ternera', fk_unidades: 2, observaciones: 'Filetes de ternera magra' },
    { id: 25, descripcion: 'Naranjas', fk_unidades: 2, observaciones: 'Naranjas jugosas' },
    { id: 26, descripcion: 'Mantequilla', fk_unidades: 2, observaciones: 'Mantequilla sin sal' },
    { id: 27, descripcion: 'Quinoa', fk_unidades: 2, observaciones: 'Quinoa orgánica' },
    { id: 28, descripcion: 'Camarones Congelados', fk_unidades: 2, observaciones: 'Camarones congelados de calidad' },
    { id: 29, descripcion: 'Calabacín', fk_unidades: 2, observaciones: 'Calabacín fresco' },
    { id: 30, descripcion: 'Pimiento Verde', fk_unidades: 2, observaciones: 'Pimiento verde fresco' }
  ];


  // Convierte el array de productos a formato JSON
  var productosJSON = JSON.stringify(productos);

  // Almacena los datos en sessionStorage
  sessionStorage.setItem("productos", productosJSON);

  alert("Productos guardados en sessionStorage.");
});
