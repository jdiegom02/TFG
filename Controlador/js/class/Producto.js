//// CONSTRUCTOR
class Producto {
  constructor() {
    this._id;
    this._descripcion;
    this._fk_unidades;
    this._observaciones;
  }
  //// FIN - CONSTRUCTOR
  //// SETTERS Y GETTERS
  getId() {
    return this._id;
  }
  getDescripcion() {
    return this._descripcion;
  }
  getFk_Unidades() {
    return this._fk_unidades;
  }
  getObservaciones() {
    return this._observaciones;
  }
  setDescripcion(descripcion) {
    this._descripcion = descripcion;
  }
  setObservaciones(observaciones) {
    this._observaciones = observaciones;
  }
  //// FIN - SETTERS Y GETTERS
  //// MÉTODOS
  toString() {
    return this._descripcion + " " + this._observaciones;
  }
  crearProductoDesdeLiteral(objetoProducto) {
    this._id = objetoProducto.id;
    this._nombre = objetoProducto.descripcion;
    this._fk_unidades = objetoProducto.fk_unidades;
    this._observaciones = objetoProducto.observaciones;
  }
}

//// FIN - MÉTODOS