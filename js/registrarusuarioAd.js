const enviarformruAd = () => {
    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let placa = document.getElementById("placa").value.trim();
    let tipo = document.getElementById("tipovehiculo").value.trim();
    let usuario = document.getElementById("usuario").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();

    let texto = /^[a-zA-Z\s]+$/;
    let numero = /^[0-9]+$/;
    let regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

    if (!nombre || !apellido || !documento || !telefono || !usuario || !contrasena) {
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Por favor, llene todos los campos obligatorios."
        });
        return;
    }
    if (!texto.test(nombre) || !texto.test(apellido) || !texto.test(usuario) || !numero.test(documento) || !regexContrasena.test(contrasena)) {
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Llene los campos en el formato correcto:\n- Nombre, Apellido, Usuario: Solo texto\n- Documento y Teléfono: Solo números\n- Contraseña: Mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número"
        });
        return;
    }

    let vehiculos = [];
    if (placa && tipo) {
        vehiculos.push({ placa: placa, tipovehiculo: tipo });
    }

    let datos = {
        nombre: nombre,
        apellido: apellido,
        documento: parseInt(documento),
        telefono: parseInt(telefono),
        usuario: usuario,
        contrasena: contrasena,
        vehiculos: vehiculos
    };

    fetch("https://fastapi-cci.onrender.com/registrar_bene", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Respuesta de la API:", data); // <-- Muestra la respuesta en consola para depuración

        if (data.mensaje) {  // La API solo devuelve 'mensaje'
            Swal.fire({
                icon: "success",
                title: "¡Registro Exitoso!",
                text: "Beneficiario registrado correctamente.",
                willClose: () => {
                    window.location.reload();
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "¡No se pudo registrar!",
                text: data.detail || "Error desconocido."
            });
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema en la conexión con el servidor."
        });
    });
};
