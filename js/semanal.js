(() => {
    let graficoSemanal = null; // Variable para guardar la instancia del gráfico

    const cargarGraficoSemanal = () => {
        try {
            fetch("https://fastapi-cci.onrender.com/grafico")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(datos => {
                const ctx = document.getElementById('graficoSemanal').getContext('2d');

                // Si ya existe un gráfico, lo destruimos antes de crear uno nuevo
                if (graficoSemanal) {
                    graficoSemanal.destroy();
                }

                // Crear nuevo gráfico
                graficoSemanal = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: datos.labels,
                        datasets: [
                            {
                                label: 'Ingresos',
                                data: datos.ingresos,
                                borderColor: 'rgba(255, 99, 132, 1)',
                                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                                fill: true
                            },
                            {
                                label: 'Salidas',
                                data: datos.salidas,
                                borderColor: 'rgba(54, 162, 235, 1)',
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                fill: true
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false
                    }
                });
            })
            .catch(error => {
                console.error('Error cargando el gráfico:', error);
            });
        } catch (error) {
            console.error('Error en la función cargarGraficoSemanal:', error);
        }
    }

    cargarGraficoSemanal();
    setInterval(cargarGraficoSemanal, 5000);
})();
