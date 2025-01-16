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
	nombre NVARCHAR(32) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NULL
);
GO

-- TABLA: Empresas
CREATE TABLE tb_Empresas (
	idEmpresa INT IDENTITY(1,1) PRIMARY KEY,
	razon_social NVARCHAR(255) UNIQUE NOT NULL,
	nombre_comercial NVARCHAR(255) UNIQUE NOT NULL,
	nit NVARCHAR(12) UNIQUE NOT NULL,
	telefono NVARCHAR(8) NOT NULL,
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
	descripcion NVARCHAR(255) NULL,
	fecha_creacion DATETIME DEFAULT GETDATE()
);
GO

-- TABLA: Marcas Productos
CREATE TABLE tb_Marcas_Productos (
	idMarcaProducto INT IDENTITY(1,1) PRIMARY KEY,
	nombre NVARCHAR(32) UNIQUE NOT NULL,
	descripcion NVARCHAR(255) NULL,
	fecha_creacion DATETIME DEFAULT GETDATE()
);
GO
	
-- TABLA: Productos
CREATE TABLE tb_Productos (
	idProducto INT IDENTITY(1,1) PRIMARY KEY,
	codigo NVARCHAR(8) UNIQUE NOT NULL,
	nombre NVARCHAR(128) UNIQUE NOT NULL,
	descripcion NVARCHAR(128) NOT NULL,
	precio_compra DECIMAL(7,2) DEFAULT 0.00,
	precio_venta DECIMAL(7,2) DEFAULT 0.00,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	stock INT DEFAULT 0,
	imagen NVARCHAR(255) NOT NULL,
	isActive BIT DEFAULT 1,
	categoria_idCategoria INT NOT NULL,
	marca_idMarca INT NOT NULL,
	CONSTRAINT FK_Categoria FOREIGN KEY (categoria_idCategoria) REFERENCES tb_Categorias_Productos(idCategoriaProducto),
    CONSTRAINT FK_Marca FOREIGN KEY (marca_idMarca) REFERENCES tb_Marcas_Productos(idMarcaProducto)
)
GO

-- TABLA: Ingresos Stock Productos
CREATE TABLE tb_Ingresos_Productos_Stock (
	idIngresoStock INT IDENTITY(1,1) PRIMARY KEY,
	cantidad INT NOT NULL,
	precio_compra DECIMAL(7,2) NOT NULL,
	precio_venta DECIMAL(7,2) NOT NULL,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	producto_idProducto INT NOT NULL,
	CONSTRAINT FK_ProductoIngSto FOREIGN KEY (producto_idProducto) REFERENCES tb_Productos(idProducto),
)
GO

-- TABLA: Ordenes
CREATE TABLE tb_Ordenes (
	idOrden INT IDENTITY(1,1) PRIMARY KEY,
	total_orden DECIMAL(9,2) NOT NULL,
	fecha_creacion DATETIME DEFAULT GETDATE(),
	status_Orden TINYINT NOT NULL CHECK (status_Orden BETWEEN 0 AND 3), 
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
	precio_venta DECIMAL(9,2) NOT NULL,
	subtotal DECIMAL(9,2) NOT NULL,
	producto_idProducto INT NOT NULL,
	orden_idOrden INT NOT NULL,
	CONSTRAINT FK_ProductoDetOrd FOREIGN KEY (producto_idProducto) REFERENCES tb_Productos(idProducto),
	CONSTRAINT FK_Orden FOREIGN KEY (orden_idOrden) REFERENCES tb_Ordenes(idOrden)
)
GO

/**
	Creacion de Procedimientos Almacenados
**/

/** PROCEDIMIENTOS TABLA ROLES **/
-- Procedimiento: Crear Rol
CREATE PROCEDURE sp_Crear_Rol
    @nombre NVARCHAR(32),
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    INSERT INTO tb_Roles (nombre, descripcion)
    VALUES (@nombre, @descripcion);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO
-- Procedimiento: Editar Rol
CREATE PROCEDURE sp_Editar_Rol
    @idRol INT,
    @nombre NVARCHAR(32) = NULL,
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Roles
    SET
        nombre = ISNULL(@nombre, nombre),
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
    @idMarcaProducto INT,
    @nombre NVARCHAR(32) = NULL,
    @descripcion NVARCHAR(128) = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Marcas_Productos
    SET
        nombre = ISNULL(@nombre, nombre),
        descripcion = ISNULL(@descripcion, descripcion)
    WHERE idMarcaProducto = @idMarcaProducto;
END;
GO

