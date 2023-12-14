// script.js

// Lista de rutas de imágenes
const imagenes = [
    "IMG//homepage2.webp",
    "IMG//homepage3.webp",
    "IMG//homepage4.webp",
    "IMG//homepage5.webp"
  ];
  
  // Índice de la imagen actual
  let indiceImagen = 0;
  
  // Función para cambiar la imagen
  function cambiarImagen() {
    // Obtener el elemento de la imagen
    const imagenElement = document.getElementById("imagen");
  
    // Cambiar la ruta de la imagen
    imagenElement.src = imagenes[indiceImagen];
  
    // Incrementar el índice o reiniciarlo si alcanza el final de la lista
    indiceImagen = (indiceImagen + 1) % imagenes.length;
  }
  
  // Cambiar la imagen cada 3000 milisegundos (3 segundos)
  setInterval(cambiarImagen, 4000);
  
  function irAIniciarSesion() {
    // Cambiar la URL a la página de inicio de sesión
    window.location.href = "login.html";
  }
  
  function irACrearCuenta() {
    // Cambiar la URL a la página de creación de cuenta
    window.location.href = "register.html";
  }
  