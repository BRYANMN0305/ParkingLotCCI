(() => {
    let miGrafico = null;

    const cargarIngreso = () => {
        fetch("https://fastapi-cci.onrender.com/ingreso_dia")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const ingreso = data.ingreso_dia ?? 0;
                const totalEspacios = 20;
                const libres = totalEspacios - ingreso;

                // Mostrar el valor en el centro
                const centro = document.getElementById("valorCentro");
                if (centro) centro.innerText = ingreso;

                // Crear o actualizar el gráfico
                const ctx = document.getElementById('graficoIngreso').getContext('2d');
                if (miGrafico) {
                    miGrafico.data.datasets[0].data = [ingreso, libres];
                    miGrafico.update();
                } else {
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
                            plugins: {
                                legend: {
                                    display: false
                                },
                                title: {
                                    display: false // Ocultamos también el "Ingresos del Día"
                                }
                            },
                            cutout: '75%' // Más espacio para el número
                        }
                    });
                    
                }
            })
            .catch(error => {
                console.error("Error al obtener los ingresos:", error);
                const centro = document.getElementById("valorCentro");
                if (centro) centro.innerText = "Error";
            });
    };

    cargarIngreso();
    setInterval(cargarIngreso, 5000);
})();
// Se ejecuta cada 5 segundos