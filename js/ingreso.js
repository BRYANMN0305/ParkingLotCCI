(() => {
    const cargarIngreso = () => {
        fetch("http://127.0.0.1:8000/ingreso_dia")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data);
                const ingresoElemento = document.getElementById("Ingreso");

                if (ingresoElemento) {
                    ingresoElemento.innerText = data.ingreso_dia ?? "Sin datos";
                } else {
                    console.error("Elemento con ID 'Ingreso' no encontrado.");
                }
            })
            .catch(error => {
                console.error("Error al obtener los ingresos:", error);
                const ingresoElemento = document.getElementById("Ingreso");
                if (ingresoElemento) {
                    ingresoElemento.innerText = "Error";
                }
            });
    };

    cargarIngreso(); // Cargar al inicio
    setInterval(cargarIngreso, 5000); // Actualizar cada 5 segundos
})();

