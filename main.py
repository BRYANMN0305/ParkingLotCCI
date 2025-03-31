# Librerías importadas
from fastapi import FastAPI, HTTPException  # FastAPI para crear la API y HTTPException para manejo de errores HTTP
from fastapi.middleware.cors import CORSMiddleware  # CORSMiddleware para permitir CORS (compartir recursos entre orígenes)
from pydantic import BaseModel  # Pydantic para definir modelos de datos
import mysql.connector  # Conector para interactuar con MySQL
from fastapi.encoders import jsonable_encoder  # Para convertir los resultados a un formato JSON compatible
from datetime import datetime
import qrcode
import os
import base64
from io import BytesIO
from typing import List, Optional

# Instancia de FastAPI para crear la aplicación
app = FastAPI()

# Configuración de CORS para permitir peticiones desde cualquier origen
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite peticiones desde cualquier origen
    allow_credentials=True,
    allow_methods=["*"],  # Permite cualquier tipo de método HTTP
    allow_headers=["*"],  # Permite cualquier encabezado
)

def get_db_connection():

# Intento de conexión a la base de datos MySQL
    try:
        return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",  # La contraseña de la base de datos
        database="cci"  # El nombre de la base de datos
    )
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error al conectar con la base de datos: {err}")

# Modelo para la creación de un nuevo rol
class Rol(BaseModel):
    nombre: str
    apellido: str
    usuario: str
    contrasena: str
    documento: str
    rol: str

# Endpoint para registrar un rol en la base de datos
@app.post("/registrar_rol")
def registrar_rol(nuevo_rol: Rol):
    try:
        mydb = get_db_connection()
        cursor = mydb.cursor()

        valo = "INSERT INTO roles (nombre, apellido, usuario, contrasena, documento, rol) VALUES (%s, %s, %s, %s, %s, %s)"
        valores = (nuevo_rol.nombre, nuevo_rol.apellido, nuevo_rol.usuario, nuevo_rol.contrasena, nuevo_rol.documento, nuevo_rol.rol)

        cursor.execute(valo, valores)
        mydb.commit()  # Guardar cambios antes de cerrar conexión
        cursor.close()
        mydb.close()

        return {"informacion": "Rol registrado correctamente"}

    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")

    
    
# Crear la carpeta donde se guardarán los QR si no existe
QR_DIR = "qrs_generados"
os.makedirs(QR_DIR, exist_ok=True)

# Modelo para registrar vehículos
class Vehiculo(BaseModel):
    placa: str
    tipovehiculo: str

# Modelo para registrar un beneficiario con sus vehículos
class Beneficiario(BaseModel):
    nombre: str
    apellido: str
    documento: int
    telefono: int
    usuario: str
    contrasena: str
    vehiculos: list[Vehiculo] = []  # Lista de vehículos asociados al beneficiario

# Endpoint para registrar un beneficiario
@app.post("/registrar_bene")
def registrar_bene(nuevo_bene: Beneficiario):
    """
    Registra un nuevo beneficiario junto con sus vehículos y genera un código QR con su información.
    """
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        # Verificar si el beneficiario ya está registrado
        cursor.execute("SELECT documento FROM beneficiarios WHERE documento = %s", (nuevo_bene.documento,))
        if cursor.fetchone():
            cursor.close()
            raise HTTPException(status_code=400, detail="El beneficiario ya está registrado.")

        # Insertar el beneficiario en la base de datos
        cursor.execute(
            "INSERT INTO beneficiarios (nombre, apellido, documento, telefono, usuario, contrasena) VALUES (%s, %s, %s, %s, %s, %s)", 
            (nuevo_bene.nombre, nuevo_bene.apellido, nuevo_bene.documento, nuevo_bene.telefono, nuevo_bene.usuario, nuevo_bene.contrasena)
        )

        # Insertar los vehículos del beneficiario
        for vehiculo in nuevo_bene.vehiculos:
            cursor.execute(
                "INSERT INTO vehiculos (placa, tipovehiculo, documento) VALUES (%s, %s, %s)", 
                (vehiculo.placa, vehiculo.tipovehiculo, nuevo_bene.documento)
            )

        mydb.commit()  # Confirmar los cambios en la base de datos
        cursor.close()  # Cerrar el cursor

        # Generar código QR con la información del beneficiario
        datos_qr = (
            f"Nombre: {nuevo_bene.nombre}\n"
            f"Apellido: {nuevo_bene.apellido}\n"
            f"Documento: {nuevo_bene.documento}\n"
            f"Teléfono: {nuevo_bene.telefono}"
        )

        if nuevo_bene.vehiculos:
            datos_qr += "\nVehículos:\n" + "\n".join([f"{v.placa} - {v.tipovehiculo}" for v in nuevo_bene.vehiculos])

        qr = qrcode.make(datos_qr)
        qr_path = os.path.join(QR_DIR, f"{nuevo_bene.usuario}.png")
        qr.save(qr_path)

        return {
            "mensaje": "Beneficiario y vehículos registrados correctamente",
            "qr_path": qr_path
        }

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {err}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error inesperado: {str(e)}")


