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
}
