(() => {
    const sesion = sessionStorage.getItem("autenticado");
    if (!sesion || sesion !== "true") {
        window.location.href = "../index.html"; // Redirige si no hay sesión
    }
})();

// Evitar que el usuario vuelva atrás después de cerrar sesión
(() => {
    history.pushState(null, null, location.href);
    window.onpopstate = () => history.go(1);
})();

// Función para cerrar sesión con confirmación
const cerrarSesion = () => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas cerrar sesión?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        //Si el usuario confirma, se cierra la sesión
        if (result.isConfirmed) {
            sessionStorage.removeItem("autenticado");
            sessionStorage.removeItem("rol");
            window.location.href = "../index.html";
        }
    });
};
