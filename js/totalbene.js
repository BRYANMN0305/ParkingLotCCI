(() => {
    let miGrafico = null;

    const cargarBeneficiario = () => {
        fetch("https://fastapi-cci.onrender.com/total_bene")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const beneficiario = data.total_bene ?? 0; // contabilizador de total_bene

                // Mostrar el valor en el centro del gráfico
                const mitad = document.getElementById("valorMitad");
                if (mitad) {
                    mitad.textContent = beneficiario;
                }

                const ctx = document.getElementById('graficoBeneficiarios').getContext('2d');

                if (miGrafico) {
                    miGrafico.data.datasets[0].data = [beneficiario, restante];
                    miGrafico.update();
                } else {
                    miGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [beneficiario, restante],
                                backgroundColor: [
                                    'rgba(227, 0, 0, 0.7)',       // rojo principal
                                    'rgba(201, 203, 207, 0.3)'    // gris suave de fondo
                                ],
                                borderColor: [
                                    'rgba(0, 0, 0, 0.7)',
                                    'rgba(0, 0, 0, 0.2)'
                                ],
                                borderWidth: [1, 1]
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
                console.error("Error al obtener los beneficiarios:", error);
                const mitad = document.getElementById("valorMitad");
                if (mitad) {
                    mitad.textContent = "Error";
                }
            });
    };

    cargarBeneficiario();
    setInterval(cargarBeneficiario, 5000);
})();
