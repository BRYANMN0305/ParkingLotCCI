(() => {
    const cargarSalida = () => {
        fetch("http://127.0.0.1:8000/salida_dia") // Ajusta la URL según tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos (salida):", data);
                const salidaElemento = document.getElementById("salida");

                if (salidaElemento) {
                    salidaElemento.innerText = data.salida_dia ?? "Sin datos";
                } else {
                    console.error("Elemento con ID 'salida' no encontrado.");
                }
            })
            .catch(error => {
                console.error("Error al obtener las salidas:", error);
                const salidaElemento = document.getElementById("salida");
                if (salidaElemento) {
                    salidaElemento.innerText = "Error";
                }
            });
    };

    cargarSalida(); // Cargar al inicio
    setInterval(cargarSalida, 5000); // Actualiza cada 5 segundos
})();
