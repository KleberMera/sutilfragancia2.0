document.addEventListener("DOMContentLoaded", function () {
  MonitoreodeLogin();
  MonitoreodeProductos();
  ProductosAgregaos();
  descripcionProductos();
});

function MonitoreodeLogin() {
  // Verificar si hay un usuario autenticado almacenado en localStorage
  var loggedInUser = localStorage.getItem("loggedInUser");
  var loginStatusElement = document.getElementById("login-status");

  if (loggedInUser) {
    // Si hay un usuario autenticado, mostrar "Cerrar Sesión" y el nombre de usuario
    loginStatusElement.innerHTML = "Cerrar Sesión - " + loggedInUser;
  } else {
    // Si no hay un usuario autenticado, mostrar "Inicio de Sesión"
    loginStatusElement.innerHTML = "Inicio de Sesión";
  }

  loginStatusElement.addEventListener("click", function () {
    var confirmation = confirm("¿Estás seguro de que deseas cerrar sesión?");

    if (confirmation) {
      // Limpiar el usuario autenticado al cerrar sesión
      localStorage.removeItem("loggedInUser");

      // Redirigir al índice u otra página
      window.location.href = "index.html";
    }
  });
}

function MonitoreodeProductos() {
  // Obtener todos los elementos con la clase "producto"
  const productos = document.querySelectorAll(".producto");

  productos.forEach((producto) => {
    const cantidadElement = producto.querySelector(".cantidad");
    const menosBtn = producto.querySelector(".menos");
    const masBtn = producto.querySelector(".mas");
    const agregarCarritoBtn = producto.querySelector(".agregar-carrito-btn");
    const agregadoBtn = producto.querySelector(".agregado-btn");
    const disponibilidadElement = producto.querySelector(
      ".disponibilidad span"
    );

    let cantidadDisponible = parseInt(disponibilidadElement.innerText);

    menosBtn.addEventListener("click", function () {
      if (parseInt(cantidadElement.innerText) > 1) {
        cantidadElement.innerText = parseInt(cantidadElement.innerText) - 1;
      }
    });

    masBtn.addEventListener("click", function () {
      if (parseInt(cantidadElement.innerText) < cantidadDisponible) {
        cantidadElement.innerText = parseInt(cantidadElement.innerText) + 1;
      }
    });

    agregarCarritoBtn.addEventListener("click", function () {
      const cantidadSeleccionada = parseInt(cantidadElement.innerText);

      // Verificar si el producto ya está agregado
      if (agregadoBtn.style.display === "inline-block") {
        // Mostrar un mensaje usando la función alert()
        showModal("Este producto ya está en tu carrito. ¡Elige otro producto!");
        //alert("Este producto ya está en tu carrito. ¡Elige otro producto!");
        return; // Salir de la función sin ejecutar el resto del código
      }

      if (
        cantidadSeleccionada > 0 &&
        cantidadSeleccionada <= cantidadDisponible
      ) {
        cantidadDisponible -= cantidadSeleccionada;
        disponibilidadElement.innerText = cantidadDisponible;
        //cantidadElement.innerText = "0";
        agregarCarritoBtn.style.display = "none";
        agregadoBtn.style.display = "inline-block";

        showModal("Producto agregado al carrito. ¡Elige más productos!");
        // Mostrar un mensaje usando la función alert()
        //alert("Producto agregado al carrito. ¡Elige más productos!");
      }
    });
  });
}

function ProductosAgregaos() {
  // Obtén la sección de productos
  const productosSection = document.querySelector(".productos");

  // Agrega un solo manejador de clics para toda la sección de productos
  productosSection.addEventListener("click", function (event) {
    // Verifica si el clic se realizó en un botón de "Agregar al Carrito"
    if (event.target.classList.contains("agregar-carrito-btn")) {
      // Encuentra el artículo (producto) al que pertenece el botón
      const productoElement = event.target.closest(".producto");

      // Obtén la información del producto desde el artículo
      const producto = {
        id: productoElement.id,
        nombre: productoElement.querySelector("h2").innerText,
        precio: parseFloat(
          productoElement.querySelector(".precio").innerText.replace("$", "")
        ),
        cantidad: parseInt(
          productoElement.querySelector(".cantidad").innerText
        ),
      };

      // Lógica para agregar el producto al carrito
      agregarAlCarrito(producto);
    }
  });
}

function agregarAlCarrito(producto) {
  // Obtén el carrito desde el localStorage
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verifica si el producto ya está en el carrito
  const productoExistente = carrito.find((p) => p.id === producto.id);

  if (productoExistente) {
    // Si el producto ya está en el carrito, actualiza la cantidad
    productoExistente.cantidad += producto.cantidad;
  } else {
    // Si el producto no está en el carrito, agrégalo
    carrito.push(producto);
  }

  // Almacena el carrito actualizado en el localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Ejemplo: Imprimir el carrito en la consola
  console.log("Carrito actualizado:", carrito);
}

function descripcionProductos() {
  const productos = document.querySelectorAll(".producto");

  productos.forEach((producto) => {
    const descripcion = producto.querySelector(".descripcion");
    const contenidoCompleto = descripcion.querySelector(".contenido-completo");

    // Agrega un manejador de clic para mostrar/ocultar el contenido completo
    descripcion.addEventListener("click", function () {
      contenidoCompleto.style.display =
        contenidoCompleto.style.display === "none" ? "inline" : "none";
    });
  });
}

function showModal(message) {
  const modal = document.getElementById("myModal");
  const modalMessage = document.getElementById("modal-message");

  // Mostrar el mensaje en el modal
  modalMessage.innerText = message;

  // Mostrar el modal
  modal.style.display = "block";

  // Agregar un manejador de clic para cerrar el modal
  const closeButton = document.getElementsByClassName("close")[0];
  closeButton.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Cierra el modal después de 3 segundos (puedes ajustar este tiempo)
  setTimeout(function () {
    modal.style.display = "none";
  }, 3000);
}