/** PROCEDIMIENTOS TABLA PRODUCTO **/
-- Procedimiento: Crear Producto
CREATE PROCEDURE sp_Crear_Producto
    @codigo NVARCHAR(8),
    @nombre NVARCHAR(128),
    @descripcion NVARCHAR(128),
    @imagen NVARCHAR(255),
    @isActive BIT = 1,
    @categoria_idCategoria INT,
    @marca_idMarca INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO tb_Productos (codigo, nombre, descripcion, precio_compra, precio_venta, stock, imagen, isActive, categoria_idCategoria, marca_idMarca)
    VALUES (@codigo, @nombre, @descripcion, 0.00, 0.00, 0, @imagen, @isActive, @categoria_idCategoria, @marca_idMarca);
    SELECT SCOPE_IDENTITY() AS NuevoID;
END;
GO

-- Procedimiento: Editar Producto
CREATE PROCEDURE sp_Editar_Producto
    @idProducto INT,
    @codigo NVARCHAR(8) = NULL,
    @nombre NVARCHAR(128) = NULL,
    @descripcion NVARCHAR(128) = NULL,
    @imagen NVARCHAR(255) = NULL,
    @isActive BIT = NULL,
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
        imagen = ISNULL(@imagen, imagen),
        isActive = ISNULL(@isActive, isActive),
        categoria_idCategoria = ISNULL(@categoria_idCategoria, categoria_idCategoria),
        marca_idMarca = ISNULL(@marca_idMarca, marca_idMarca)
    WHERE idProducto = @idProducto;
END;
GO

-- Procedimiento: Ingresos Productos
CREATE PROCEDURE sp_Agregar_Ingreso_Stock_Producto
    @cantidad INT,
    @precio_compra DECIMAL(7,2),
    @precio_venta DECIMAL(7,2),
    @producto_idProducto INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO tb_Ingresos_Productos_Stock (
        cantidad, precio_compra, precio_venta, fecha_creacion, producto_idProducto
    )
    VALUES (
		@cantidad, @precio_compra, @precio_venta, GETDATE(), @producto_idProducto
	);
    SELECT stock AS nuevo_stock
    FROM tb_Productos
    WHERE idProducto = @producto_idProducto;
END;
GO

-- Procedimiento: Editar Ingresos Productos
CREATE PROCEDURE sp_Editar_Ingreso_Stock_Producto
    @idIngresoStock INT,
    @cantidad INT = NULL,
    @precio_compra DECIMAL(7,2) = NULL,
    @precio_venta DECIMAL(7,2) = NULL,
    @producto_idProducto INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE tb_Ingresos_Productos_Stock
    SET 
        cantidad = ISNULL(@cantidad, cantidad),
        precio_compra = ISNULL(@precio_compra, precio_compra),
        precio_venta = ISNULL(@precio_venta, precio_venta),
        fecha_creacion = GETDATE(),
        producto_idProducto = producto_idProducto
    WHERE idIngresoStock = @idIngresoStock;
    SELECT stock AS nuevo_stock
    FROM tb_Productos
    WHERE idProducto = @producto_idProducto;
END;
GO

/** 
	PROCEDIMIENTOS TABLA ORDEN 
**/
-- Procedimiento: Crear Orden con sus detalless TESTEAR
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
        INSERT INTO tb_Detalles_Orden (cantidad, precio_venta, subtotal, producto_idProducto, orden_idOrden)
        SELECT
            detalles.cantidad,
			detalles.precio_venta,
            detalles.subtotal,
            detalles.producto_idProducto,
            @nuevoIdOrden
        FROM OPENJSON(@detalles) WITH (
            cantidad INT '$.cantidad',
            precio_venta DECIMAL(9,2) '$.precio_venta',
            subtotal DECIMAL(9,2) '$.subtotal',
            producto_idProducto INT '$.producto_idProducto'
        ) AS detalles;
        COMMIT TRANSACTION;
        SELECT @nuevoIdOrden AS NuevoID;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

-- Procedimiento: Editar Orden
CREATE PROCEDURE sp_Editar_Orden
    @idOrden INT,
    @status_Orden TINYINT = NULL,
    @isActive BIT = NULL,
    @usuarioCliente_idUsuario INT = NULL,
    @usuarioVendedor_idUsuario INT = NULL
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Ordenes
    SET
        status_Orden = ISNULL(@status_Orden, status_Orden),
        isActive = ISNULL(@isActive, isActive),
        usuarioCliente_idUsuario = ISNULL(@usuarioCliente_idUsuario, usuarioCliente_idUsuario),
        usuarioVendedor_idUsuario = ISNULL(@usuarioVendedor_idUsuario, usuarioVendedor_idUsuario)
    WHERE idOrden = @idOrden;
