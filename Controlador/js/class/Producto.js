//// CONSTRUCTOR
class Producto {
  _id;
  _nombre;
  _categoria
  _unidades;

  constructor(id, nombre, categoria, unidades) {
    this._id = id;
    this._nombre = nombre;
    this._categoria = categoria;
    this._unidades = unidades;
  }
  //// FIN - CONSTRUCTOR
  //// SETTERS Y GETTERS
  getId() {
    return this._id;
  }
  getNombre() {
    return this._nombre;
  }
  getUnidades() {
    return this._unidades;
  }

  getCategoria() {
    return this._categoria;
  }

    
}
