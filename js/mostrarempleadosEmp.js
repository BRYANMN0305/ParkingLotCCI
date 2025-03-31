// Ocultar tabla de empleado
const ocultarEmpleado = () => {
    let contenedorTabla = document.getElementById("contenedorTablaA");
    contenedorTabla.classList.add("d-none"); // Ocultar la tabla
}
const ocultarBeneficiarios = () => {
    let contenedorTabla = document.getElementById("contenedorTablaB");
    contenedorTabla.classList.add("d-none"); // Ocultar la tabla
}


// Funcion para obtener y mostrar la lista de empleados desde el servidor
const cargarYMostrarEmpleados = () => {
    return fetch("https://fastapi-cci.onrender.com/mostrarempleados", { method: "GET" }) // Petición GET al servidor
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            console.log("Datos recibidos Empleados:", data); // Mostrar datos en consola

            if (!data || !Array.isArray(data.resultado) || data.resultado.length === 0) {
                console.warn("No hay datos de Empleados.");
                return false;
            }

            let tbody = document.getElementById("tablaEmpleados"); // Obtener el tbody de la tabla
            if (!tbody) {
                console.error("No se encontró el tbody con ID 'tablaEmpleados'");
                return false;
            }

            tbody.innerHTML = ""; // Limpiar la tabla antes de insertar nuevos datos

            data.resultado.forEach(empleado => {
                let fila = document.createElement("tr"); // Crear fila

                let columnas = [
                    empleado.id || "N/A",
                    empleado.nombre || "N/A",
                    empleado.apellido || "N/A",
                    empleado.documento || "N/A",
                    empleado.usuario || "N/A",
                    "*********"|| "N/A",
                    empleado.rol || "N/A"
                ];

                columnas.forEach(texto => {
                    let celda = document.createElement("td");
                    celda.textContent = texto; // Agregar texto seguro
                    fila.appendChild(celda);
                });


            

                tbody.appendChild(fila); // Agregar la fila al tbody
            });

            let contenedorTabla = document.getElementById("contenedorTablaA");
            contenedorTabla.classList.remove("d-none"); // Mostrar la tabla

            return true;
        })
        .catch(error => {
            console.error("Error en la petición de Empleados:", error);
            return false;
        });
};

// Funcion para obtener y mostrar la lista de beneficiarios desde el servidor
const cargarYMostrarBeneficiarios = () => {
    return fetch("https://fastapi-cci.onrender.com/mostrarbeneficiarios", { method: "GET" }) // Petición GET al servidor
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            console.log("Datos recibidos Beneficiarios:", data); // Mostrar datos en consola

            if (!data || !data.resultado || data.resultado.length === 0) {
                console.warn("No hay datos de Beneficiarios.");
                return false;
            }

            let tbody = document.getElementById("tablaBeneficiarios"); // Obtener el tbody de la tabla
            if (!tbody) {
                console.error("No se encontró el tbody con ID 'tablaBeneficiarios'");
                return false;
            }

            tbody.innerHTML = ""; // Limpiar la tabla antes de insertar nuevos datos

            data.resultado.forEach(beneficiario => {
                let fila = document.createElement("tr"); // Crear fila
                fila.innerHTML = `
                    <td>${beneficiario.id || "N/A"}</td>
                    <td>${beneficiario.nombre || "N/A"}</td>
                    <td>${beneficiario.apellido || "N/A"}</td>
                    <td>${beneficiario.documento || "N/A"}</td>
                    <td>${beneficiario.usuario || "N/A"}</td>
                    <td>*********</td>
                    <td>${beneficiario.placa || "N/A"}</td>
                    <td>${beneficiario.tipovehiculo || "N/A"}</td>
                    <td>
                        <button onclick="editarBeneficiario(${beneficiario.id})" class="btn btn-primary btn-sm m-1">
                            Editar
                        </button>
                        <button onclick="eliminarBeneficiario(${beneficiario.id})" class="btn btn-danger btn-sm m-1">
                            Eliminar
                        </button>
                    </td>
                `;
                tbody.appendChild(fila); // Agregar la fila al tbody
            });

            let contenedorTabla = document.getElementById("contenedorTablaB");
            contenedorTabla.classList.remove("d-none"); // Mostrar la tabla

            return true;
        })
        .catch(error => {
            console.error("Error en la petición de Beneficiarios:", error);
            return false;
        });
};