END;
GO

-- Procedimiento: Editar Orden
CREATE PROCEDURE sp_Editar_Total_Orden
    @idOrden INT,
    @total_orden DECIMAL(9,2)
AS
BEGIN
	SET NOCOUNT ON;
    UPDATE tb_Ordenes
    SET
        total_orden = @total_orden
    WHERE idOrden = @idOrden;
END;
GO

-- Procedimiento: Crear Detalle Orden TESTEAR
CREATE PROCEDURE sp_Crear_Detalle_Orden
    @cantidad INT,
    @precio_venta DECIMAL(9,2),
    @subtotal DECIMAL(9,2),
    @producto_idProducto INT,
    @orden_idOrden INT
AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO tb_Detalles_Orden (cantidad, precio_venta, subtotal, producto_idProducto, orden_idOrden)
    VALUES (@cantidad, @precio_venta, @subtotal, @producto_idProducto, @orden_idOrden);
	SELECT SCOPE_IDENTITY() AS NuevoID;
END
GO

-- Procedimiento: Eliminar Detalle Orden
CREATE PROCEDURE sp_Eliminar_Detalle_Orden
    @idDetalleOrden INT
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM tb_Detalles_Orden d
        INNER JOIN tb_Ordenes o ON d.orden_idOrden = o.idOrden
        WHERE d.idDetalleOrden = @idDetalleOrden AND o.status_Orden = 1
    )
    BEGIN
        DELETE FROM tb_Detalles_Orden
        WHERE idDetalleOrden = @idDetalleOrden;
        PRINT 'Detalle de orden eliminado correctamente.';
    END
    ELSE
    BEGIN
        PRINT 'No se puede eliminar, porque la orden ya se bloqueo en aceptada/cancelada.';
    END
END;
GO

/**
	TRIGGERS
	Creacion de Triggers Necesarios para operaciones de Datos.
**/

-- Trigger que nos actualiza el Stock con el ingreso reciente y los precios nuevos de compra y venta.
CREATE TRIGGER trg_Actualizar_Stock_Precio
ON tb_Ingresos_Productos_Stock
AFTER INSERT
AS
BEGIN
    UPDATE pro
    SET 
        pro.stock = pro.stock + i.cantidad,
        pro.precio_compra = i.precio_compra,
        pro.precio_venta = i.precio_venta,
		pro.isActive = CASE 
            WHEN (pro.stock + i.cantidad) > 0 THEN 1
            ELSE 0 
        END
    FROM tb_Productos pro
    INNER JOIN inserted i ON pro.idProducto = i.producto_idProducto;
END;
GO

-- Trigger que nos actualiza el Stock con el ingreso reciente y los precios nuevos de compra y venta dependiendo del valor modificado.
CREATE TRIGGER trg_Corregir_Stock_Al_Modificar_ingreso
ON tb_Ingresos_Productos_Stock
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM inserted i JOIN deleted d ON i.producto_idProducto = d.producto_idProducto WHERE i.cantidad != d.cantidad)
    BEGIN
        UPDATE pro
        SET 
            pro.stock = (pro.stock - d.cantidad) + i.cantidad, 
            pro.precio_compra = i.precio_compra,
            pro.precio_venta = i.precio_venta,
            pro.isActive = CASE 
                WHEN (pro.stock - d.cantidad + i.cantidad) > 0 THEN 1
                ELSE 0
            END
        FROM tb_Productos pro
        INNER JOIN inserted i ON pro.idProducto = i.producto_idProducto
        INNER JOIN deleted d ON pro.idProducto = d.producto_idProducto;
    END
    ELSE
    BEGIN
        UPDATE pro
        SET 
            pro.precio_compra = i.precio_compra,
            pro.precio_venta = i.precio_venta
        FROM tb_Productos pro
        INNER JOIN inserted i ON pro.idProducto = i.producto_idProducto
        INNER JOIN deleted d ON pro.idProducto = d.producto_idProducto;
    END
END;
GO

-- Trigger que nos actualiza el Stock con los detalles de Orden insertadas despues de la venta.
CREATE TRIGGER tr_Actualizar_Stock_Despues_Orden
ON tb_Detalles_Orden
AFTER INSERT
AS
BEGIN
    UPDATE p
    SET 
		p.stock = p.stock - i.cantidad,
		p.isActive = CASE 
			WHEN p.stock - i.cantidad <= 0 THEN 0
			ELSE p.isActive                      
	END
    FROM tb_Productos p
    INNER JOIN INSERTED i ON p.idProducto = i.producto_idProducto