@app.get("/obtener_qr/")
def obtener_qr(usuario: str):
    """
    Obtiene el código QR de un beneficiario por su usuario.
    """
    try:
        qr_path = os.path.join(QR_DIR, f"{usuario}.png")

        if not os.path.exists(qr_path):
            raise HTTPException(status_code=404, detail="QR no encontrado")

        with open(qr_path, "rb") as qr_file:
            qr_base64 = base64.b64encode(qr_file.read()).decode()

        return {"usuario": usuario, "qr": qr_base64}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener el QR: {str(e)}")

# Modelo para login de la app
class LoginApp(BaseModel):
    usuario: str
    contrasena: str

# Endpoint para login en la app
@app.post("/login")
def login(LoginApli: LoginApp):
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT usuario FROM beneficiarios WHERE usuario = %s AND contrasena = %s",
                    (LoginApli.usuario, LoginApli.contrasena))
        usuario = cursor.fetchone()
        cursor.close()

        if usuario:
            return {"success": True, "message": "Inicio de sesión exitoso", "usuario": usuario["usuario"]}
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {err}")

# Endpoint para mostrar todos los empleados
@app.get("/mostrarempleados")
def mostrarempleados():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT id, nombre, apellido, documento, usuario, contrasena, rol FROM roles")
        result = cursor.fetchall()
        cursor.close()

        if not result:
            return {"resultado": []}  # Si no hay resultados, devolver lista vacía

        return {"resultado": jsonable_encoder(result)}  # Devuelve los resultados en formato JSON

    except Exception as error:
        print(f"Error en la base de datos: {error}")  # Muestra el error real en la terminal
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")

# Endpoint para mostrar todos los beneficiarios con sus vehículos
@app.get("/mostrarbeneficiarios")
def mostrarbeneficiarios():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("""
            SELECT 
                b.id, b.nombre, b.apellido, b.documento, b.usuario, b.contrasena, 
                v.placa, v.tipovehiculo 
            FROM beneficiarios b 
            LEFT JOIN vehiculos v ON b.documento = v.documento
        """)
        result = cursor.fetchall()
        cursor.close()

        return {"resultado": jsonable_encoder(result)}  # Devuelve los resultados en formato JSON

    except Exception as error:
        print(f"Error en la base de datos: {error}")  # Muestra el error en la terminal
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")

# Modelo para el login de los roles
class LoginRequest(BaseModel):
    usuario: str
    contrasena: str

# Endpoint para el login de los roles
@app.post("/iniciar_sesion")
def iniciar_sesion(datos: LoginRequest):
    try:
        usuario = datos.usuario
        contrasena = datos.contrasena

# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT * FROM roles WHERE usuario = %s AND contrasena = %s", (usuario, contrasena))
        usuario_encontrado = cursor.fetchone()
        cursor.close()

        if usuario_encontrado:
            return {
                "mensaje": "Inicio de sesión exitoso",
                "usuario": usuario_encontrado["usuario"],
                "rol": usuario_encontrado["rol"]
            }
        else:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")
    


