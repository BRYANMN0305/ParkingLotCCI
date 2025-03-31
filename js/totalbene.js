const cargarBeneficiarios = () => {
    fetch("https://fastapi-cci.onrender.com/total_bene")
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
