(() => {
    let miGrafico = null;

    const cargarIngreso = () => {
        fetch("https://fastapi-cci.onrender.com/ingreso_dia")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const ingreso = data.ingreso_dia ?? 0; // contabilizador de ingreso_dia
                const libres = data.libres ?? 0; // contabilizador de libres
                

                // Mostrar el valor en el centro del gráfico
                const centro = document.getElementById("valorCentro");
                if (centro) {
                    centro.textContent = ingreso;
                }

                const ctx = document.getElementById('graficoIngreso').getContext('2d');

                if (miGrafico) {
                    // Solo actualiza los datos si el gráfico ya existe
                    miGrafico.data.datasets[0].data = [ingreso, libres];
                    miGrafico.update();
                } else {
                    // Crea el gráfico por primera vez
                    miGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
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
                console.error("Error al obtener los ingresos:", error);
                const centro = document.getElementById("valorCentro");
                if (centro) {
                    centro.textContent = "Error";
                }
            });
    };

    cargarIngreso();
    setInterval(cargarIngreso, 5000);
})();
