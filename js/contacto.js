const enviar = () => {
    let nombre = document.getElementById("nombre").value.trim();
    let telefono = document.getElementById("telefono").value.trim();
    let email = document.getElementById("email").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    
    // Validar que todos los campos estén llenos
    if (nombre === "" || telefono === "" || email === "" || mensaje === "") {
        Swal.fire({
            icon: "error",
            title: "¡No se ha enviado el formulario!",
            text: "Por favor, llene todos los campos.",
        });
        return;
    }

    let datos = {
        nombre: nombre,
        telefono: telefono,
        email: email,
        mensaje: mensaje
    };

    console.log("Datos enviados:", JSON.stringify(datos));
        //https://fastapi-cci.onrender.com
    fetch("https://fastapi-cci.onrender.com/contactar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    })
    .then(response => response.text())  // Obtener respuesta como texto
    .then(text => {
        console.log("Respuesta del servidor:", text);
        try {
            let data = JSON.parse(text); // Intentar convertir a JSON
            
            if (data.mensaje && data.mensaje.includes("Error")) { 
                // Si el backend devuelve un error
                Swal.fire({
                    icon: "error",
                    title: "¡No se pudo enviar la información!",
                    text: data.mensaje,
                });
            } else {
                Swal.fire({
                    icon: "success",
                    title: "¡Información enviada correctamente!",
                    text: "Su información fue enviada de forma exitosa.",
                }).then(() => {
                    document.getElementById("contactForm").reset(); // Reiniciar el formulario
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
