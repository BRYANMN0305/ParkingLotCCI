(() => {
    let miGrafico = null;

    const cargarIngreso = () => {
        fetch("https://fastapi-cci.onrender.com/ingreso_dia")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data);
                const ingresoElemento = document.getElementById("Ingreso");
                const ingreso = data.ingreso_dia ?? 0;

                if (ingresoElemento) {
                    ingresoElemento.innerText = ingreso;
                } else {
                    console.error("Elemento con ID 'Ingreso' no encontrado.");
                }

                // Actualizar o crear el gráfico
                const ctx = document.getElementById('graficoIngreso').getContext('2d');
                const totalEspacios = 20; // <-- Aquí pon el número total de espacios de tu parqueadero
                const libres = totalEspacios - ingreso;

                if (miGrafico) {
                    miGrafico.data.datasets[0].data = [ingreso, libres];
                    miGrafico.update();
                } else {
                    miGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            labels: ['Ingresos', 'Espacios Libres'],
                            datasets: [{
                                data: [ingreso, libres],
                                backgroundColor: [
                                    'rgba(75, 192, 192, 0.7)',
                                    'rgba(201, 203, 207, 0.7)'
                                ],
                                borderColor: [
                                    'rgba(75, 192, 192, 1)',
                                    'rgba(201, 203, 207, 1)'
                                ],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                                title: {
                                    display: true,
                                    text: 'Ingresos del Día'
                                }
                            }
                        }
                    });
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