const actualizarempleados = () => {
    const id = document.getElementById("idEmpleado").value;

    const datosnuevo = {
        nombre: document.getElementById("nombreEmpleado").value,
        apellido: document.getElementById("apellidoEmpleado").value,
        usuario: document.getElementById("usuarioEmpleado").value,
        contrasena: document.getElementById("contrasenaEmpleado").value,
        documento: document.getElementById("documentoEmpleado").value,
        rol: document.getElementById("rolEmpleado").value
    };

    fetch(`https://fastapi-cci.onrender.com/actualizarempleado/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosnuevo)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Empleado actualizado:", data);

            Swal.fire({
                title: "¡Éxito!",
                text: "Empleado actualizado correctamente",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33"
            }).then(() => {
                let modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarEmpleado"));
                modal.hide();
                document.getElementById("tablaEmpleados").innerHTML = "";
                cargarYMostrarEmpleados();
            });
        })
        .catch(error => {
            console.error("Error en la actualización:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al actualizar el empleado.",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
};

const editarEmpleado = (id) => {
    let modalElement = document.getElementById("modalEditarEmpleado");
    resetearFormularioEmpleado();

    fetch(`https://fastapi-cci.onrender.com/buscarempleado/${id}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.resultado) {
                alert("No se encontró el empleado.");
                return;
            }

            let empleado = data.resultado;
            console.log("Empleado seleccionado:", empleado);

            document.getElementById("idEmpleado").value = empleado.id || "";
            document.getElementById("idEmpleado").setAttribute("disabled", true);

            document.getElementById("nombreEmpleado").value = empleado.nombre || "";
            document.getElementById("apellidoEmpleado").value = empleado.apellido || "";
            document.getElementById("usuarioEmpleado").value = empleado.usuario || "";
            document.getElementById("contrasenaEmpleado").value = empleado.contrasena || "";
            document.getElementById("documentoEmpleado").value = empleado.documento || "";
            document.getElementById("rolEmpleado").value = empleado.rol || "";

            let existingModal = bootstrap.Modal.getInstance(modalElement);
            if (existingModal) {
                existingModal.hide();
            }

            let newModal = new bootstrap.Modal(modalElement);
            newModal.show();
        })
        .catch(error => {
            console.error("Error al obtener los datos del empleado:", error);
            alert("Hubo un error al cargar los datos del empleado.");
        });
};

const resetearFormularioEmpleado = () => {
    let campos = ["nombreEmpleado", "apellidoEmpleado", "usuarioEmpleado", "contrasenaEmpleado", "documentoEmpleado", "rolEmpleado"];
    campos.forEach(campo => {
        let input = document.getElementById(campo);
        input.value = "";
        input.removeAttribute("disabled");
    });

    document.getElementById("idEmpleado").value = "";
    document.getElementById("idEmpleado").setAttribute("disabled", true);
};

const eliminarEmpleado = (id) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará al empleado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://fastapi-cci.onrender.com/eliminarempleados/${id}`, { method: "DELETE" })
                .then(response => response.json())
                .then(data => {
                    console.log("Empleado eliminado:", data);
                    Swal.fire({
                        title: "Eliminado",
                        text: "El empleado ha sido eliminado con éxito.",
                        icon: "success",
                        confirmButtonColor: "#d33"
                    }).then(() => {
                        cargarYMostrarEmpleados();
                    });
                })
                .catch(error => {
                    console.error("Error al eliminar el empleado:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Hubo un problema al eliminar el empleado.",
                        icon: "error",
                        confirmButtonColor: "#d33"
                    });
                });
        }
    });
};

