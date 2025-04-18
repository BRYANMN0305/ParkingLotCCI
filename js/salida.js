(() => {
    let miGrafico = null;

    const cargarSalida = () => {
        fetch("https://fastapi-cci.onrender.com/ingreso_dia")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos:", data); // 👈 Agrega esto para ver qué trae
                const salida = data.salida_dia ?? 0;
                const totalEspacios = 20;
                const ocupados = totalEspacios + salida;

                // Mostrar el valor en el centro del gráfico
                const medio = document.getElementById("valorMedio");
                if (medio) {
                    medio.textContent = salida;
                }

                const ctx = document.getElementById('graficoSalida').getContext('2d');

                if (miGrafico) {
                    // Solo actualiza los datos si el gráfico ya existe
                    miGrafico.data.datasets[0].data = [salida, ocupados];
                    miGrafico.update();
                } else {
                    // Crea el gráfico por primera vez
                    miGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [salida, ocupados],
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
                            cutout: '75%',
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: false
                                }
                            }
                        }
                    });
                }
            })
            .catch(error => {
                console.error("Error al obtener las salidas:", error);
                const medio = document.getElementById("valorMedio");
                if (medio) {
                    medio.textContent = "Error";
                }
            });
    };

    cargarSalida();
    setInterval(cargarSalida, 5000);
})();