@app.put("/actualizarempleado/{id}")
def actualizarempleado(id:int,nuevorol: Rol):
    try:
        nombre = nuevorol.nombre
        apellido = nuevorol.apellido
        usuario = nuevorol.usuario
        contrasena = nuevorol.contrasena
        documento = nuevorol.documento
        rol = nuevorol.rol
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("""
        UPDATE roles
        SET nombre = %s,
        apellido = %s,
        usuario = %s,
        contrasena = %s,
        documento = %s,
        rol = %s
        WHERE id = %s
        """, (nombre, apellido, usuario, contrasena, documento, rol, id))
        mydb.commit()
        cursor.close()
        return{"informacion":"empleado actualizado"}
    except Exception as error:
        return {"resultado":error}

@app.get("/buscarempleado/{id}")
def buscarempleado(id: int):
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT * FROM roles WHERE id = %s", (id,))
        empleado = cursor.fetchone()  # Obtener el primer resultado
        cursor.close()

        if empleado:
            return {"resultado": empleado}
        else:
            return {"error": "Empleado no encontrado"}
    except Exception as error:
        return {"error": str(error)}

@app.delete("/eliminarempleados/{id}")
def eliminarempleado(id: int):
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)          
        # 1. Eliminar el empleado
        cursor.execute("DELETE FROM roles WHERE id = %s", (id,))
        mydb.commit()

        # 2. Reajustar los IDs secuenciales
        cursor.execute("SET @count = 0")
        cursor.execute("UPDATE roles SET id = @count:= @count + 1")
        cursor.execute("ALTER TABLE roles AUTO_INCREMENT = 1")
        mydb.commit()

        cursor.close()
        return {"informacion": "Empleado eliminado y IDs reorganizados"}
    
    except Exception as error:
        return {"resultado": str(error)}
    


# Modelo para actualizar beneficiario
class VehiculoUpdate(BaseModel):
    placa: str
    tipovehiculo: str

class BeneficiarioUpdate(BaseModel):
    nombre: str
    apellido: str
    documento: int
    usuario: str
    contrasena: str
    vehiculos: Optional[List[VehiculoUpdate]] = []

@app.put("/actualizarbeneficiario/{id}")
def actualizar_beneficiario(id: int, beneficiario: BeneficiarioUpdate):
    try:
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor()

        # 🔹 Verificar si el beneficiario existe
        cursor.execute("SELECT COUNT(*) FROM beneficiarios WHERE id = %s", (id,))
        if cursor.fetchone()[0] == 0:
            raise HTTPException(status_code=404, detail="Beneficiario no encontrado")

        # 🔹 Actualizar beneficiario
        query = """
            UPDATE beneficiarios 
            SET nombre = %s, apellido = %s, documento = %s, usuario = %s, contrasena = %s
            WHERE id = %s
        """
        cursor.execute(query, (
            beneficiario.nombre, beneficiario.apellido, beneficiario.documento, 
            beneficiario.usuario, beneficiario.contrasena, id
        ))

        #Actualizar vehículos si existen
        if beneficiario.vehiculos:
            for vehiculo in beneficiario.vehiculos:
                cursor.execute("""
                    UPDATE vehiculos 
                    SET placa = %s, tipovehiculo = %s
                    WHERE documento = %s AND placa = %s
                """, (vehiculo.placa, vehiculo.tipovehiculo, beneficiario.documento, vehiculo.placa))

        #Confirmar cambios
        mydb.commit()

        return {"mensaje": "Beneficiario y vehículos actualizados correctamente"}

    except mysql.connector.Error as error:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")

    finally:
        cursor.close()
        
        
@app.get("/buscarbeneficiario/{id}")
def buscar_beneficiario(id: int):
    try:
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)
        cursor.execute("""
            SELECT 
                b.id, b.nombre, b.apellido, b.documento, b.usuario, b.contrasena, 
                v.placa, v.tipovehiculo 
            FROM beneficiarios b
            LEFT JOIN vehiculos v ON b.documento = v.documento
            WHERE b.id = %s
        """, (id,))
        
        beneficiario = cursor.fetchone()
        cursor.close()

        print("Beneficiario encontrado:", beneficiario)  # <-- Agrega esta línea

        if not beneficiario:
            raise HTTPException(status_code=404, detail="Beneficiario no encontrado")

        return {"resultado": jsonable_encoder(beneficiario)}

    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")


