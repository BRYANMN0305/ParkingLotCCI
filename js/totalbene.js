const cargarBeneficiarios = () => {
    fetch("http://127.0.0.1:8000/total_bene")
        .then(response => response.json()) 
        .then(data => {
            document.getElementById("totalbeneficiario").innerText = data.total_beneficiarios;
        })
        .catch(error => {
            console.error("Error al obtener a los beneficiarios:", error);
            document.getElementById("totalbeneficiario").innerText = "Error";
        });
}

window.onload = () => { 
    cargarBeneficiarios();};
