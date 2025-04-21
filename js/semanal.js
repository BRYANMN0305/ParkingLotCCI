const cargarGraficoSemanal = () => {
    try {
        fetch("https://fastapi-cci.onrender.com/grafico")
        .then(response => {
            if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
            return response.json();
        })
        .then(datos => {
            // Ahora arma el gráfico
            const ctx = document.getElementById('graficoSemanal').getContext('2d');

            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: datos.labels, // ["Lunes", "Martes", ..., "Domingo"]
                    datasets: [
                        {
                            label: 'Ingresos',
                            data: datos.ingresos, // [número de ingresos por día]
                            borderColor: 'rgba(255, 99, 132, 1)', // Rojo
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            fill: true
                        },
                        {
                            label: 'Salidas',
                            data: datos.salidas, // [número de salidas por día]
                            borderColor: 'rgba(54, 162, 235, 1)', // Azul
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

// Ejecuta la función cuando se cargue la página
window.addEventListener('DOMContentLoaded', cargarGraficoSemanal);
