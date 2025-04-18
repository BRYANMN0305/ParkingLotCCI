(() => {
    const ctx = document.getElementById('ingresoChart').getContext('2d');

    // Plugin para dibujar texto en el centro
    const centerText = {
        id: 'centerText',
        beforeDraw(chart) {
            const { width } = chart;
            const { height } = chart;
            const ctx = chart.ctx;
            ctx.restore();

            const ingreso = chart.config.options.plugins.centerText.text;
            const fontSize = (height / 5).toFixed(2);
            ctx.font = `${fontSize}px Arial`;
            ctx.textBaseline = "middle";
            ctx.textAlign = "center";

            const centerX = width / 2;
            const centerY = height / 2;

            ctx.fillStyle = "#000"; // Color del número
            ctx.fillText(ingreso, centerX, centerY);
            ctx.save();
        }
    };

    // Crear el gráfico
    const ingresoChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#00c6ff', '#e0e0e0'], // Color de avance y fondo
                borderWidth: 0
            }]
        },
        options: {
            cutout: '75%',
            responsive: true,
            plugins: {
                tooltip: { enabled: false },
                legend: { display: false },
                centerText: {
                    text: '0' // Texto inicial
                }
            }
        },
        plugins: [centerText]
    });

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
                const valorIngreso = data.ingreso_dia ?? 0;

                const porcentaje = Math.min(Math.max(valorIngreso, 0), 100);

                ingresoChart.data.datasets[0].data = [porcentaje, 100 - porcentaje];
                ingresoChart.options.plugins.centerText.text = valorIngreso;
                ingresoChart.update();
            })
            .catch(error => {
                console.error("Error al obtener los ingresos:", error);
            });
    };

    cargarIngreso(); // Al cargar la página
    setInterval(cargarIngreso, 5000); // Cada 5 segundos
})();
