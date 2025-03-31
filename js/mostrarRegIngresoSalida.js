const ocultarTablas = () => {
    document.getElementById("contenedorTabla").classList.add("d-none");
}

// Función para obtener y mostrar la lista de registros desde el servidor
const cargarTablaRegistro = () => {
    return fetch("http://127.0.0.1:8000/mostraregingresosalida", { method: "GET" })
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            console.log("Datos recibidos Registros:", data);

            // Validación de datos corregida
            if (!data || !data.resultado || data.resultado.length === 0) {
                console.warn("No hay datos de Registros.");
                return false;
            }

            let tbody = document.getElementById("tablaRegistros");
            if (!tbody) {
                console.error("No se encontró el tbody con id 'tablaRegistros'");
                return false;
            }

            tbody.innerHTML = ""; // Limpiar el contenido previo de la tabla

            // Recorrer los datos recibidos y agregarlos a la tabla
            data.resultado.forEach(registros => { 
                let fila = document.createElement("tr"); // Crear fila
                fila.innerHTML = `
                    <td>${registros.placa || "N/A"}</td>
                    <td>${registros.documento || "N/A"}</td>
                    <td>${registros.estado || "N/A"}</td>
                    <td>${registros.fecha_ingreso || "N/A"}</td>
                    <td>${registros.fecha_salida || "No Registra"}</td>
                    <td>${registros.puesto || "N/A"}</td>
                    <td>${registros.valor_parqueo || "0,0"}</td>
                `;
                tbody.appendChild(fila); // Agregar fila a la tabla
            });

            let contenedor = document.getElementById("contenedorTabla");
            if (contenedor) {
                contenedor.classList.remove("d-none"); // Mostrar la tabla
            } else {
                console.error("No se encontró el contenedor de la tabla.");
            }
        })
        .catch(error => {
            console.error("Error en la petición de Registros:", error);
            return false;
        });
}

const cargarTabla = () => {
    cargarTablaRegistro();
};


