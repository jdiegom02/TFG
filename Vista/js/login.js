addEventListener("DOMContentLoaded", principal);

function principal() {
  document.querySelector("#login").addEventListener("click", validarFormulario);
  var container = document.getElementById("contenedor");
  container.classList.add("visible"); // Agrega la clase 'visible' para iniciar la animación al cargar la página
}

function validarFormulario() {
  limpiarHTML();
  let validarEmail = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
  let validarPass = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{8,}$/;

  let emailUsuario = document.querySelector("#email").value;
  let passwordUsuario = document.querySelector("#password").value;

  if (validarEmail.test(emailUsuario) && validarPass.test(passwordUsuario)) {
    $.ajax({
      type: "POST",
      url: "../../Controlador/php/login.php",
      data: {
        email: emailUsuario,
        password: passwordUsuario,
      },
    }).done(function (a) {
      if(a == 1) {
        location.href = "../html/pedidos.html";
      } else {
        crearMensajeError(a);
      }
    });
  } else if (!validarEmail.test(emailUsuario)) {
    crearMensajeError("Has introducido un email inválido <br> Ej:ejemplo@ejemplo.com");
  } else {
    crearMensajeError("La contraseña debe tener un minimo de 8 caracteres incluyendo letra minuscula, letra mayuscula y numeros sin espacios");
  }
}

function crearMensajeError(mensaje) {
  $("#modalerror").modal("show");
  imprimirMensaje(mensaje);
}

function imprimirMensaje(mensaje) {
  let mensajeError = document.querySelector("#msg");
  let parrafoError = document.createElement("p");
  parrafoError.innerHTML = mensaje;
  mensajeError.appendChild(parrafoError);
}

function limpiarHTML() {
  let mensajeError = document.querySelector("#msg");
  if (mensajeError.hasChildNodes()) {
    mensajeError.removeChild(mensajeError.firstChild);
  }
}
