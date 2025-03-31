const enviarform = () => {
    // Obtener valores de los campos
    let nombre = document.getElementById("nombre").value.trim();
    let apellido = document.getElementById("apellido").value.trim();
    let usuario = document.getElementById("usuario").value.trim();
    let contrasena = document.getElementById("contrasena").value.trim();
    let documento = document.getElementById("documento").value.trim();
    let rol = document.getElementById("rol").value.trim();

    let texto = /^[a-zA-Z\s]+$/
    let numero = /^[0-9]+$/
    let regexContrasena = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;  


    // Validar que ningún campo esté vacío
    if (nombre === "" || apellido === "" || usuario === "" || contrasena === "" || documento === "" || rol === "") {
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Por favor, llene todos los campos.",
        });
        return;
    }  else if (!texto.test(nombre) || !texto.test(apellido) || !texto.test(usuario)  || !numero.test(documento) || !regexContrasena.test(contrasena)){
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Llene los campos en el formato correcto:\n- Nombre, Apellido, Usuario: Solo texto\n- Documento: Solo números\n -Contraseña: Mínimo 8 Caracteres, 1 Mayuscula, minuscula, número",
    });
    return;
}



    // Estructura de datos para la API
    let datos = {
        nombre: nombre,
        apellido: apellido,
        usuario: usuario,
        contrasena: contrasena,
        documento: documento,
        rol: rol
    };

    console.log("Datos enviados:", JSON.stringify(datos)); // Asegura que los datos se impriman

    // Enviar datos a la API
    fetch("http://127.0.0.1:8000/registrar_rol", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.text())  // Obtener texto en vez de JSON
    .then(text => {
        console.log("Respuesta del servidor:", text);
        try {
            let data = JSON.parse(text); // Intentar convertir a JSON
            if (data && data.mensaje) { // Validar que data existe y contiene mensaje de error
                Swal.fire({
                    icon: "error",
                    title: "¡No se pudo registrar el empleado!",
                    text: data.mensaje, // Mostrar el mensaje real del backend
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "¡Registro Exitoso!",
                    text: "Empleado registrado correctamente.",
                }).then(() => {
                    document.getElementById("form-register").reset(); // Reiniciar el formulario después de aceptar
                });
            }
        } catch (e) {
            console.error("Error al parsear JSON:", e, text);
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "El servidor no devolvió una respuesta válida.",
            });
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema en la conexión con el servidor.",
        });
    });
};
