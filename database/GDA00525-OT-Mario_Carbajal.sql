-- SCRIPT DE CREACION DE BASE DE DATOS.
-- PARTICIPANTE: GDA00587-OT / Mario Carbajal.

/**
	Creacion de BD
**/
IF EXISTS (SELECT * FROM sys.databases WHERE name = 'GDA00525_OT_MarioCarbajal')
    DROP DATABASE GDA00525_OT_MarioCarbajal;
GO 

IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'GDA00525_OT_MarioCarbajal')
    CREATE DATABASE GDA00525_OT_MarioCarbajal;
GO

USE GDA00525_OT_MarioCarbajal;
GO

/**
	Creacion de Tablas
**/
-- TABLA: Roles
CREATE TABLE tb_Roles (
	idRol INT IDENTITY(1,1) PRIMARY KEY,
	rol NVARCHAR(32) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NULL
);
GO

-- TABLA: Empresas
CREATE TABLE tb_Empresas (
	idEmpresa INT IDENTITY(1,1) PRIMARY KEY,
	razon_social NVARCHAR(255) NOT NULL,
	nombre_comercial NVARCHAR(255) UNIQUE NOT NULL,
	nit NVARCHAR(12) UNIQUE NOT NULL,
	telefono NVARCHAR(8) UNIQUE NOT NULL,
    email NVARCHAR(128) UNIQUE NOT NULL
);
GO

-- TABLA: Usuarios
CREATE TABLE tb_Usuarios (
    idUsuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_completo NVARCHAR(255) NOT NULL,
	username NVARCHAR(32) UNIQUE NOT NULL,
    passphrase NVARCHAR(255) NOT NULL,
    telefono NVARCHAR(8) NOT NULL,
    email NVARCHAR(128) UNIQUE NOT NULL,
	direccion NVARCHAR(255) NOT NULL,
    fecha_nacimiento DATE,
    fecha_creacion DATETIME DEFAULT GETDATE(),   
    isSuperUser BIT DEFAULT 0,
    isActive BIT DEFAULT 0,
	rol_idRol INT NOT NULL,
	empresa_idEmpresa INT NOT NULL,
	CONSTRAINT FK_Rol FOREIGN KEY (rol_idRol) REFERENCES tb_Roles(idRol),
    CONSTRAINT FK_Empresa FOREIGN KEY (empresa_idEmpresa) REFERENCES tb_Empresas(idEmpresa)
);
GO

