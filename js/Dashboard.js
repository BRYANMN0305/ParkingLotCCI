const cargarPuestos = () => {
    fetch("https://fastapi-cci.onrender.com/puestos/")
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById("puestos-container");
        contenedor.innerHTML = ""; // Limpiar antes de actualizar

        data.puestos.forEach(puesto => {
            const div = document.createElement("div");
            div.classList.add("puesto", puesto.estado);
            div.textContent = puesto.id;
            contenedor.appendChild(div);
        });
    })
    .catch(err => console.error("Error al obtener los datos:", err));
};

setInterval(() => cargarPuestos(),5000);
cargarPuestos();