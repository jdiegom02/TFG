//// CONSTRUCTOR
class Pedido {
  _id;
  _fecha;
  _descripcion;
  _unidades;
  _cantidad;
  _observaciones;
  _fk_usuario;
  _tramitado;
  constructor(
    id,
    fecha,
    descripcion,
    unidades,
    cantidad,
    observaciones,
    fk_usuario,
    tramitado
  ) {
    this._id = id;
    this._fecha = fecha;
    this._descripcion = descripcion;
    this._unidades = unidades;
    this._cantidad = cantidad;
    this._observaciones = observaciones;
    this._fk_usuario = fk_usuario;
    this._tramitado = tramitado;
  }
  //// FIN - CONSTRUCTOR
  //// SETTERS Y GETTERS

  getId() {
    return this._id;
  }
  getfecha() {
    return this._fecha;
  }
  getDescripcion() {
    return this._descripcion;
  }

  getUnidades() {
    return this._unidades;
  }
  getCantidad() {
    return this._cantidad;
  }
  getObservaciones() {
    return this._observaciones;
  }
  getFkUsuario() {
    return this._fk_usuario;
  }
  getTramitado() {
    return this._tramitado;
  }
  mostrarPedidosComoLista() {
    // Crear una lista desordenada
    const lista = document.createElement("ul");

    // Iterar sobre cada pedido en el array
    
      // Crear un elemento de lista
      const listItem = document.createElement("li");
      // Agregar el contenido del pedido al elemento de lista
      listItem.textContent = `ID: ${this._id}, Fecha: ${this._fecha}, Descripción: ${this._descripcion}, Unidades: ${this._unidades}, Cantidad: ${this._cantidad}, Observaciones: ${this._observaciones}, FK Usuario: ${this._fk_usuario}, Tramitado: ${this._tramitado}`;
      // Agregar el elemento de lista a la lista desordenada
      lista.appendChild(listItem);

    // Devolver la lista desordenada
    return lista;
  }
}