const editarBeneficiario = (id) => {
    let modalElement = document.getElementById("modalEditarBeneficiario");
    let modal = new bootstrap.Modal(modalElement);  // Asegura que el modal se inicializa

    resetearFormularioBeneficiario();

    fetch(`https://fastapi-cci.onrender.com/buscarbeneficiario/${id}`)
        .then(response => response.json())
        .then(data => {
            if (!data || !data.resultado) {
                alert("No se encontró el beneficiario.");
                return;
            }

            let beneficiario = data.resultado;
            console.log("📌 Beneficiario seleccionado:", beneficiario);

            document.getElementById("idb").value = beneficiario.id || "";
            document.getElementById("idb").setAttribute("disabled", true);

            document.getElementById("nombreBeneficiario").value = beneficiario.nombre || "";
            document.getElementById("apellidoBeneficiario").value = beneficiario.apellido || "";
            document.getElementById("usuarioBeneficiario").value = beneficiario.usuario || "";
            document.getElementById("contrasenaBeneficiario").value = beneficiario.contrasena || "";
            document.getElementById("documentoBeneficiario").value = beneficiario.documento || "";
            document.getElementById("placaBeneficiario").value = beneficiario.placa || "";
            document.getElementById("tipovehiculo").value = beneficiario.tipovehiculo || "";

            modal.show(); // Asegura que el modal se muestre correctamente
        })
        .catch(error => {
            console.error("❌ Error al obtener los datos del beneficiario:", error);
            alert("Hubo un error al cargar los datos del eneficiario.");
        });
};

//Resetea el formulario antes de cargar nuevos datos
const resetearFormularioBeneficiario = () => {
    let campos = [
        "nombreBeneficiario", "apellidoBeneficiario", "usuarioBeneficiario",
        "contrasenaBeneficiario", "documentoBeneficiario", "placaBeneficiario", "tipovehiculo"
    ];

    campos.forEach(campo => {
        let input = document.getElementById(campo);
        if (input) {
            input.value = "";
            input.removeAttribute("disabled");
        } else {
            console.warn(`⚠ El campo ${campo} no existe en el HTML.`);
        }
    });

    document.getElementById("idb").value = "";
    document.getElementById("idb").setAttribute("disabled", true);
};
const actualizarBeneficiario = () => {
    const id = document.getElementById("idb").value;
    const datosActualizados = {
        nombre: document.getElementById("nombreBeneficiario").value,
        apellido: document.getElementById("apellidoBeneficiario").value,
        usuario: document.getElementById("usuarioBeneficiario").value,
        contrasena: document.getElementById("contrasenaBeneficiario").value,
        documento: document.getElementById("documentoBeneficiario").value,
        placa: document.getElementById("placaBeneficiario").value,
        tipovehiculo: document.getElementById("tipovehiculo").value
    };

    fetch(`https://fastapi-cci.onrender.com/actualizarbeneficiario/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datosActualizados)
    })
        .then(response => response.json())
        .then(data => {
            console.log("Beneficiario actualizado:", data);

            Swal.fire({
                title: "¡Éxito!",
                text: "Beneficiario actualizado correctamente",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#d33"
            }).then(() => {
                let modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarBeneficiario"));
                modal.hide();
                document.getElementById("tablaBeneficiarios").innerHTML = "";
                cargarYMostrarBeneficiarios();
            });
        })
        .catch(error => {
            console.error("Error en la actualización:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al actualizar el beneficiario.",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
};

const eliminarBeneficiario = (id) => {
    Swal.fire({
        title: "¿Estás seguro?",
        text: "Esta acción eliminará al empleado permanentemente.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`https://fastapi-cci.onrender.com/eliminarbeneficiario/${id}`, {method: "DELETE"})
            .then(response => response.json())
            .then(data => {
                console.log("Beneficiario eliminado:", data);
                Swal.fire({
                    title: "¡Eliminado!",
                    text: "El beneficiario ha sido eliminado con éxito.",
                    icon: "success",
                    confirmButtonColor: "#d33"
                }).then(() => {
                    cargarYMostrarBeneficiarios(); // Recargar lista después de cerrar la alerta
                });
            })
            .catch(error => {
                console.error("❌ Error al eliminar el beneficiario:", error);
                Swal.fire({
                    title: "Error",
                    text: "No se pudo eliminar el beneficiario",
                    icon: "error",
                    confirmButtonColor: "#d33"
                });
            });
        }
    });
};