END;
GO

-- Trigger que nos devuelve el Stock al producto, si la orden es cancelada
CREATE TRIGGER trg_Actualizar_Stock_Cancelar_Orden
ON tb_Ordenes
AFTER UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM inserted WHERE status_Orden = 0 AND isActive = 0)
    BEGIN
        UPDATE p
        SET 
			p.stock = p.stock + d.cantidad,
			p.isActive = CASE 
				WHEN ((p.stock + d.cantidad) > 0) THEN 1
				ELSE 0 
			END
        FROM tb_Productos p
        INNER JOIN tb_Detalles_Orden d ON p.idProducto = d.producto_idProducto
        INNER JOIN inserted i ON i.idOrden = d.orden_idOrden
        WHERE i.status_Orden = 0 AND i.isActive = 0;
    END
END;
GO

-- Trigger que nos devuelve el Stock al producto, si un detalle de Ordenes es eliminado
CREATE TRIGGER trg_Restaurar_Stock_Eliminar_Detalle_Orden
ON tb_Detalles_Orden
AFTER DELETE
AS
BEGIN
    -- Restaurar el stock del producto relacionado
    UPDATE p
    SET 
		p.stock = p.stock + d.cantidad,
		p.isActive = CASE 
			WHEN ((p.stock + d.cantidad) > 0) THEN 1
			ELSE 0 
		END
    FROM tb_Productos p
    INNER JOIN deleted d ON p.idProducto = d.producto_idProducto;

    -- Actualizar el total de la orden restando el subtotal del detalle eliminado
    UPDATE o
    SET o.total_orden = o.total_orden - d.subtotal
    FROM tb_Ordenes o
    INNER JOIN deleted d ON o.idOrden = d.orden_idOrden;
END;
GO

/**
	VIEWS
	Creacion de Views de tablas
**/

-- VIEW: Tabla Usuarios.
CREATE VIEW vw_Usuarios AS
SELECT
    usr.idUsuario,
    usr.nombre_completo,
	usr.username,
	rol.idRol,
    rol.nombre as rol_nombre,
	CASE 
        WHEN usr.isSuperUser = 1 THEN 'Activo'
        ELSE 'N/A'
    END AS isSuperUser,
    usr.telefono,
    usr.email,
	usr.fecha_nacimiento,
	emp.idEmpresa,
    emp.nombre_comercial AS empresa,
    CASE 
        WHEN usr.isActive = 1 THEN 'Activo'
        ELSE 'Desactivado'
    END AS isActive,
	usr.direccion,
	(CASE 
        WHEN usr.rol_idRol = 3 THEN
            (SELECT 
                COUNT(ord.idOrden)
             FROM
                tb_Ordenes ord
             WHERE
                ord.usuarioCliente_idUsuario = usr.idUsuario
                AND ord.status_Orden = '2'
                AND ord.isActive <> '0')
        ELSE NULL
    END) AS ordenes_realizadas,
    (CASE 
        WHEN usr.rol_idRol = 2 THEN
            (SELECT 
                COUNT(ord.idOrden)
             FROM
                tb_Ordenes ord
             WHERE
                ord.usuarioVendedor_idUsuario = usr.idUsuario
                AND ord.status_Orden = '2'
                AND ord.isActive <> '0')
        ELSE NULL
    END) AS ordenes_atendidas,
	(CASE 
        WHEN usr.rol_idRol = 3 THEN
            (SELECT 
                SUM(ord.total_orden)
             FROM
                tb_Ordenes ord
             WHERE
                ord.usuarioCliente_idUsuario = usr.idUsuario
                AND ord.status_Orden = '2'
                AND ord.isActive <> '0')
        ELSE NULL
    END) AS compras_realizadas,
	(CASE 
        WHEN usr.rol_idRol = 2 THEN
            (SELECT 
                SUM(ord.total_orden)
             FROM
                tb_Ordenes ord
             WHERE
                ord.usuarioVendedor_idUsuario = usr.idUsuario
                AND ord.status_Orden = '2'
                AND ord.isActive <> '0')
        ELSE NULL
    END) AS ventas_realizadas
FROM
    tb_Usuarios usr
INNER JOIN 
    tb_Roles rol ON usr.rol_idRol = rol.idRol
INNER JOIN 
    tb_Empresas emp ON usr.empresa_idEmpresa = emp.idEmpresa
