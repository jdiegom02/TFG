//// CONSTRUCTOR
function Producto() {
  this._id;
  this._descripcion;
  this._fk_unidades;
  this._observaciones;
}

//// FIN - CONSTRUCTOR

//// SETTERS Y GETTERS

Producto.prototype.getId = function () {
  return this._id;
};

Producto.prototype.getDescripcion = function () {
  return this._descripcion;
};

Producto.prototype.getFk_Unidades = function () {
  return this._fk_unidades;
};

Producto.prototype.getObservaciones = function () {
  return this._observaciones;
};

Producto.prototype.setDescripcion = function (descripcion) {
  this._descripcion = descripcion;
};

Producto.prototype.setObservaciones = function (observaciones) {
  this._observaciones = observaciones;
};
//// FIN - SETTERS Y GETTERS

//// MÉTODOS

Producto.prototype.toString = function () {
  return this._descripcion + " " + this._observaciones;
};
Producto.prototype.crearProductoDesdeLiteral = function (objetoProducto) {
  this._codigo = objetoProducto.codigo;
  this._nombre = objetoProducto.nombre;
  this._apellidos = objetoProducto.apellidos;
  this._fecha_nacimiento = objetoProducto.fecha_nacimiento;
  this._curso = objetoProducto.curso;
  this.nota_media = objetoProducto.nota_media;
};

//// FIN - MÉTODOS
