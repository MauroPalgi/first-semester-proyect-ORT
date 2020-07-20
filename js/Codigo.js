$(document).ready(inicio);

function inicio() {
  //BOTONES
  $("#btnLogin").click(frmLogin);
  $("#btnRegistrarse").click(frmRegistro);
  $("#btnPublicar").click(frmPublicar);
  $("#btnIngresar").click(btnLogin);
  $("#btnCerrarSesion").click(btnCerrarSesion);
  $("#btnRegistrar").click(btnRegistrarse);
  $("#btnPublicacion").click(btnPublicacion);
  $("#btnContactos").click(mostrarContactos);
  $("#btnLogo").click(volverMuro);
  $("#btnDenunciados").click(mostrarDenunciados);  
  $("#btnVolverAtras").click(volverMuro);

  //FUNCIONES
  precargaUsuarioYAdmin();
  precargaPublicaciones();
  mostrarMuroInvitado(); 
}

//ARREGLO Y ESTRUCTURAS
let listaUsuarios = [];
let listaAdm = [];
let listaPublicaciones = [];
let usuarioLogueado = null;

//INTERFAZ
function ocultarMuro() {
  $("#divFormularioLogin").hide();
  $("#divRegistroUsuario").hide();
  $("#divAltaPublicacion").hide();
  $("#divFrmContactos").hide();
  $("#divFrmDenunciados").hide();
  $("#muro").hide();
}
function ocultarBotones() {
  $("#btnPublicar").hide();
  $("#btnContactos").hide();
  $("#btnRegistrarse").hide();
  $("#btnPublicar").hide();
  $("#btnLogin").hide();
  $("#btnCerrarSesion").hide();
  $("#btnDenunciados").hide();
  $("#btnVolverAtras").hide();
}

function frmLogin() {
  ocultarMuro();
  ocultarBotones();
  $("#loginMensaje").html("");
  $("#divFormularioLogin").show();
}

function frmRegistro() {
  ocultarMuro();
  ocultarBotones();
  $("#divRegistroUsuario").show();
  $("#registroMensaje").html("");
}

function frmPublicar() {
  ocultarMuro();
  ocultarBotones();
  $("#btnCerrarSesion").show();
  $("#divAltaPublicacion").show();
}
function volverMuro() {
  if (usuarioLogueado === null) {
    mostrarMuroInvitado();
  } else {
    if (usuarioLogueado.tipo === true) {
      mostrarMuroPersona();
    } else {
      mostrarMuroAdmin();
    }
  }
}
function btnLogin() {
  let user = $("#ingresarUsuario").val();
  let pass = $("#ingresarContraseña").val();
  let posicionUser = verificarLoginUsuario(user, pass);
  let posicionAdmin = verificarLoginAdmin(user, pass);

  $("#loginMensaje").html("");

  if (posicionUser > -1 && listaUsuarios[posicionUser].activo) {
    $("#loginMensaje").html("");
    usuarioLogueado = listaUsuarios[posicionUser];
    $("#user-header").html("Bienvenido " + usuarioLogueado.nombre);
    ocultarBotones();
    mostrarMuroPersona();
  } else {
    $("#loginMensaje").html("Usuario Bloqueado");
    $("#ingresarUsuario").val("");
    $("#ingresarContraseña").val("");
  }

  if (posicionAdmin > -1) {
    $("#loginMensaje").html("");
    usuarioLogueado = listaAdm[posicionAdmin];
    $("#user-header").html(
      "Bienvenido Administrador " + usuarioLogueado.nombre
    );
    ocultarBotones();
    mostrarMuroAdmin();
  } else {
    $("#loginMensaje").html("Usuario y/o clave incorrecta!");
    $("#ingresarUsuario").val("");
    $("#ingresarContraseña").val("");
  }
}

