(() => {
    let graficoSemanal = null;

    const cargarGraficoSemanal = () => {
        try {
            fetch("https://fastapi-cci.onrender.com/grafico")
                .then(response => {
                    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                    return response.json();
                })
                .then(datos => {
                    const canvas = document.getElementById('graficoSemanal');
                    const ctx = canvas.getContext('2d');

                    if (graficoSemanal) {
                        graficoSemanal.destroy();
                        canvas.width = canvas.width;
                        canvas.height = canvas.height;
                    }

                    const maxIngreso = Math.max(...datos.ingresos);
                    const maxSalida = Math.max(...datos.salidas);
                    const valorMaximo = Math.ceil(Math.max(maxIngreso, maxSalida) * 1.2);

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
                                    fill: {
                                        target: 'origin',
                                        above: 'rgba(255, 99, 132, 0.2)'
                                    },
                                    tension: 0.3
                                },
                                {
                                    label: 'Salidas',
                                    data: datos.salidas.map(valor => valor * -1),
                                    borderColor: 'rgba(54, 162, 235, 1)',
                                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                    fill: {
                                        target: 'origin',
                                        below: 'rgba(54, 162, 235, 0.2)'
                                    },
                                    tension: 0.3
                                }
                            ]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    min: -valorMaximo,
                                    max: valorMaximo,
                                    ticks: {
                                        stepSize: 1,
                                        callback: function (value) {
                                            return value;
                                        }
                                    },
                                    grid: {
                                        color: 'rgba(0,0,0,0.1)'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: '#000'
                                    }
                                }
                            }
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

    // Usar ResizeObserver para esperar a que el canvas tenga tamaño visible antes de renderizar
    const canvas = document.getElementById('graficoSemanal');

    const observer = new ResizeObserver(() => {
        if (canvas.offsetWidth > 0 && canvas.offsetHeight > 0) {
            cargarGraficoSemanal();
            observer.disconnect(); // Ya no lo necesitamos
        }
    });

    observer.observe(canvas);

    // Actualización automática cada 5 segundos
    setInterval(cargarGraficoSemanal, 5000);
})();