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

// Función para cerrar sesión
const cerrarSesion = () => {
    
    sessionStorage.removeItem("autenticado");
    sessionStorage.removeItem("rol");
    window.location.href = "../index.html";
};