function btnRegistrarse() {
  let photo = $("#imagenRegistro").val();
  let name = $("#nombreRegistro").val();
  let surname = $("#apellidoRegistro").val();
  let country = $("#paisRegistro").val();
  let city = $("#ciudadRegistro").val();
  let mail = $("#correoRegistro").val();
  let pass = $("#contraseñaRegistro").val();
  let repass = $("#reContraseñaRegistro").val();

  if (photo === "") {
    photo = "default.jpg";
  }

  if (
    validacionRegistroContraseña(pass) &&
    validacionRegistroMail(mail) &&
    compararContrasenia(pass, repass) === 0
  ) {
    let user = new usuarioPersona(
      name,
      surname,
      mail,
      city,
      country,
      photo,
      pass
    );
    listaUsuarios.push(user);
    $("#registroMensaje").html("Registro Exitoso");
    $("#btnVolverAtras").show();
    $("#imagenRegistro").val("");
    $("#nombreRegistro").val("");
    $("#apellidoRegistro").val("");
    $("#paisRegistro").val("");
    $("#ciudadRegistro").val("");
    $("#correoRegistro").val("");
    $("#contraseñaRegistro").val("");
    $("#reContraseñaRegistro").val("");
  } else {
    $("#registroMensaje").html("");
    if (!validacionRegistroContraseña(pass)) {
      $("#registroMensaje").append(
        "<br>Verificar que la contraseña cuente con una letra y un numero"
      );
    }
    if (!validacionRegistroMail(mail)) {
      $("#registroMensaje").append(
        "<br>Verificar que esta ingresando un correo correcto"
      );
    }
    if (compararContrasenia(pass, repass) > 0) {
      $("#registroMensaje").append(
        "<br>Verificar que las contraseñas coincidan"
      );
    }
  }
}
function mostrarMuroInvitado() {
  ocultarMuro();
  ocultarBotones();
  $("#btnRegistrarse").show();
  $("#btnLogin").show();
  $("#muro").empty();
  $("#muro").show();

  let postBody = "";

  for (let pos = listaPublicaciones.length - 1; pos >= 0; pos--) {
    unaPublicacion = listaPublicaciones[pos];
    if (
      unaPublicacion.publica === true &&
      unaPublicacion.usuarioAutor.activo === true
    ) {
      postBody +=
        '<div class="post"><div class="post-type"><span>Publica</span></div>';
      postBody +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        unaPublicacion.usuarioAutor.foto +
        '"  width="50"></td></tr><td><label class="nombre">' +
        unaPublicacion.usuarioAutor.nombre +
        "</label><br><label class='ciudad'>" +
        unaPublicacion.usuarioAutor.ciudad +
        "</td></tr></tbody></table></div>";
      postBody +=
        '<div class="post-text"><h4> ' + unaPublicacion.titulo + "</h4>";
      postBody += "<p> " + unaPublicacion.texto + "</p></div>";
      postBody +=
        '<div class="post-image"> <img src="imagenes/' +
        unaPublicacion.imagen +
        '" width="100" alt="' +
        unaPublicacion.imagen +
        '"></div>';
      postBody +=
        "<div class='post-actions'><p> " +
        unaPublicacion.aprobacion +
        " aprobaciones <p></div></div></div></div>";
    }
  }
  $("#muro").append(postBody);
}
function mostrarMuroPersona() {
  ocultarMuro();
  ocultarBotones();
  $("#btnContactos").show();
  $("#btnPublicar").show();
  $("#btnCerrarSesion").show();
  $("#muro").show();
  $("#muro").empty();

  let postBody = "";
  for (let pos = listaPublicaciones.length - 1; pos >= 0; pos--) {
    listaPublicaciones[pos];
    if (
      ((listaPublicaciones[pos].publica === true ||
        listaPublicaciones[pos].usuarioAutor === usuarioLogueado) &&
        listaPublicaciones[pos].usuarioAutor.activo === true) ||
      publicacionesPrivadasContactos(listaPublicaciones[pos])
    ) {
      if (listaPublicaciones[pos].publica === true) {
        postBody =
          '<div class="post"><div class="post-type"><span>Publica</span></div>';
      } else {
        postBody =
          '<div class="post"><div class="post-type"><span>Privada</span></div>';
      }
      postBody +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        listaPublicaciones[pos].usuarioAutor.foto +
        '" width="50"></td></tr><td><label class="nombre">' +
        listaPublicaciones[pos].usuarioAutor.nombre +
        "</label><br><label class='ciudad'>" +
        listaPublicaciones[pos].usuarioAutor.ciudad +
        "</td></tr></tbody></table></div>";
      postBody +=
        '<div class="post-text"><h4> ' +
        listaPublicaciones[pos].titulo +
        "</h4>";
      postBody += "<p> " + listaPublicaciones[pos].texto + "</p></div>";
      postBody +=
        '<div class="post-image"> <img src="imagenes/' +
        listaPublicaciones[pos].imagen +
        '" width="100" alt="' +
        listaPublicaciones[pos].imagen +
        '"></div>';
      postBody +=
        "<div class='post-actions'><p> " +
        listaPublicaciones[pos].aprobacion +
        " aprobaciones <p></div>";
      if (!fueAprobada(listaPublicaciones[pos], usuarioLogueado)) {
        postBody += "<input type='button' value='Aprobar' id='" + pos + "'>";
      } else {
        postBody +=
          "<input type='button' class='deshabilitado' id='" +
          pos +
          "' value='Aprobar' disabled>";
      }
      if (!fueDenunciada(listaPublicaciones[pos], usuarioLogueado)) {
        postBody +=
          "<input type='button' value='Denunciar' id='d" +
          pos +
          "'></div></div>";
      } else {
        postBody +=
          "<input type='button' class='deshabilitado' id='d" +
          pos +
          "' value='Denunciar' disabled>";
      }
      $("#muro").append(postBody);
      $("#" + pos).click(btnAprobar);
      $("#d" + pos).click(btnDenuncia);
    }
  }
}
function mostrarMuroAdmin() {
  ocultarMuro();
  $("#btnCerrarSesion").show();
  $("#muro").show();
  $("#muro").empty();
  $("#btnDenunciados").show();

  crearListaAdm(listaPublicaciones);
  usuarioLogueado._10mas.sort((a, b) => b.aprobacion - a.aprobacion);

  let postBody = "";
  for (let pos = 0; pos < usuarioLogueado._10mas.length; pos++) {
    if (usuarioLogueado._10mas[pos].usuarioAutor.activo === true) {
      postBody +=
        '<div class="post"><div class="post-type"><span>Publica</span></div>';
    } else {
      postBody +=
        '<div class="post"><div class="post-type"><span>Privada</span></div>';
    }
    postBody +=
      '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
      usuarioLogueado._10mas[pos].usuarioAutor.foto +
      '"  width="50"></td></tr><td><label class="nombre">' +
      usuarioLogueado._10mas[pos].usuarioAutor.nombre +
      "</label><br><label class='ciudad'> " +
      usuarioLogueado._10mas[pos].usuarioAutor.ciudad +
      "</td></tr></tbody></table></div>";
    postBody +=
      '<div class="post-text"><h4> ' +
      usuarioLogueado._10mas[pos].titulo +
      "</h4>";
    postBody += "<p> " + usuarioLogueado._10mas[pos].texto + "</p></div>";
    postBody +=
      '<div class="post-image"> <img src="imagenes/' +
      usuarioLogueado._10mas[pos].imagen +
      '" width="100" alt="' +
      usuarioLogueado._10mas[pos].imagen +
      '"></div>';
    postBody +=
      "<div class='post-actions'><p> " +
      usuarioLogueado._10mas[pos].aprobacion +
      " aprobaciones <p></div></div></div></div>";
  }
  $("#muro").append(postBody);
}
function mostrarContactos() {
  ocultarMuro();
  ocultarBotones();
  $("#btnCerrarSesion").show();
  $("#divFrmContactos").show();

  $("#contactosTotales").empty();
  for (let i = 0; i < listaUsuarios.length; i++) {
    let postBody = "";
    if (
      listaUsuarios[i] !== usuarioLogueado &&
      !noEnListaDeSolicitudes(listaUsuarios[i]) &&
      !noEnListaDeContactos(listaUsuarios[i]) &&
      listaUsuarios[i].activo === true
    ) {
      postBody +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        listaUsuarios[i].foto +
        '" width="50"></td></tr><td><label class="nombre">' +
        listaUsuarios[i].nombre +
        " " +
        listaUsuarios[i].apellido +
        "</label><br><label class='ciudad'></td></tr></tbody></table></div>";
      postBody +=
        "<input type='button' value='Enviar solicitud' id='s" + i + "'>";
      $("#contactosTotales").append(postBody);
      $("#s" + i).click(enviarSolicitud);
    }
  }
  $("#contactosSolicitud").empty();
  let postBody2 = "";
  if (usuarioLogueado.solicitudAmistad.length === 0) {
    postBody2 = "<p> No tenés solicitudes de amistad </p>";
    $("#contactosSolicitud").html(postBody2);
  } else {
    for (let j = 0; j < usuarioLogueado.solicitudAmistad.length; j++) {
      postBody2 +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        usuarioLogueado.solicitudAmistad[j].foto +
        '" width="50"></td></tr><td><label class="nombre">' +
        usuarioLogueado.solicitudAmistad[j].nombre +
        " " +
        usuarioLogueado.solicitudAmistad[j].apellido +
        "</label><br><label class='ciudad'></td></tr></tbody></table></div>";
      postBody2 += "<input type='button' value='Aceptar' id='a" + j + "'>";
      postBody2 += "<input type='button' value='Rechazar' id='r" + j + "'>";
      $("#contactosSolicitud").html(postBody2);
      $("#a" + j).click(aceptarContacto);
      $("#r" + j).click(rechazarContacto);
    }
  }
  $("#contactosAgregados").empty();
  let postBody3 = "";
  if (
    usuarioLogueado.contactos.length === 0 ||
    usuarioLogueado.contactos.length === undefined
  ) {
    postBody3 = "<p> No tiene amigos agregados</p>";
    $("#contactosAgregados").append(postBody3);
  } else {
    for (let h = 0; usuarioLogueado.contactos.length; h++) {
      postBody3 +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        usuarioLogueado.contactos[h].foto +
        '" width="50"></td></tr><td><label class="nombre">' +
        usuarioLogueado.contactos[h].nombre +
        " " +
        usuarioLogueado.contactos[h].apellido +
        "</label><br><label class='ciudad'></td></tr></tbody></table></div>";
      postBody3 += "<input type='button' value='Eliminar' id='e" + h + "'>";
      $("#contactosAgregados").html(postBody3);
      $("#e" + h).click(eliminarContacto);
    }
  }
}
function mostrarDenunciados() {
  ocultarMuro();
  ocultarBotones();
  $("#btnCerrarSesion").show();
  $("#divFrmDenunciados").show();

  $("#divFrmDenunciados").empty();

  let postBody = "<p> No cuenta con usuarios Denunciados";
  $("#divFrmDenunciados").append(postBody);
  for (let i = 0; i < listaUsuarios.length; i++) {
    if (listaUsuarios[i].denuncia >= 5 && listaUsuarios[i].activo == true) {
      postBody = "";
      postBody +=
        '<div class="user-data"><table><tbody><tr><td rowspan="2"><img src="imagenes/' +
        listaUsuarios[i].foto +
        '" width="50"></td></tr><td><label class="nombre">' +
        listaUsuarios[i].nombre +
        " " +
        listaUsuarios[i].apellido +
        "</label><br><label class='ciudad'></td></tr></tbody></table></div>";
      postBody +=
        "<input type='button' value='Desactivar Usuario' id='du" + i + "'>";
      $("#divFrmDenunciados").html(postBody);
      $("#du" + i).click(desactivarUsuario);
    }
  }
}
function btnPublicacion() {
  let titulo = $("#txtTitulo").val();
  let texto = $("#txtTexto").val();
  let publica = $("#slcPublica").val();
  if (publica === "true") {
    publica = true;
  } else {
    publica = false;
  }
  let imagen = obtenerNombreArchivo($("#txtImagen").val());
  let autor = usuarioLogueado;
  let lTitulo = titulo.length;
  let lTexto = texto.length;
  if (lTitulo <= 50 && lTexto <= 120) {
    agregarPublicacion(titulo, texto, imagen, publica, autor);
    mensaje = "Publicacion Exitosa";
    limpiarCamposPublucacion();
    mostrarMuroPersona();
  } else {
    mensaje = "Largo de titulo y/o texto supera el maximo";
    $("#mensajePublicacion").html(mensaje);
  }
}
function limpiarCamposPublucacion() {
  $("#txtTitulo").val("");
  $("#txtTexto").val("");
  $("#slcPublica").val("");
  $("#txtImagen").val("");
}
function btnCerrarSesion() {
  $("#user-header").html("");
  $("#muro").html("");

  usuarioLogueado = null;
  mostrarMuroInvitado();
}
//AUXILIARES
function publicacionesPrivadasContactos(publicacion) {
  let i = 0;
  let res = false;

  while (i < usuarioLogueado.contactos.length && !res) {
    if (publicacion.usuarioAutor === usuarioLogueado.contactos[i]) {
      res = true;
    }
    i++;
  }

  return res;
}
function compararContrasenia(pass, repass) {
  return (res = pass.localeCompare(repass));
}
function rechazarContacto() {
  let j = Number($(this).attr("id").substring(1));
  $("#r" + j).prop("disabled", "disabled");
  $("#r" + j).addClass("deshabilitado");
  usuarioLogueado.solicitudAmistad.splice(j, 1);
  $("#contactosSolicitud").empty();
  mostrarContactos();
}
function aceptarContacto() {
  let j = Number($(this).attr("id").substring(1));
  usuarioLogueado.contactos.push(usuarioLogueado.solicitudAmistad[j]);
  usuarioLogueado.solicitudAmistad[j].contactos.push(usuarioLogueado);
  usuarioLogueado.solicitudAmistad.splice(j, 1);
  $("#contactosSolicitud").empty();
  mostrarContactos();
}
function eliminarContacto() {
  let h = Number($(this).attr("id").substring(1));
  $("#e" + h).prop("disabled", "disabled");
  $("#e" + h).addClass("deshabilitado");
  usuarioLogueado.contactos.splice(h, 1);
  $("#contactosAgregados").empty();
  mostrarContactos();
}
function desactivarUsuario() {
  let i = Number($(this).attr("id").substring(2));
  $("#du" + i).prop("disabled", "disabled");
  $("#du" + i).addClass("deshabilitado");
  $("#du" + i).val("Usuario Desactivado");
  listaUsuarios[i].activo = false;
}
function verificarLoginUsuario(mail, pass) {
  let encontrado = false;
  let res = -1;
  let pos = 0;
  while (pos < listaUsuarios.length && !encontrado) {
    let user = listaUsuarios[pos];
    if (user.correo === mail && user.contraseña === pass) {
      encontrado = true;
      res = pos;
    }
    pos++;
  }
  return res;
}

