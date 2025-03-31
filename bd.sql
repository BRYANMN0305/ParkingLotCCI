CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT UNIQUE, 
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    usuario VARCHAR(20) NOT NULL UNIQUE,
    contrasena VARCHAR(30) NOT NULL,
    documento INT(10) UNIQUE NOT NULL,
    rol VARCHAR(20) NOT NULL,
    PRIMARY KEY (documento)
);


CREATE TABLE beneficiarios (
    id INT NOT NULL AUTO_INCREMENT UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    apellido VARCHAR(255) NOT NULL,
    documento INT UNIQUE NOT NULL,
    telefono INT NOT NULL,
    usuario VARCHAR(20) NOT NULL UNIQUE,
    contrasena VARCHAR(30) NOT NULL,
    PRIMARY KEY(documento)
);

CREATE TABLE vehiculos (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,  
    tipovehiculo VARCHAR(20),
    documento INT,  
    FOREIGN KEY (documento) REFERENCES beneficiarios(documento) ON DELETE CASCADE
);

CREATE TABLE registros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(10) NOT NULL,
    documento VARCHAR(20) NOT NULL,
    estado ENUM('ingreso', 'salida') NOT NULL,
    fecha_ingreso DATETIME NOT NULL,
    fecha_salida DATETIME DEFAULT NULL,
    puesto INT NOT NULL,
    valor_parqueo DECIMAL(10,2) NOT NULL
);

CREATE TABLE contactos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    telefono INT(10),
    email VARCHAR(100),
    mensaje VARCHAR(10000)
);