-- TABLA: Categoria Productos
CREATE TABLE tb_Categorias_Productos (
	idCategoriaProducto INT IDENTITY(1,1) PRIMARY KEY,
	nombre NVARCHAR(32) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NULL,
	fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- TABLA: Marcas Productos
CREATE TABLE tb_Marcas_Productos (
	idMarcaProductos INT IDENTITY(1,1) PRIMARY KEY,
	nombre NVARCHAR(32) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NULL,
	fecha_creacion DATETIME DEFAULT GETDATE()
);
GO
	
-- TABLA: Productos
CREATE TABLE tb_Productos (
	idProducto INT IDENTITY(1,1) PRIMARY KEY,
	codigo NVARCHAR(8) UNIQUE NOT NULL,
	nombre NVARCHAR(128) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NOT NULL,
	precio_compra DECIMAL(7,2) NOT NULL,
	precio_venta DECIMAL(7,2) NOT NULL,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	stock INT NOT NULL,
	imagen VARBINARY(MAX) NOT NULL,
	isActive BIT DEFAULT 1,
	categoria_idCategoria INT NOT NULL,
	marca_idMarca INT NOT NULL,
	CONSTRAINT FK_Categoria FOREIGN KEY (categoria_idCategoria) REFERENCES tb_Categorias_Productos(idCategoriaProducto),
    CONSTRAINT FK_Marca FOREIGN KEY (marca_idMarca) REFERENCES tb_Marcas_Productos(idMarcaProductos)
)
GO

-- TABLA: Ordenes
CREATE TABLE tb_Ordenes (
	idOrden INT IDENTITY(1,1) PRIMARY KEY,
	total_orden DECIMAL(9,2) NOT NULL,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	status_Orden TINYINT NOT NULL CHECK (status_Orden BETWEEN 0 AND 5), 
	isActive BIT DEFAULT 1,
	usuarioCliente_idUsuario INT NOT NULL,
	usuarioVendedor_idUsuario INT NULL,
	CONSTRAINT FK_Cliente FOREIGN KEY (usuarioCliente_idUsuario) REFERENCES tb_Usuarios(idUsuario),
    CONSTRAINT FK_Vendedor FOREIGN KEY (usuarioVendedor_idUsuario) REFERENCES tb_Usuarios(idUsuario)
)
GO

-- TABLA: Detalles Orden
CREATE TABLE tb_Detalles_Orden (
	idDetalleOrden INT IDENTITY(1,1) PRIMARY KEY,
	cantidad INT NOT NULL,
	subtotal DECIMAL(9,2) NOT NULL,
	producto_idProducto INT NOT NULL,
	orden_idOrden INT NOT NULL,
	CONSTRAINT FK_Producto FOREIGN KEY (producto_idProducto) REFERENCES tb_Productos(idProducto),
	CONSTRAINT FK_Orden FOREIGN KEY (orden_idOrden) REFERENCES tb_Ordenes(idOrden)
)
GO

/**
	Creacion de Procedimientos Almacenados
**/

/** PROCEDIMIENTOS TABLA ROLES **/
-- Procedimiento: Crear Rol
CREATE PROCEDURE sp_Crear_Rol
    @rol NVARCHAR(32),
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Roles (rol, descripcion)
    VALUES (@rol, @descripcion);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO
-- Procedimiento: Editar Rol
CREATE PROCEDURE sp_Editar_Rol
    @idRol INT,
    @rol NVARCHAR(32) = NULL,
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Roles
    SET
        rol = ISNULL(@rol, rol),
        descripcion = ISNULL(@descripcion, descripcion)
    WHERE idRol = @idRol;
END;
GO

/** PROCEDIMIENTOS TABLA EMPRESA **/
-- Procedimiento: Crear Empresa
CREATE PROCEDURE sp_Crear_Empresa
    @razon_social NVARCHAR(255),
    @nombre_comercial NVARCHAR(255),
    @nit NVARCHAR(12),
    @telefono NVARCHAR(8),
    @email NVARCHAR(128)
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Empresas (razon_social, nombre_comercial, nit, telefono, email)
    VALUES (@razon_social, @nombre_comercial, @nit, @telefono, @email);
	SELECT SCOPE_IDENTITY() AS NuevoID; 
END;
GO

-- Procedimiento: Editar Empresa
CREATE PROCEDURE sp_Editar_Empresa
    @idEmpresa INT,
    @razon_social NVARCHAR(255) = NULL,
    @nombre_comercial NVARCHAR(255) = NULL,
    @nit NVARCHAR(12) = NULL,
    @telefono NVARCHAR(8) = NULL,
    @email NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Empresas
    SET
        razon_social = ISNULL(@razon_social, razon_social),
        nombre_comercial = ISNULL(@nombre_comercial, nombre_comercial),
        nit = ISNULL(@nit, nit),
        telefono = ISNULL(@telefono, telefono),
        email = ISNULL(@email, email)
    WHERE idEmpresa = @idEmpresa;
END;
GO

/** PROCEDIMIENTOS TABLA USUARIO **/
-- Procedimiento: Crear Usuario
CREATE PROCEDURE sp_Crear_Usuario
    @nombre_completo NVARCHAR(255),
    @username NVARCHAR(32),
    @passphrase NVARCHAR(255),
    @telefono NVARCHAR(8),
    @email NVARCHAR(128),
    @direccion NVARCHAR(255),
    @fecha_nacimiento DATE,
    @isSuperUser BIT = 0,
    @isActive BIT = 0,
    @rol_idRol INT,
    @empresa_idEmpresa INT
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Usuarios (nombre_completo, username, passphrase, telefono, email, direccion, fecha_nacimiento, isSuperUser, isActive, rol_idRol, empresa_idEmpresa)
    VALUES (@nombre_completo, @username, @passphrase, @telefono, @email, @direccion, @fecha_nacimiento, @isSuperUser, @isActive, @rol_idRol, @empresa_idEmpresa);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Usuario
CREATE PROCEDURE sp_Editar_Usuario
    @idUsuario INT,
    @nombre_completo NVARCHAR(255) = NULL,
    @username NVARCHAR(32) = NULL,
    @passphrase NVARCHAR(255) = NULL,
    @telefono NVARCHAR(8) = NULL,
    @email NVARCHAR(128) = NULL,
    @direccion NVARCHAR(255) = NULL,
    @fecha_nacimiento DATE = NULL,
    @isSuperUser BIT = NULL,
    @isActive BIT = NULL,
    @rol_idRol INT = NULL,
    @empresa_idEmpresa INT = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Usuarios
    SET
        nombre_completo = ISNULL(@nombre_completo, nombre_completo),
        username = ISNULL(@username, username),
        passphrase = ISNULL(@passphrase, passphrase),
        telefono = ISNULL(@telefono, telefono),
        email = ISNULL(@email, email),
        direccion = ISNULL(@direccion, direccion),
        fecha_nacimiento = ISNULL(@fecha_nacimiento, fecha_nacimiento),
        isSuperUser = ISNULL(@isSuperUser, isSuperUser),
        isActive = ISNULL(@isActive, isActive),
        rol_idRol = ISNULL(@rol_idRol, rol_idRol),
        empresa_idEmpresa = ISNULL(@empresa_idEmpresa, empresa_idEmpresa)
    WHERE idUsuario = @idUsuario;
END;
GO

/** PROCEDIMIENTOS TABLA CATEGORIA PRODUCTO **/
-- Procedimiento: Crear Categoria Producto
CREATE PROCEDURE sp_Crear_Categoria_Producto
    @nombre NVARCHAR(32),
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Categorias_Productos (nombre, descripcion)
    VALUES (@nombre, @descripcion);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Categoria Producto
CREATE PROCEDURE sp_Editar_Categoria_Producto
    @idCategoriaProducto INT,
    @nombre NVARCHAR(32) = NULL,
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Categorias_Productos
    SET
        nombre = ISNULL(@nombre, nombre),
        descripcion = ISNULL(@descripcion, descripcion)
    WHERE idCategoriaProducto = @idCategoriaProducto;
END;
GO

/** PROCEDIMIENTOS TABLA MARCA PRODUCTO **/
-- Procedimiento: Crear Marca Producto
CREATE PROCEDURE sp_Crear_Marca_Producto
    @nombre NVARCHAR(32),
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Marcas_Productos (nombre, descripcion)
    VALUES (@nombre, @descripcion);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Marca Producto
CREATE PROCEDURE sp_Editar_Marca_Producto
    @idMarcaProductos INT,
    @nombre NVARCHAR(32) = NULL,
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Marcas_Productos
    SET
        nombre = ISNULL(@nombre, nombre),
        descripcion = ISNULL(@descripcion, descripcion)
    WHERE idMarcaProductos = @idMarcaProductos;
END;
GO

/** PROCEDIMIENTOS TABLA PRODUCTO **/
-- Procedimiento: Crear Producto
CREATE PROCEDURE sp_Crear_Producto
    @codigo NVARCHAR(8),
    @nombre NVARCHAR(128),
    @descripcion NVARCHAR(128),
    @precio_compra DECIMAL(7,2),
    @precio_venta DECIMAL(7,2),
    @stock INT,
    @imagen VARBINARY(MAX),
    @isActive BIT = 1,
    @categoria_idCategoria INT,
    @marca_idMarca INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO tb_Productos (codigo, nombre, descripcion, precio_compra, precio_venta, stock, imagen, isActive, categoria_idCategoria, marca_idMarca)
    VALUES (@codigo, @nombre, @descripcion, @precio_compra, @precio_venta, @stock, @imagen, @isActive, @categoria_idCategoria, @marca_idMarca);
    SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Producto
CREATE PROCEDURE sp_Editar_Producto
    @idProducto INT,
    @codigo NVARCHAR(8) = NULL,
    @nombre NVARCHAR(128) = NULL,
    @descripcion NVARCHAR(128) = NULL,
    @precio_compra DECIMAL(7,2) = NULL,
    @precio_venta DECIMAL(7,2) = NULL,
    @stock INT = NULL, -- Puede ser positivo o negativo para venta/restock
    @imagen VARBINARY(MAX) = NULL,
    @isActive BIT = NULL,
    @isOffer BIT = NULL,
    @descuento_Offer FLOAT = NULL, -- FLOAT percentil multiplicador para descuentos
    @categoria_idCategoria INT = NULL,
    @marca_idMarca INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE tb_Productos
    SET
        codigo = ISNULL(@codigo, codigo),
        nombre = ISNULL(@nombre, nombre),
        descripcion = ISNULL(@descripcion, descripcion),
        precio_compra = ISNULL(@precio_compra, precio_compra),
        precio_venta = ISNULL(@precio_venta, precio_venta),
        stock = ISNULL(@stock, stock),
        imagen = ISNULL(@imagen, imagen),
        isActive = ISNULL(@isActive, isActive),
        categoria_idCategoria = ISNULL(@categoria_idCategoria, categoria_idCategoria),
        marca_idMarca = ISNULL(@marca_idMarca, marca_idMarca)
    WHERE idProducto = @idProducto;
END;
GO

-- Procedimiento: Venta/Restock Productos
CREATE PROCEDURE sp_Venta_Restock_Productos
    @idProducto INT,
    @cantidad INT,
    @nuevoPrecioCompra DECIMAL(7,2) = NULL,
    @nuevoPrecioVenta DECIMAL(7,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE tb_Productos
    SET 
        stock = stock + @cantidad, 
        precio_compra = ISNULL(@nuevoPrecioCompra, precio_compra), 
        precio_venta = ISNULL(@nuevoPrecioVenta, precio_venta)
    WHERE idProducto = @idProducto;
END;
GO

/** 
	PROCEDIMIENTOS TABLA ORDEN 
**/
-- Procedimiento: Crear Orden con sus detalles
CREATE PROCEDURE sp_Crear_Orden_Y_Detalles
    @total_orden DECIMAL(9,2),
    @status_Orden TINYINT,
    @usuarioCliente_idUsuario INT,
    @usuarioVendedor_idUsuario INT = NULL,
    @fecha_creacion DATETIME = NULL,
    @detalles NVARCHAR(MAX) -- JSON con los detalles de la orden
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Establece la fecha de creación si no se proporciona
        SET @fecha_creacion = ISNULL(@fecha_creacion, GETDATE());

        -- Inserta la orden y obtiene el ID generado
        INSERT INTO tb_Ordenes (total_orden, status_Orden, usuarioCliente_idUsuario, usuarioVendedor_idUsuario, fecha_creacion)
        VALUES (@total_orden, @status_Orden, @usuarioCliente_idUsuario, @usuarioVendedor_idUsuario, @fecha_creacion);

        DECLARE @nuevoIdOrden INT = SCOPE_IDENTITY();

        -- Procesa el JSON para insertar los detalles de la orden
        INSERT INTO tb_Detalles_Orden (cantidad, subtotal, producto_idProducto, orden_idOrden)
        SELECT
            detalles.cantidad,
            detalles.subtotal,
            detalles.producto_idProducto,
            @nuevoIdOrden
        FROM OPENJSON(@detalles) WITH (
            cantidad INT '$.cantidad',
            subtotal DECIMAL(9,2) '$.subtotal',
            producto_idProducto INT '$.producto_idProducto'
        ) AS detalles;

        COMMIT TRANSACTION;

        -- Devuelve el ID de la nueva orden
        SELECT @nuevoIdOrden AS NuevoID;
    END TRY
    BEGIN CATCH
        -- Si ocurre un error, revierte la transacción
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Procedimiento: Crear Orden
CREATE PROCEDURE sp_Crear_Orden
    @total_orden DECIMAL(9,2),
    @status_Orden TINYINT,
    @usuarioCliente_idUsuario INT,
    @usuarioVendedor_idUsuario INT = NULL,
    @fecha_creacion DATETIME = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SET @fecha_creacion = ISNULL(@fecha_creacion, GETDATE());
    INSERT INTO tb_Ordenes (total_orden, status_Orden, usuarioCliente_idUsuario, usuarioVendedor_idUsuario, fecha_creacion)
    VALUES (@total_orden, @status_Orden, @usuarioCliente_idUsuario, @usuarioVendedor_idUsuario, @fecha_creacion);
    SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Orden
CREATE PROCEDURE sp_Editar_Orden
    @idOrden INT,
    @total_orden DECIMAL(9,2) = NULL,
    @status_Orden TINYINT = NULL,
    @isActive BIT = NULL,
    @usuarioCliente_idUsuario INT = NULL,
    @usuarioVendedor_idUsuario INT = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Ordenes
    SET
        total_orden = ISNULL(@total_orden, total_orden),
        status_Orden = ISNULL(@status_Orden, status_Orden),
        isActive = ISNULL(@isActive, isActive),
        usuarioCliente_idUsuario = ISNULL(@usuarioCliente_idUsuario, usuarioCliente_idUsuario),
        usuarioVendedor_idUsuario = ISNULL(@usuarioVendedor_idUsuario, usuarioVendedor_idUsuario)
    WHERE idOrden = @idOrden;
END;
GO

/** 
	PROCEDIMIENTOS TABLA DETALLES ORDEN 
**/
-- Procedimiento: Crear Detalle Orden en enormes cantidades
CREATE PROCEDURE sp_Crear_Detalle_Orden_nCantidad (@detalles NVARCHAR(MAX))
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @sql NVARCHAR(MAX);
    IF RIGHT(@detalles, 1) = ','
    BEGIN
        SET @detalles = LEFT(@detalles, LEN(@detalles) - 1);
    END
    SET @sql = '
        INSERT INTO 
            tb_Detalles_Orden (cantidad, subtotal, producto_idProducto, orden_idOrden) 
        VALUES ' + @detalles;
    EXEC sp_executesql @sql;
END
GO

-- Procedimiento: Crear Detalle Orden 1 por 1
CREATE PROCEDURE sp_Crear_Detalle_Orden_1por1
    @cantidad DECIMAL(9,2),
    @subtotal INT,
    @producto_idProducto INT,
    @orden_idOrden INT
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Detalles_Orden (cantidad, subtotal, producto_idProducto, orden_idOrden)
    VALUES (@cantidad, @subtotal, @producto_idProducto, @orden_idOrden);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Cambiar Status de Orden
CREATE PROCEDURE sp_Editar_Detalle_Orden
    @idDetalleOrden INT,
    @cantidad DECIMAL(9,2) = NULL,
    @subtotal INT = NULL,
    @producto_idProducto INT = NULL,
    @orden_idOrden INT = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Detalles_Orden
    SET
        cantidad = ISNULL(@cantidad, cantidad),
        subtotal = ISNULL(@subtotal, subtotal),
        producto_idProducto = ISNULL(@producto_idProducto, producto_idProducto),
        orden_idOrden = ISNULL(@orden_idOrden, orden_idOrden)
    WHERE idDetalleOrden = @idDetalleOrden;
END;
GO

/**
	VIEWS
	Creacion de Views de tablas
**/

--A CREACION DE LA VISTA PARA PRODUCTOS ACTIVOS CON STOCK MAYOR A 0
CREATE VIEW vw_Productos_Activos AS
SELECT 
    pro.idProducto,
    pro.codigo,
    pro.nombre AS Nombre_Producto,
    pro.descripcion AS Descripcion_Producto,
    pro.precio_compra,
    pro.precio_venta,
    pro.fecha_creacion,
    pro.stock,
    pro.isActive,
    cat.nombre AS Categoria,
    mar.nombre AS Marca
FROM 
    tb_Productos pro
INNER JOIN 
    tb_Categorias_Productos cat ON pro.categoria_idCategoria = cat.idCategoriaProducto
INNER JOIN 
    tb_Marcas_Productos mar ON pro.marca_idMarca = mar.idMarcaProductos
WHERE 
    pro.isActive = 1 AND pro.stock > 0;
GO

--B CREACION DE LA VISTA PARA VENTAS DE AGOSTO 2024
CREATE VIEW vw_TotalQuetzales_Ordenes_Agosto2024 AS
SELECT 
    SUM(total_orden) AS Total_Quetzales
FROM 
    tb_Ordenes
WHERE 
    isActive = 1
    AND YEAR(fecha_creacion) = 2024
    AND MONTH(fecha_creacion) = 8;
GO

--C CREACION DE LA VISTA PARA TOP 10 CLIENTES CONSUMIDORES
CREATE VIEW vw_Top10_Clientes_MayorConsumo AS
SELECT TOP 10
    usr.idUsuario AS ID_Cliente,
    usr.nombre_completo AS Nombre_Cliente,
    usr.email AS Email_Cliente,
    SUM(ord.total_orden) AS Total_Consumo
FROM 
    tb_Usuarios usr
INNER JOIN 
    tb_Ordenes ord ON usr.idUsuario = ord.usuarioCliente_idUsuario
WHERE 
    ord.isActive = 1
GROUP BY 
    usr.idUsuario, usr.nombre_completo, usr.email
ORDER BY 
    Total_Consumo DESC;
GO

--D CREACION DE LA VISTA PARA TOP 10 PRODUCTOS VENDIDOS
CREATE VIEW vw_Top10_Productos_MasVendidos AS
SELECT TOP 10
    pro.idProducto AS ID_Producto,
    pro.nombre AS Nombre_Producto,
    pro.codigo AS Codigo_Producto,
	pro.precio_compra AS Precio_Compra,
	pro.precio_venta AS Precio_Venta,
    SUM(det.cantidad) AS Total_Cantidad,
    SUM(det.subtotal) AS Total_Vendido,
    SUM(det.cantidad * (pro.precio_venta - pro.precio_compra)) AS Ganancia
FROM 
    tb_Productos pro
INNER JOIN 
    tb_Detalles_Orden det ON pro.idProducto = det.producto_idProducto
INNER JOIN 
    tb_Ordenes ord ON det.orden_idOrden = ord.idOrden
WHERE
    ord.isActive = 1
GROUP BY 
    pro.idProducto, 
    pro.nombre, 
    pro.codigo, 
    pro.precio_compra, 
    pro.precio_venta
ORDER BY 
    Total_Cantidad ASC;
GO


/**
	REGISTROS
	INSERCION DE DATA DE EJEMPLO
**/

-- Datos: ROLES
EXEC sp_Crear_Rol 'Administrador', 'Es quien administra los usuarios de los vendedores y los clientes.';
GO
EXEC sp_Crear_Rol 'Vendedor', 'Es quien autoriza los pedidos de los clientes.';
GO
EXEC sp_Crear_Rol 'Cliente', 'Es un usuario que adquiere nuestros productos';
GO

-- Datos: EMPRESAS
EXEC sp_Crear_Empresa 'Mi tiendita online S.A de C.V', 'Mi Tiendita Online', '2410533-5', '12345678', 'mi_tiendita@conglomerado.com';
GO
EXEC sp_Crear_Empresa 'Comerciales Ibarra', 'Comerciales Ibarra', '153544-1', '23456789', 'contacto1@gmail.com';
GO
EXEC sp_Crear_Empresa 'Innovaciónes Alvarez', 'Tecnomeca', '2521533-6', '34567890', 'contacto2@gmail.com';
GO
EXEC sp_Crear_Empresa 'Tecnologíca de Asociados S.A', 'Tecnología Disruptiva', '1232567-8', '45678901', 'contacto3@gmail.com';
GO
EXEC sp_Crear_Empresa 'Servicios Electronicos', 'Electro Servicios', '8539577-2', '56789012', 'contacto4@gmail.com';
GO

-- Datos: USUARIOS
--admin
EXEC sp_Crear_Usuario 
	'Mario Carbajal', 'Administrador_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'21121221', 'adminMarioCarbajal@conglomerado.com',
	'4 Ave, entre 12 calle A y 12 calle B, Zona 1, Chiquimula', '1997-12-21',
	1, 1, 1, 1;
GO
--vendedor
EXEC sp_Crear_Usuario 
	'Carlos Carbajal', 'Vendedor_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'23456789', 'ventasCarlosCarbajal@conglomerado.com', 
	'Calle Real 456', '2002-04-17', 
	0, 1, 2, 1;
GO
--cliente empresa - comerciales ibarra
EXEC sp_Crear_Usuario 
	'Carlos Ibarra', 'CarlosIbarra_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'34567890', 'carlos@gmail.com', 
	'Avenida Siempre Viva 789', '1980-03-10', 
	0, 1, 3, 2;
GO
--cliente empresa - innovaciones alvarez
EXEC sp_Crear_Usuario 
	'Ana Alvarez', 'AnaAlvarez_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'45678901', 'ana@gmail.com', 
	'Calle Luna 234', '1992-07-22', 
	0, 1, 3, 3;
GO
--cliente empresa - tecnologica de asociados S.A
EXEC sp_Crear_Usuario 
	'Alberto Sanchez', 'AlbertoSanchez_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'42235163', 'alberto@gmail.com', 
	'Calle Luna 234', '1992-07-22', 
	0, 1, 3, 4;
GO
--cliente empresa - servicios electronicos
EXEC sp_Crear_Usuario 
	'Luisa Dominguez', 'LuisaDominguez_001', 
	'$2b$10$FpxW7cimo4lOGicNAsdon.udBoam5xX5jTbQFw5iAyVTeni5mvAHO', 
	'42235163', 'luisa@gmail.com', 
	'Calle Luna 234', '1992-07-22', 
	0, 1, 3, 5;
GO

-- Datos: MARCAS PRODUCTOS
EXEC sp_Crear_Marca_Producto 'Samsung', 'Marca de tecnología de consumo.';
GO
EXEC sp_Crear_Marca_Producto 'Sony', 'Marca de artículos de tecnologia de consumo variada.';
GO
EXEC sp_Crear_Marca_Producto 'LG', 'Marca de electrónica y electrodomésticos';
GO
EXEC sp_Crear_Marca_Producto 'Apple', 'Marca de tecnología de artículos premium.';
GO
EXEC sp_Crear_Marca_Producto 'Microsoft', 'Marca proveedora de licencias de ofimática.';
GO

-- Datos: CATEGORIAS PRODUCTOS
EXEC sp_Crear_Categoria_Producto 'Telefonía', 'Categoría para productos de telefonía movil.';
GO
EXEC sp_Crear_Categoria_Producto 'Oficina', 'Categoría para productos electrónicos de oficina.';
GO
EXEC sp_Crear_Categoria_Producto 'Entretenimiento', 'Categoría para productos electrónicos de Entretenimiento.';
GO
EXEC sp_Crear_Categoria_Producto 'Línea Blanca', 'Categoría para productos electrónicos de Entretenimiento.';
GO
EXEC sp_Crear_Categoria_Producto 'Licencias', 'Categoría para productos de Activación de Software.';
GO

-- Datos: PRODUCTOS
EXEC sp_Crear_Producto '1001', 'Smartphone Samsung Galaxy', 'Smartphone de gama alta.', 2000.00, 4500.00, 95, 0x123456, 1, 1, 1;
GO
EXEC sp_Crear_Producto '1002', 'Consola de Videojuegos Playstation 5', 'Consola de Videojuegos de ultima generación.', 3000.00, 5000.00, 90, 0x123456, 1, 3, 2;
GO
EXEC sp_Crear_Producto '1003', 'Smartphone Iphone 13', 'Smartphone de gama alta.', 7500.00, 10000.00, 98, 0x123456, 1, 1, 4;
GO
EXEC sp_Crear_Producto '1004', 'Lavadora y Secadora LG', 'Máquina automática lavadora y secadora de ropa.', 1500.00, 3000.00, 95, 0x123456, 1, 4, 3;
GO
EXEC sp_Crear_Producto '1005', 'Impresora y Scanner de documentos', 'Equipo de oficina de escaneo e impresión de documentos.', 250.00, 400.00, 70, 0x123456, 1, 2, 3;
GO
EXEC sp_Crear_Producto '1006', 'Licencia de Activación Office 365', 'Clave de activación ORM de software.', 250.00, 400.00, 80, 0x123456, 1, 5, 5;
GO

-- Datos: ORDENES Y DETALLES RESPECTIVOS


-- Data: Orden 1
DECLARE @detalles NVARCHAR(MAX) = '[
    {"cantidad": 5, "subtotal": 15000.00, "producto_idProducto": 4},
    {"cantidad": 5, "subtotal": 22500.00, "producto_idProducto": 1}
]';
EXEC sp_Crear_Orden_Y_Detalles 
    @total_orden = 37500.00,
    @status_Orden = 2,
    @usuarioCliente_idUsuario = 3,
    @usuarioVendedor_idUsuario = 2,
	@fecha_Creacion = '2024-08-01 08:00:00',
    @detalles = @detalles;
GO

-- Data: Orden 2
DECLARE @detalles NVARCHAR(MAX) = '[
    {"cantidad": 10, "subtotal": 50000.00, "producto_idProducto": 2},
    {"cantidad": 25, "subtotal": 10000.00, "producto_idProducto": 5}
]';
EXEC sp_Crear_Orden_Y_Detalles 
    @total_orden = 60000.00,
    @status_Orden = 2,
    @usuarioCliente_idUsuario = 4,
    @usuarioVendedor_idUsuario = 2,
	@fecha_Creacion = '2024-08-15 14:30:00',
    @detalles = @detalles;
