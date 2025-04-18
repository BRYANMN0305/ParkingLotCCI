(() => {
    let miGrafico = null;

    const cargarBeneficiario = () => {
        fetch("https://fastapi-cci.onrender.com/total_bene")
            .then(response => {
                if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
                return response.json();
            })
            .then(data => {
                const beneficiario = data.total_bene ?? 0; // 👈 corregido aquí
                console.log("Total beneficiarios:", beneficiario);

                const mitad = document.getElementById("valorMitad");
                if (mitad) {
                    mitad.textContent = beneficiario; // 👈 y aquí también
                }

                const ctx = document.getElementById('graficoBeneficiarios').getContext('2d');

                if (miGrafico) {
                    miGrafico.data.datasets[0].data = [beneficiario];
                    miGrafico.update();
                } else {
                    miGrafico = new Chart(ctx, {
                        type: 'doughnut',
                        data: {
                            datasets: [{
                                data: [beneficiario, 0], // para que se vea completo el anillo
                                backgroundColor: ['rgba(227, 0, 0, 0.7)', 'rgba(201, 203, 207, 0.2)'],
                                borderColor: ['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.1)'],
                                borderWidth: 1
                            }]
                        },
                        options: {
                            responsive: true,
                            cutout: '75%',
                            plugins: {
                                legend: { display: false },
                                title: { display: false }
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
