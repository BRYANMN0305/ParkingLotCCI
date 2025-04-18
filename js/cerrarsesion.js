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
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            sessionStorage.removeItem("autenticado");
            sessionStorage.removeItem("rol");
            window.location.href = "../index.html";
        }
    });
};
