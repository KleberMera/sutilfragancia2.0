function registerUser() {
  var cedula = document.getElementById("cedula").value;
  var nombres = document.getElementById("nombres").value;
  var apellidos = document.getElementById("apellidos").value;
  var fechaNacimiento = document.getElementById("fechaNacimiento").value;
  var nacionalidad = document.getElementById("nacionalidad").value;
  var ciudad = document.getElementById("ciudad").value;
  var newUsername = document.getElementById("newUsername").value;
  var newPassword = document.getElementById("newPassword").value;
  var errorMessage = document.getElementById("error-message");

  // Validar que todos los campos estén llenos
  if (
    !cedula ||
    !nombres ||
    !apellidos ||
    !fechaNacimiento ||
    !nacionalidad ||
    !ciudad ||
    !newUsername ||
    !newPassword
  ) {
    alert("Completa todos los campos para registrarte.");
    return; // Salir de la función si algún campo está vacío
  }

  // Crear un objeto con los datos del usuario
  var userData = {
    cedula: cedula,
    nombres: nombres,
    apellidos: apellidos,
    fechaNacimiento: fechaNacimiento,
    nacionalidad: nacionalidad,
    ciudad: ciudad,
    username: newUsername,
    password: newPassword,
  };

  // Obtener los usuarios existentes de localStorage
  var existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Verificar si el usuario ya existe
  var userExists = existingUsers.some((user) => user.username === newUsername);

  if (!userExists) {
    // Agregar el nuevo usuario al array
    existingUsers.push(userData);

    // Almacenar el array actualizado en localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
    window.location.href = "index.html";
  } else {
    alert("Este usuario ya existe. Por favor, elige otro nombre de usuario.");
  }
}

function validateLogin() {
  var username = document.getElementById("username").value;
  var password = document.getElementById("password").value;

  // Obtener los usuarios de localStorage
  var existingUsers = JSON.parse(localStorage.getItem("users")) || [];

  // Verificar las credenciales
  var userFound = existingUsers.find(
    (user) => user.username === username && user.password === password
  );

  if (userFound) {
    // Almacenar el nombre de usuario en localStorage para mostrarlo después
    localStorage.setItem("loggedInUser", username);

    // Mostrar el modal de inicio de sesión exitoso
    var successModal = new bootstrap.Modal(
      document.getElementById("successModal")
    );
    successModal.show();

    // Redirigir a la página deseada después de un breve retraso (por ejemplo, 2 segundos)
    setTimeout(function () {
      window.location.href = "productos.html";
    }, 4000);
  } else {
    // Mostrar el modal de error
    var errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
  }
}

function clearUserData() {
  var confirmation = confirm(
    "¿Estás seguro de que deseas borrar todos los datos?"
  );

  if (confirmation) {
    // Borrar todos los datos de localStorage
    localStorage.clear();
    alert("Todos los datos han sido borrados.");
  }
}

