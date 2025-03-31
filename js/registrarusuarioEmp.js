const enviar = () => {
    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let placa = document.getElementById("placa").value.trim();
    let tipo = document.getElementById("tipovehiculo").value.trim();
    let usuario = document.getElementById("usuario").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();

    // Verificar que ningún campo esté vacío
    if (!nombre || !apellido || !documento || !telefono || !usuario || !contrasena) {
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Por favor, llene todos los campos obligatorios.",
        });
        return;
    }

    // Crear lista de vehículos (solo si los campos de vehículo están llenos)
    let vehiculos = [];
    if (placa && tipo) {
        vehiculos.push({
            placa: placa,
            tipovehiculo: tipo
        });
    }

    // Crear objeto con los datos del formulario
    let datos = {
        nombre: nombre,
        apellido: apellido,
        documento: parseInt(documento), // Asegurar que sea número
        telefono: parseInt(telefono), // Asegurar que sea número
        usuario: usuario,
        contrasena: contrasena,
        vehiculos: vehiculos // Enviar la lista de vehículos correctamente
    };

    console.log("Datos enviados:", datos); // Depuración para ver los datos antes de enviarlos

    // Enviar datos a la API
    fetch("http://127.0.0.1:8000/registrar_bene", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Respuesta del servidor:", data);

        Swal.fire({
            icon: "success",
            title: "¡Registro Exitoso!",
            text: "Beneficiario y vehículo registrados correctamente.",
        }).then(() => {
            document.getElementById("register-form").reset(); // Reiniciar el formulario después de aceptar
        });
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema en la conexión con el servidor.",
        }).then(() => {
            document.getElementById("register-form").reset(); // Reiniciar el formulario en caso de error
        });
    });
};