GO

-- VIEW: Tabla Productos con informacion interna.
CREATE VIEW vw_Productos_Internos AS
SELECT
    pro.idProducto,
    pro.codigo,
    pro.nombre,
    pro.descripcion,
    cat.nombre AS categoria,
    mrc.nombre AS marca,
    pro.imagen,
    CASE 
        WHEN pro.isActive = 1 THEN 'Activo'
        ELSE 'Desactivado'
    END AS isActive,
    pro.stock,
    pro.precio_compra,
    pro.precio_venta,
    SUM(pro.stock * (pro.precio_compra)) AS inversion
FROM
    tb_Productos pro
INNER JOIN 
    tb_Marcas_Productos mrc ON pro.marca_idMarca = mrc.idMarcaProducto
INNER JOIN 
    tb_Categorias_Productos cat ON pro.categoria_idCategoria = cat.idCategoriaProducto
GROUP BY 
    pro.idProducto, 
    pro.codigo,
    pro.nombre,
    pro.descripcion,
    pro.imagen,
    pro.isActive,
    pro.stock,
    pro.precio_compra,
    pro.precio_venta,
    mrc.nombre,
    cat.nombre;
GO

-- VIEW: Tabla Productos con informacion publica.
CREATE VIEW vw_Productos_Publico AS
SELECT
    pro.idProducto,
    pro.codigo,
    pro.nombre,
    pro.descripcion,
    cat.nombre AS categoria,
    mrc.nombre AS marca,
    pro.imagen,
    pro.precio_venta AS precio
FROM
    tb_Productos pro
INNER JOIN 
    tb_Marcas_Productos mrc ON pro.marca_idMarca = mrc.idMarcaProducto
INNER JOIN 
    tb_Categorias_Productos cat ON pro.categoria_idCategoria = cat.idCategoriaProducto
WHERE 
	pro.isActive = 1
GROUP BY 
    pro.idProducto, 
    pro.codigo,
    pro.nombre,
    pro.descripcion,
    pro.imagen,
    pro.isActive,
    pro.stock,
    pro.precio_compra,
    pro.precio_venta,
    mrc.nombre,
    cat.nombre;
GO

-- VIEW: Tabla Ingresos.
CREATE VIEW vw_Ingresos_Stock AS
SELECT
    ing.idIngresoStock,
    ing.cantidad,
    pro.codigo,
    pro.nombre,
    ing.precio_compra,
    ing.precio_venta,
	pro.idProducto,
	pro.isActive,
	pro.marca_idMarca,
	pro.categoria_idCategoria,
	ing.fecha_creacion
FROM
    tb_Ingresos_Productos_Stock ing
INNER JOIN 
    tb_Productos pro ON ing.producto_idProducto = pro.idProducto;
GO

-- VIEW: Tabla Ordenes.
CREATE VIEW vw_Ordenes AS
SELECT
	ord.idOrden,
	ord.fecha_creacion,
	ord.total_orden,
	ord.status_Orden,
	ord.isActive,
	usC.nombre_completo AS cliente,
	usC.telefono,
	usC.email,
	emC.nit AS nit_cliente,
	emC.razon_social AS empresa_cliente,
	usC.direccion AS direccion_cliente,
	usV.nombre_completo AS vendedor,
	emV.nit AS nit_venta,
	emV.razon_social AS empresa_venta,
	usV.direccion AS direccion_venta
FROM
    tb_Ordenes ord
INNER JOIN 
    tb_Usuarios usC ON ord.usuarioCliente_idUsuario = usC.idUsuario
INNER JOIN 
    tb_Empresas emC ON usC.empresa_idEmpresa = emC.idEmpresa
LEFT JOIN
	tb_Usuarios usV ON ord.usuarioVendedor_idUsuario = usV.idUsuario
LEFT JOIN 
    tb_Empresas emV ON usV.empresa_idEmpresa = emV.idEmpresa;
GO

-- VIEW: Tabla Detalle Ordenes.
CREATE VIEW vw_Detalles_Orden AS
SELECT
	det.idDetalleOrden,
	det.cantidad,
	det.precio_venta,
	pro.codigo,
	pro.nombre,
	pro.imagen,
	det.subtotal,
	det.orden_idOrden
FROM
    tb_Detalles_Orden det
INNER JOIN 
    tb_Productos pro ON det.producto_idProducto = pro.idProducto;
GO

-- VIEWS ANTERIORES DEL RETO MSSQL.
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
    tb_Marcas_Productos mar ON pro.marca_idMarca = mar.idMarcaProducto
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