function noEnListaDeSolicitudes(usuario) {
  let i = 0;
  let res = false;
  while (i < usuario.solicitudAmistad.length && !res) {
    if (usuario !== usuario.solicitudAmistad[i]) {
      res = true;
    }
    i++;
  }
  return res;
}
function noEnListaDeContactos(usuario) {
  let i = 0;
  let res = false;
  while (i < usuario.contactos.length && !res) {
    if (usuario !== usuario.contactos[i]) {
      res = true;
    }
    i++;
  }
  return res;
}

function fueAprobada(unaPublicacion, usuarioLogueado) {
  let pos = 0;
  let fue = false;
  while (pos < unaPublicacion.aprobadaPor.length && !fue) {
    if (unaPublicacion.aprobadaPor[pos] == usuarioLogueado) {
      fue = true;
    }
    pos++;
  }
  return fue;
}
function fueDenunciada(unaPublicacion, usuarioLogueado) {
  let pos = 0;
  let fue = false;
  while (pos < unaPublicacion.denunciadaPor.length && !fue) {
    if (unaPublicacion.denunciadaPor[pos] == usuarioLogueado) {
      fue = true;
    }
    pos++;
  }
  return fue;
}
function verificarLoginAdmin(mail, pass) {
  let encontrado = false;
  let res = false;
  let pos = 0;
  while (pos < listaAdm.length && !encontrado) {
    let user = listaAdm[pos];
    if (user.correo === mail && user.contraseña === pass) {
      encontrado = true;
      res = pos;
    }
    pos++;
  }
  return res;
}
function validacionRegistroContraseña(pass) {
  let i = 0;
  let res = false;

  if (pass.length > 6) {
    while (i < pass.length && res === false) {
      if (pass[i] != " " && verificarNumero(pass) && verificarLetra(pass)) {
        res = true;
      }
    }
    return res;
  }
}
function verificarNumero(pass) {
  var num = /\d+/;
  let res = false;
  for (let i = 0; i < pass.length; i++) {
    if (pass[i].match(num)) {
      res = true;
    }
  }
  return res;
}
function verificarLetra(pass) {
  let res = false;
  for (let i = 0; i < pass.length; i++) {
    if (
      (pass[i].charCodeAt() >= 65 && pass[i].charCodeAt() <= 90) ||
      (pass[i].charCodeAt() >= 97 && pass[i].charCodeAt() <= 122)
    ) {
      res = true;
    }
  }
  return res;
}
function validacionRegistroMail(pass) {
  let res = false;
  for (let i = 0; i < pass.length; i++) {
    if (pass[i] === "@" && pass.indexOf("@") > 0) {
      res = true;
    }
  }
  return res;
}
function obtenerNombreArchivo(ruta) {
  let separador = ruta.lastIndexOf("\\");
  let res = ruta.substring(separador + 1);
  return res;
}
function enviarSolicitud() {
  let i = Number($(this).attr("id").substring(1));
  $("#s" + i).prop("disabled", "disabled");
  $("#s" + i).addClass("deshabilitado");
  $("#s" + i).val("Solicitud enviada");
  listaUsuarios[i].solicitudAmistad.push(usuarioLogueado);
}
function crearListaAdm(lista) {
  usuarioLogueado._10mas.length = 0;
  for (let i = 0; i < lista.length; i++) {
    usuarioLogueado._10mas.push(lista[i]);
  }
}

