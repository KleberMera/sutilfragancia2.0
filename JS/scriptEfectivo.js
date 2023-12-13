document.addEventListener("DOMContentLoaded", function () {
  const pagoEfectivoBtn = document.getElementById("pagoEfectivoBtn");
  const montoEfectivoInput = document.getElementById("montoEfectivo");
  const confirmarPagoEfectivoBtn = document.getElementById(
    "confirmarPagoEfectivoBtn"
  );

  pagoEfectivoBtn.addEventListener("click", function () {
    mostrarTotal();
    mostrarSeccionPagoEfectivo();
  });

  confirmarPagoEfectivoBtn.addEventListener("click", function () {
    const montoIngresado = parseFloat(montoEfectivoInput.value);

    if (isNaN(montoIngresado) || montoIngresado < 0) {
      alert("Por favor, ingrese un monto válido.");
      return;
    }

    const total = parseFloat(
      document.getElementById("totalAmount").textContent
    );

    if (montoIngresado === total) {
      // Monto igual al total, proceder al pago
      alert("Pago realizado con éxito. Puede imprimir el recibo.");
      mostrarRecibo(); // Asegúrate de llamar a mostrarRecibo aquí
    } else if (montoIngresado > total) {
      // Monto mayor al total, mostrar cambio y proceder al pago
      const cambio = montoIngresado - total;
      alert(`Pago realizado con éxito. Cambio: $${cambio.toFixed(2)}`);
      mostrarRecibo(); // Asegúrate de llamar a mostrarRecibo aquí
    } else {
      // Monto menor al total, no permitir el pago
      alert("El monto ingresado es insuficiente. Verifique el monto.");
    }
  });

  function mostrarSeccionPagoEfectivo() {
    const pagoEfectivoSection = document.querySelector(".pago-efectivo");
    pagoEfectivoSection.style.display = "block";
  }

  function mostrarTotal() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce(
      (acc, producto) => acc + producto.cantidad * producto.precio,
      0
    );
    document.getElementById("totalAmount").textContent = total.toFixed(2);
    document.getElementById("totalContainer").style.display = "block";
  }

  function mostrarRecibo() {
    alert("Generando recibo...");
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
    const aceptarReciboBtn = document.getElementById("aceptarReciboBtn");
    const detalleProductos = document.getElementById("detalleProductos");
    detalleProductos.innerHTML = "";
    carrito.forEach((producto) => {
      const filaProducto = document.createElement("tr");
      filaProducto.innerHTML = `
      <td>${producto.nombre}</td>
      <td>$${producto.precio.toFixed(2)}</td>
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

    // Obtener el monto ingresado en efectivo
    const montoIngresado = parseFloat(
      document.getElementById("montoEfectivo").value
    );

    // Verificar si hay cambio y mostrarlo en rojo
    if (!isNaN(montoIngresado) && montoIngresado > total) {
      const cambio = montoIngresado - total;
      totalRecibo.innerHTML = `Total: $${total.toFixed(
        2
      )}<br>Cambio: $${cambio.toFixed(2)}`;
      totalRecibo.style.color = "#FF0000"; // Color rojo
    } else {
      totalRecibo.textContent = `Total: $${total.toFixed(2)}`;
      totalRecibo.style.color = "#333"; // Restablecer el color a oscuro
    }

    const elementosAOcultar = document.querySelectorAll(
      ".productos-agregados, .pago-efectivo, .total, .user-info, #procesar-pago-btn, #modalProcesarPago"
    );

    elementosAOcultar.forEach((elemento) => {
      elemento.style.display = "none";
    });

    // Mostrar la sección de recibo
    const reciboSection = document.querySelector(".recibo");
    reciboSection.style.display = "block";

    // Ocultar el botón "Aceptar Recibo" y mostrar el botón "Imprimir Recibo"
    aceptarReciboBtn.style.display = "none";
    imprimirReciboBtn.style.display = "block";
  }
});
