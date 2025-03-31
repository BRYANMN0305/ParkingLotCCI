const iniciarSesion = () => {
    const usuario = document.getElementById("usuario").value.trim();
    const contrasena = document.getElementById("contrasena").value.trim();

    if (usuario === "" || contrasena === "") {
        Swal.fire({
            icon: "error",
            title: "¡El formulario no se ha enviado!",
            text: "Por favor, llene todos los campos.",
            confirmButtonColor: "#d33",
        });
        return;
    }

    fetch("https://fastapi-cci.onrender.com/iniciar_sesion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, contrasena })
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje && data.rol) {
            // Guardar la sesión en sessionStorage
            sessionStorage.setItem("autenticado", "true");
            sessionStorage.setItem("rol", data.rol); // Guarda el rol

            Swal.fire({
                title: "¡Inicio de Sesión Exitoso!",
                text: `Bienvenido ${data.usuario} - Rol: ${data.rol}`,
                icon: "success",
                confirmButtonColor: "#3085d6",
                allowOutsideClick: false,
            }).then(() => {
                // Redirige según el rol
                if (data.rol.toLowerCase() === "administrador") {
                    window.location.href = "html/DashAd.html";
                } else if (data.rol.toLowerCase() === "asesor") {
                    window.location.href = "html/DashEmp.html";
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Rol desconocido",
                        text: "Por favor, contacte al administrador.",
                        confirmButtonColor: "#d33",
                    });
                }
            });
        } else {
            Swal.fire({
                icon: "error",
                title: "¡Error!",
                text: "Usuario o contraseña incorrectos.",
                confirmButtonColor: "#d33",
            });
        }
    })
    .catch(error => {
        console.error("Error en la petición:", error);
        Swal.fire({
            icon: "error",
            title: "¡Error en el servidor!",
            text: "No se pudo conectar con el servidor. Inténtelo más tarde.",
            confirmButtonColor: "#d33",
        });
    });
};