//BOTONES PUBLICACIONES
function btnAprobar() {
  let i = Number($(this).attr("id"));
  listaPublicaciones[i].aprobacion++;
  listaPublicaciones[i].aprobadaPor.push(usuarioLogueado);
  mostrarMuroPersona();
}

function btnDenuncia() {
  let i = Number($(this).attr("id").substring(1));
  listaPublicaciones[i].usuarioAutor.denuncia++;
  listaPublicaciones[i].denunciadaPor.push(usuarioLogueado);
  mostrarMuroPersona();
}
//PRECARGAS
function precargaUsuarioYAdmin() {
  agregarUsuarioPersona(
    "Elias",
    "Palgi",
    "elias@gmail.com",
    "Montevideo",
    "Uruguay",
    "mauro.jpg",
    "eliaselias1"
  );
  agregarUsuarioPersona(
    "Mauro",
    "Palgi",
    "mauro@gmail.com",
    "Montevideo",
    "Uruguay",
    "mauro.jpg",
    "mauromauro1"
  );
  agregarUsuarioPersona(
    "Carlos",
    "Tambasco",
    "carlos@gmail.com",
    "Montevideo",
    "Uruguay",
    "carlos.jpg",
    "carloscarlos1"
  );
  agregarUsuarioPersona(
    "Darth",
    "Vader",
    "vader@gmail.com",
    "Estrella de la Muerte",
    "Otra Galaxia",
    "darth.jpg",
    "vadervader1"
  );
  agregarUsuarioPersona(
    "Carlos",
    "Tevez",
    "tevez@gmail.com",
    "Manchester",
    "Inglaterra",
    "tevez.jpg",
    "teveztevez1"
  );
  agregarUsuarioPersona(
    "Diego Armando",
    "Maradona",
    "diego@gmail.com",
    "Sinaloa",
    "Mexico",
    "diego.jpg",
    "diegodiego1"
  );
  agregarUsuarioPersona(
    "Carlos",
    "Menem",
    "menem@gmail.com",
    "Buenos Aires",
    "Argentina",
    "carlosmenem.jpg",
    "menemmenem1"
  );
  agregarUsuarioAdm("Mauro", "mauroadmin1", "mauroadmin@gmail.com");
  agregarUsuarioAdm("Carlos", "carlosadmin1", "carlosadmin@gmail.com");
}

