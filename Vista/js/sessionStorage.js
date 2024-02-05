// Evento de clic para el botón
// Array de productos (puedes modificar según tus necesidades)
// Almacena los datos en sessionStorage

var productos = [
  {
    id: 1,
    descripcion: "Arroz",
    fk_unidades: 2,
    observaciones: "Arroz blanco de alta calidad",
  },
  {
    id: 2,
    descripcion: "Aceite de Oliva",
    fk_unidades: 3,
    observaciones: "Aceite de oliva extra virgen",
  },
  {
    id: 3,
    descripcion: "Leche",
    fk_unidades: 1,
    observaciones: "Leche fresca",
  },
  {
    id: 4,
    descripcion: "Pan Integral",
    fk_unidades: 2,
    observaciones: "Pan integral recién horneado",
  },
  {
    id: 5,
    descripcion: "Pollo Entero",
    fk_unidades: 2,
    observaciones: "Pollo fresco entero",
  },
  {
    id: 6,
    descripcion: "Huevos",
    fk_unidades: 1,
    observaciones: "Docena de huevos orgánicos",
  },
  {
    id: 7,
    descripcion: "Yogur Natural",
    fk_unidades: 1,
    observaciones: "Yogur natural sin azúcar",
  },
  {
    id: 8,
    descripcion: "Tomates",
    fk_unidades: 2,
    observaciones: "Tomates frescos de la huerta",
  },
  {
    id: 9,
    descripcion: "Pasta de Trigo Integral",
    fk_unidades: 2,
    observaciones: "Pasta de trigo integral",
  },
  {
    id: 10,
    descripcion: "Manzanas",
    fk_unidades: 2,
    observaciones: "Manzanas orgánicas",
  },
  {
    id: 11,
    descripcion: "Salmón Fresco",
    fk_unidades: 2,
    observaciones: "Filetes de salmón fresco",
  },
  {
    id: 12,
    descripcion: "Frijoles Negros",
    fk_unidades: 2,
    observaciones: "Frijoles negros enlatados",
  },
  {
    id: 13,
    descripcion: "Queso Cheddar",
    fk_unidades: 2,
    observaciones: "Queso cheddar en bloque",
  },
  {
    id: 14,
    descripcion: "Papas",
    fk_unidades: 2,
    observaciones: "Papas russet para asar",
  },
  {
    id: 15,
    descripcion: "Cereal Integral",
    fk_unidades: 2,
    observaciones: "Cereal integral con fibra",
  },
  {
    id: 16,
    descripcion: "Aguacates",
    fk_unidades: 2,
    observaciones: "Aguacates maduros",
  },
  {
    id: 17,
    descripcion: "Jamón Ahumado",
    fk_unidades: 2,
    observaciones: "Jamón ahumado de calidad",
  },
  {
    id: 18,
    descripcion: "Zanahorias",
    fk_unidades: 2,
    observaciones: "Zanahorias frescas",
  },
  {
    id: 19,
    descripcion: "Tofu",
    fk_unidades: 2,
    observaciones: "Tofu orgánico",
  },
  {
    id: 20,
    descripcion: "Café Molido",
    fk_unidades: 3,
    observaciones: "Café molido de tueste oscuro",
  },
  {
    id: 21,
    descripcion: "Fresas",
    fk_unidades: 2,
    observaciones: "Fresas frescas",
  },
  {
    id: 22,
    descripcion: "Pimiento Rojo",
    fk_unidades: 2,
    observaciones: "Pimiento rojo fresco",
  },
  {
    id: 23,
    descripcion: "Cebollas",
    fk_unidades: 2,
    observaciones: "Cebollas amarillas",
  },
  {
    id: 24,
    descripcion: "Filetes de Ternera",
    fk_unidades: 2,
    observaciones: "Filetes de ternera magra",
  },
  {
    id: 25,
    descripcion: "Naranjas",
    fk_unidades: 2,
    observaciones: "Naranjas jugosas",
  },
  {
    id: 26,
    descripcion: "Mantequilla",
    fk_unidades: 2,
    observaciones: "Mantequilla sin sal",
  },
  {
    id: 27,
    descripcion: "Quinoa",
    fk_unidades: 2,
    observaciones: "Quinoa orgánica",
  },
  {
    id: 28,
    descripcion: "Camarones Congelados",
    fk_unidades: 2,
    observaciones: "Camarones congelados de calidad",
  },
  {
    id: 29,
    descripcion: "Calabacín",
    fk_unidades: 2,
    observaciones: "Calabacín fresco",
  },
  {
    id: 30,
    descripcion: "Pimiento Verde",
    fk_unidades: 2,
    observaciones: "Pimiento verde fresco",
  },
];
var productosJSON = JSON.stringify(productos);
sessionStorage.setItem("productos", productosJSON);

alert("Productos guardados en sessionStorage.");

window.addEventListener("load", principal);
function principal(event) {
  // Convierte el array de productos a formato JSON

  // Almacena los datos en sessionStorage
  sessionStorage.setItem("productos", JSON.stringify(productos));
  document.getElementById("busqueda").addEventListener("input", function () {
    let term = this.value.toLowerCase();
    let productos = JSON.parse(sessionStorage.getItem("productos")) || [];
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
  });
}
