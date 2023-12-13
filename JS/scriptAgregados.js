document.addEventListener("DOMContentLoaded", function () {
  // Llamadas a funciones al cargar el DOM
  displayUserInfo();
  cerrarSesion();
  agregarEventosProductos();
  actualizarInterfaz();

  const procesarPagoBtn = document.getElementById("procesar-pago-btn");
  const modal = document.getElementById("modalProcesarPago");
  const closeModalBtn = document.getElementsByClassName("close")[0];
  const totalContainer = document.getElementById("totalContainer");
  const totalAmountSpan = document.getElementById("totalAmount");
  const tarjetaContainer = document.getElementById("tarjetaContainer");
  const confirmarPagoBtn = document.getElementById("confirmarPagoBtn");
  const numTarjetaInput = document.getElementById("numTarjeta");
  const aceptarReciboBtn = document.getElementById("aceptarReciboBtn");
  const imprimirReciboBtn = document.getElementById("imprimirReciboBtn");
  const reciboSection = document.querySelector(".recibo");

  procesarPagoBtn.addEventListener("click", function () {
    modal.style.display = "block";
    mostrarTotal(); // Mostrar total al abrir el modal
  });

  closeModalBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  const pagoEfectivoBtn = document.getElementById("pagoEfectivoBtn");
  const pagoTransferenciaBtn = document.getElementById("pagoTransferenciaBtn");

  pagoEfectivoBtn.addEventListener("click", function () {
    realizarPago("Pago en Efectivo");
  });

  pagoTransferenciaBtn.addEventListener("click", function () {
    // Al seleccionar "Pago por Transferencia", mostrar el total y el campo de la tarjeta
    mostrarTotal();
    mostrarTarjetaInput();
  });

  confirmarPagoBtn.addEventListener("click", function () {
    // Obtener el número de tarjeta ingresado
    const numTarjeta = numTarjetaInput.value;

    // Validar que se haya ingresado un número de tarjeta
    if (!numTarjeta.trim()) {
      alert("Por favor, ingrese el número de tarjeta.");
      return;
    }

    // Realizar el pago con los datos ingresados
    const metodoPago = "Pago por Transferencia";
    realizarPago(metodoPago, numTarjeta);

    // Mostrar el recibo después de realizar el pago
    mostrarRecibo();
  });

  aceptarReciboBtn.addEventListener("click", function () {
    // Al hacer clic en "Aceptar Recibo", ocultar el botón y mostrar el recibo
    mostrarRecibo();
  });

  imprimirReciboBtn.addEventListener("click", function () {
    // Al hacer clic en "Imprimir Recibo", realizar acciones de impresión y descarga de imagen
    alert("Generando recibo...");

    // Ocultar todos los elementos excepto el recibo
    ocultarElementosExceptoRecibo();

    // Obtener las dimensiones del recibo
    const reciboRect = reciboSection.getBoundingClientRect();
    const reciboAncho = reciboRect.width;
    const reciboAlto = reciboRect.height;

    // Capturar el contenido del recibo con html2canvas y especificar las dimensiones
    html2canvas(reciboSection, { width: reciboAncho, height: reciboAlto }).then(
      function (canvas) {
        // Crear un enlace de descarga
        const link = document.createElement("a");
        link.href = canvas.toDataURL();
        link.download = "recibo.png";

        // Simular un clic en el enlace para iniciar la descarga
        link.click();

        // Limpiar el carrito y restablecer la interfaz después de imprimir y descargar el recibo
        limpiarCarrito();
      }
    );
  });

  // Función para ocultar todos los elementos excepto el recibo
  function ocultarElementosExceptoRecibo() {
    const elementosAOcultar = document.querySelectorAll(
      ".productos-agregados, .total, .user-info, #procesar-pago-btn, #modalProcesarPago"
    );

    elementosAOcultar.forEach((elemento) => {
      elemento.style.display = "none";
    });

    // Mostrar solo el recibo
    reciboSection.style.display = "block";
  }

  // Función para mostrar el total
  function mostrarTotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce(
      (acc, producto) => acc + producto.cantidad * producto.precio,
      0
    );
    totalAmountSpan.textContent = total.toFixed(2);
    totalContainer.style.display = "block";
  }

  // Función para mostrar el campo de ingreso de tarjeta
  function mostrarTarjetaInput() {
    tarjetaContainer.style.display = "block";
    confirmarPagoBtn.style.display = "block";
  }

  // Función para realizar el pago
  function realizarPago(metodoPago, numTarjeta) {
    alert(
      `Procesando pago...\nMétodo de pago: ${metodoPago}\nNúmero de Tarjeta: ${
        numTarjeta || "N/A"
      }`
    );
    modal.style.display = "none";
  }

  // Función para mostrar el recibo
  function mostrarRecibo() {
    // Configurar la fecha y hora actual
    const fechaHoraActual = new Date();
    const fechaHoraString = `${fechaHoraActual.toLocaleDateString()} ${fechaHoraActual.toLocaleTimeString()}`;
    document.getElementById(
      "fechaHora"
    ).textContent = `Fecha: ${fechaHoraString}`;

    // Obtener la información del cliente (puedes adaptar esto según tu lógica)
    const loggedInUser = localStorage.getItem("loggedInUser");
    const usersData = JSON.parse(localStorage.getItem("users")) || [];
    const currentUser = usersData.find(
      (user) => user.username === loggedInUser
    );

    if (currentUser) {
      document.getElementById(
        "cliente"
      ).textContent = `Cliente: ${currentUser.nombres} ${currentUser.apellidos}`;
    }

    // Obtener los productos del carrito
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Mostrar los productos en el detalle del recibo
    const detalleProductos = document.getElementById("detalleProductos");
    detalleProductos.innerHTML = "";
    carrito.forEach((producto) => {
      const filaProducto = document.createElement("tr");
      filaProducto.innerHTML = `
        <td>${producto.nombre}</td>
        <td>$${(producto.precio).toFixed(2)}</td>
        <td>${producto.cantidad}</td>
        <td>$${(producto.cantidad * producto.precio).toFixed(2)}</td>
      `;
      detalleProductos.appendChild(filaProducto);
    });

    // Calcular y mostrar el total en el recibo
    const totalRecibo = document.getElementById("totalRecibo");
    const total = carrito.reduce(
      (acc, producto) => acc + producto.cantidad * producto.precio,
      0
    );
    totalRecibo.textContent = `Total: $${total.toFixed(2)}`;

    // Mostrar la sección de recibo
    reciboSection.style.display = "block";

    // Ocultar el botón "Aceptar Recibo" y mostrar el botón "Imprimir Recibo"
    aceptarReciboBtn.style.display = "none";
    imprimirReciboBtn.style.display = "block";
  }

  // Función para limpiar el carrito y restablecer la interfaz
  function limpiarCarrito() {
    localStorage.removeItem("carrito");
    actualizarInterfaz(); // Restablecer la interfaz después de limpiar el carrito
  }

  function displayUserInfo() {
    var loggedInUser = localStorage.getItem("loggedInUser");
    var usersData = JSON.parse(localStorage.getItem("users")) || [];
    var currentUser = usersData.find((user) => user.username === loggedInUser);

    if (currentUser) {
      var userInfoSection = document.querySelector(".user-info");
      userInfoSection.innerHTML = `
        <p>Cédula: ${currentUser.cedula}</p>
        <p>Nombres: ${currentUser.nombres}</p>
        <p>Apellidos: ${currentUser.apellidos}</p>
        <p>Ciudad: ${currentUser.ciudad}</p>
      `;
    }
  }

  function cerrarSesion() {
    var loggedInUser = localStorage.getItem("loggedInUser");
    var loginStatusElement = document.getElementById("login-status");

    if (loggedInUser) {
      loginStatusElement.innerHTML = "Cerrar Sesión - " + loggedInUser;
    } else {
      loginStatusElement.innerHTML = "Inicio de Sesión";
    }

    loginStatusElement.addEventListener("click", function () {
      var confirmation = confirm(
        "¿Estás seguro de que deseas cerrar sesión?"
      );

      if (confirmation) {
        localStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
      }
    });
  }

  function agregarEventosProductos() {
    const productosAgregadosSection = document.querySelector(
      ".productos-agregados"
    );

    productosAgregadosSection.addEventListener("click", function (event) {
      if (event.target.classList.contains("eliminar-producto-btn")) {
        const productId = event.target.dataset.productId;
        const confirmacion = window.confirm(
          "¿Estás seguro de que deseas eliminar este producto?"
        );

        if (confirmacion) {
          eliminarProducto(productId);
          actualizarInterfaz();
          window.alert("Producto eliminado");
        }
      }
    });
  }

  function eliminarProducto(productId) {
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    carrito = carrito.filter((producto) => producto.id !== productId);
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }

  function actualizarInterfaz() {
    const productosAgregadosSection = document.querySelector(
      ".productos-agregados"
    );
    const totalSection = document.querySelector(".total");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    productosAgregadosSection.innerHTML = "";

    carrito.forEach((producto) => {
      const productoElement = document.createElement("div");
      productoElement.classList.add("producto-agregado");

      const subtotal = producto.cantidad * producto.precio;

      productoElement.innerHTML = `
        <h3>${producto.nombre}</h3>
        <p>Precio: $${producto.precio.toFixed(2)}</p>
        <p>Cantidad: ${producto.cantidad}</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
        <button class="eliminar-producto-btn" data-product-id="${
          producto.id
        }">Eliminar</button>
      `;

      productosAgregadosSection.appendChild(productoElement);
    });

    const total = carrito.reduce(
      (acc, producto) => acc + producto.cantidad * producto.precio,
      0
    );
    totalSection.innerHTML = `<p>Total: $${total.toFixed(2)}</p>`;
  }
});