function precargaPublicaciones() {
  agregarPublicacion(
    "Vuelos espaciales",
    "Se va a licitar un sistema de vuelos espaciales, mediante el cual desde una plataforma que quizá se instale en la provincia de Córdoba. Esas naves espaciales, con todas las seguridades habidas y por haber, van a salir de la atmósfera, se van a remontar a la estratósfera, y desde ahí elegir el lugar a donde quieran ir. De tal forma, que en una hora y media podremos estar desde Argentina en Japón, Corea o en cualquier parte del mundo. Y por supuesto, los vuelos hacia otros planetas, el día que se detecte, de que en otros planetas también hay vida.",
    "espacio.jpg",
    true,
    listaUsuarios[6]
  );
  agregarPublicacion(
    "Dicen que...",
    "Hoy es un excelente día para entregar el obligatorio de P1.",
    "foto.jpg",
    true,
    listaUsuarios[1]
  );
  agregarPublicacion(
    "Estamos mal, pero vamos bien",
    "I've been fuckin' hoes and poppin' pillies, Man, I feel just like a rockstar.",
    "ferrari.jpg",
    true,
    listaUsuarios[6]
  );
  agregarPublicacion(
    "Pese a todo y contra todo, seguimos remando",
    "Síganme, no los voy a defraudar.",
    "menem.jpg",
    true,
    listaUsuarios[6]
  );
  agregarPublicacion(
    "Socrates",
    "Mi libro de cabecera son las obras completas de Sócrates",
    "socrates.jpg",
    false,
    listaUsuarios[4]
  );
  agregarPublicacion(
    "Transformación positiva",
    "Todos, en mayor o menor medida, somos responsables y copartícipes de este fracaso argentino y entre todos, sólo entre todos, seremos artífices de un cambio a fondo y de una transformación positiva.",
    "rick.jpg",
    false,
    listaUsuarios[6]
  );
  agregarPublicacion(
    "Eeeeeeeh eeeeeh eeh",
    "Eeeeeh Messi, eeeeeh, eeeeh eh.",
    "maradona.jpg",
    true,
    listaUsuarios[5]
  );
  agregarPublicacion(
    "Dicen que...",
    "Hoy es un día maravilloso para seguir con el obligatorio de PC.",
    "sky.jpg",
    true,
    listaUsuarios[2]
  );
  agregarPublicacion(
    "Kjjjjjh",
    "Yo soy tu padre.",
    "darth2.jpg",
    true,
    listaUsuarios[3]
  );
  agregarPublicacion(
    "Is very difficult",
    "Is a emocion tu big for me.",
    "tevez2.jpg",
    true,
    listaUsuarios[4]
  );
  agregarPublicacion(
    "Menem lo hizo!",
    "En estos momentos de turbulencia, les voy a dar dos consejos. Como lo hacía Julio César, ese emperador romano. Con el miedo de los tripulantes, los juntaba y les decía 'no temáis, vais con César y su estrella'. Y yo les digo a todos los argentinos: 'no teman, ¡van con Carlos Menem y su estrella!.",
    "caesar.jpg",
    true,
    listaUsuarios[6]
  );
}
//MÉTODOS DE AGREGADO
function agregarUsuarioPersona(
  pNombre,
  pApellido,
  pCorreo,
  pCiudad,
  pPais,
  pFoto,
  pContraseña
) {
  let user = new usuarioPersona(
    pNombre,
    pApellido,
    pCorreo,
    pCiudad,
    pPais,
    pFoto,
    pContraseña
  );
  listaUsuarios.push(user);
}

function agregarUsuarioAdm(pNombre, pContraseña, pCorreo) {
  let userAdm = new usuarioAdm(pNombre, pContraseña, pCorreo);
  listaAdm.push(userAdm);
}

function agregarPublicacion(pTitulo, pTexto, pImagen, pPublica, pUsuarioAutor) {
  let addPubli = new publicacion(
    pTitulo,
    pTexto,
    pImagen,
    pPublica,
    pUsuarioAutor
  );
  listaPublicaciones.push(addPubli);
}

//! CODIGO QUE PUEDE ESTAR MAL

// FIJARSE LA PARTE DE ADMINS QUE PUEDE ESTAR PODRIDA