@app.get("/mostraregingresosalida")
def mostraringresosalida():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT placa, documento, estado, fecha_ingreso, fecha_salida, puesto, valor_parqueo FROM registros")
        result = cursor.fetchall()
        cursor.close()
        
        if not result: 
            return{"resultado":[]}
        return{"resultado": jsonable_encoder(result)}
    
    except Exception as error:
        print(f"Error en la base de datos: {error}")
        raise HTTPException(status_code=500, detail="Error en la base de datos: {error}")
    
    
    
    
@app.delete("/eliminarbeneficiario/{id}")
def eliminar_beneficiario(id: int):
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        # 🔹 Eliminar vehículos relacionados con el beneficiario
        cursor.execute("DELETE FROM vehiculos WHERE documento = (SELECT documento FROM beneficiarios WHERE id = %s)", (id,))

        # 🔹 Eliminar beneficiario
        cursor.execute("DELETE FROM beneficiarios WHERE id = %s", (id,))
        mydb.commit()

        cursor.close()
        return {"informacion": "Beneficiario eliminado correctamente"}
    
    except Exception as error:
        return {"resultado": str(error)}
    
    


@app.get("/puestos/")
def obtener_puestos():

# Creación de un cursor para ejecutar la consulta SQL
    mydb = get_db_connection()  # Abre una nueva conexión
    cursor = mydb.cursor(dictionary=True)  
    try:
        # Obtener los puestos ocupados

        cursor.execute("SELECT puesto FROM registros WHERE estado = 'ingreso'")
        ocupados = {row["puesto"] for row in cursor.fetchall()}

        # Generar lista de puestos con su estado
        puestos = [{"id": i, "estado": "ocupado" if i in ocupados else "disponible"} for i in range(1, 21)]

        return {"puestos": puestos}

    finally:
        cursor.close()





@app.get("/ingreso_dia")
def ingreso_dia():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        fecha_hoy = datetime.now().strftime('%Y-%m-%d')
        
        cursor.execute("SELECT COUNT(*) AS total FROM registros WHERE DATE(fecha_ingreso) = %s", (fecha_hoy,))
        resultado = cursor.fetchone()

        cursor.close()

        
        return {"ingreso_dia": resultado["total"]}
    
    except Exception as error:
        return {"error": str(error)}
    
    
@app.get("/salida_dia")
def salida_dia():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        fecha_hoy = datetime.now().strftime('%Y-%m-%d')
        
        cursor.execute("SELECT COUNT(*) AS total FROM registros WHERE fecha_salida IS NOT NULL AND DATE(fecha_salida) = %s", (fecha_hoy,))
        resultado = cursor.fetchone()
        
        cursor.close()
        
        return {"salida_dia": resultado["total"]}
    
    except Exception as error:
        return {"error": str(error)}

@app.get("/total_bene")
def total_bene():
    try:
# Creación de un cursor para ejecutar la consulta SQL
        mydb = get_db_connection()  # Abre una nueva conexión
        cursor = mydb.cursor(dictionary=True)  
        cursor.execute("SELECT COUNT(*) AS total FROM beneficiarios")
        resultado = cursor.fetchone()

        cursor.close()
        return {"total_beneficiarios": resultado["total"]}
        
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")


class Contacto(BaseModel):
    nombre: str
    telefono: int
    email: str
    mensaje: str

@app.post("/contactar")
def contactar(enviar: Contacto):
    try:
        mydb = get_db_connection()  # Asegurar conexión válida
        cursor = mydb.cursor()

        comando = "INSERT INTO contactos (nombre, telefono, email, mensaje) VALUES (%s, %s, %s, %s)"
        valores = (enviar.nombre, enviar.telefono, enviar.email, enviar.mensaje)

        cursor.execute(comando, valores)
        mydb.commit()

        return {"mensaje": "Información enviada correctamente", "datos": valores}

    except mysql.connector.Error as error:
        mydb.rollback()
        raise HTTPException(status_code=500, detail=f"Error en la base de datos: {error}")

    finally:
        cursor.close()
        mydb.close()