GO

-- Data: Orden 3
DECLARE @detalles NVARCHAR(MAX) = '[
    {"cantidad": 2, "subtotal": 20000.00, "producto_idProducto": 3},
    {"cantidad": 5, "subtotal": 2000.00, "producto_idProducto": 5},
    {"cantidad": 20, "subtotal": 8000.00, "producto_idProducto": 6}
]';
EXEC sp_Crear_Orden_Y_Detalles 
    @total_orden = 20000.00,
    @status_Orden = 2,
    @usuarioCliente_idUsuario = 5,
    @usuarioVendedor_idUsuario = 2,
	@fecha_Creacion = '2024-08-20 09:45:00',
    @detalles = @detalles;
GO

-- Data: Orden 4
DECLARE @detalles NVARCHAR(MAX) = '[
    {"cantidad": 5, "subtotal": 22500.00, "producto_idProducto": 1}
]';
EXEC sp_Crear_Orden_Y_Detalles 
    @total_orden = 22500.00,
    @status_Orden = 2,
    @usuarioCliente_idUsuario = 6,
    @usuarioVendedor_idUsuario = 2,
	@fecha_Creacion = '2024-08-31 18:00:00',
    @detalles = @detalles;
GO

/**
	SELECT DE VIEWS DE DATOS DE PRUEBA
**/

--A
SELECT * FROM vw_Productos_Activos;

--B
SELECT * FROM vw_TotalQuetzales_Ordenes_Agosto2024;

--C
SELECT * FROM vw_Top10_Clientes_MayorConsumo;

--D
SELECT * FROM vw_Top10_Productos_MasVendidos;
