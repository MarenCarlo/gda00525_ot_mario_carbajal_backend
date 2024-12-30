### Comandos de Ejecucion de Server de Desarrollo
- Es necesario correr ambos comandos en 2 distintas terminales para desarrollar, mientras se genera una build dinámica del proyecto en desarrollo.

| **Comando**   | **Descripción**                             |
|----------------|---------------------------------------------|
| `npm run build:dev` | Generación de Build Dinámica para entorno de desarrollo en tiempo real. |
| `npm run dev`     | Sirve y Recarga los archivos de la Build Dinámica mientras se esta en desarrollo. |

### Comandos de Ejecucion de Server de Produccion
- Es necesario correr ambos comandos en 2 distintas terminales para desarrollar, mientras se genera una build dinámica del proyecto en desarrollo.

| **Comando**   | **Descripción**                             |
|----------------|---------------------------------------------|
| `npm run start` | Sirve el Build trabajado en el entorno de produccion. |

##
## Variables de Entorno necesarias
### Variables del Servidor

| **Variable**   | **Descripción**                             |
|----------------|---------------------------------------------|
| `SV_STATE`     | Indica el estado del servidor (si está activo o no). |
| `SV_APP`       | Nombre o identificador de la aplicación en el servidor. |
| `SV_URL`       | URL base donde el servidor está corriendo. |
| `SV_PORT`      | Puerto en el que el servidor escucha las solicitudes. |

### Variables de Base de Datos para Producción

| **Variable**           | **Descripción**                             |
|------------------------|---------------------------------------------|
| `DB_HOST_PRO`          | Dirección del host de la base de datos en producción. |
| `DB_PORT_PRO`          | Puerto de la base de datos en producción. |
| `DB_DATABASE_PRO`      | Nombre de la base de datos en producción. |

### Variables de Base de Datos para Desarrollo

| **Variable**           | **Descripción**                             |
|------------------------|---------------------------------------------|
| `DB_HOST_DEV`          | Dirección del host de la base de datos en desarrollo. |
| `DB_PORT_DEV`          | Puerto de la base de datos en desarrollo. |
| `DB_DATABASE_DEV`      | Nombre de la base de datos en desarrollo. |

### Credenciales para BD
| **Variable**           | **Descripción**                             |
|------------------------|---------------------------------------------|
| `DB_DIALECT`           | Tipo de base de datos (necesario para Sequelize). |
| `DB_HOST`          | Usuario de Acceso a BD. |
| `DB_PORT`          | Contraseña del usuario. |

### Dominios Permitidos por CORS

| **Variable**           | **Descripción**                             |
|------------------------|---------------------------------------------|
| `CR_DOMAIN_1`          | Dominio permitido para las solicitudes CORS. |

### Variables de Autenticación

| **Variable**           | **Descripción**                             |
|------------------------|---------------------------------------------|
| `TOKEN_SECRET`         | Clave secreta utilizada para la firma de tokens de autenticación. |

##
# Rutas de la API

## Rutas públicas

**Descripción:** Rutas consumibles sin necesidad de un token de sesión.

| **URL**         | **Métodos** | **Body** |
|-----------------|-------------|----------|
| `api/v1/`       | GET         | Ninguno  |
| `api/v1/LogIn`  | POST        | `{ "username": "String > 'required'", "passphrase": "String > 'required'" }` |

## Rutas privadas

**Descripción:** Rutas consumibles con un token de sesión.

### Rutas de usuarios

| **URL**                  | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|--------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/users/getUsers/:idUsuario?` | GET        | Administrador, Vendedor    | auth-token   | application/json      |
| `api/v1/users/SignUp`    | POST        | Administrador, Vendedor    | auth-token   | application/json      | `{ "nombre_completo": "String > 'required'", "username": "String > 'required'", "passphrase": "String > 'required'", "repeat_passphrase": "String > 'required'", "telefono": "String > 'required'", "email": "String > 'required'", "direccion": "String > 'required'", "fecha_nacimiento": "String > 'required'", "rol_idRol": "Number > 'required'", "empresa_idEmpresa": "Number > 'required'" }` |
| `api/v1/users/modifyUser`| PUT         | Administrador              | auth-token   | application/json      | `{ "idUsuario": "Number > 'required'", "nombre_completo": "String > 'optional'", "username": "String > 'optional'", "passphrase": "String > 'optional'", "telefono": "String > 'optional'", "email": "String > 'optional'", "direccion": "String > 'optional'", "fecha_nacimiento": "String > 'optional'", "newStateValue": "Boolean > 'optional'", "rol_idRol": "Number > 'optional'", "empresa_idEmpresa": "Number > 'optional'" }` |

### Rutas de empresas

| **URL**                        | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|---------------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/enterprises/getEnterprises/:idEmpresa?` | GET        | Administrador, Vendedor    | auth-token   | application/json      |
| `api/v1/enterprises/addEnterprise` | POST        | Administrador, Vendedor    | auth-token   | application/json      | `{ "razon_social": "String > 'required'", "nombre_comercial": "String > 'required'", "nit": "String > 'required'", "telefono": "String > 'required'", "email": "String > 'required'" }` |
| `api/v1/enterprises/modifyEnterprise` | PUT         | Administrador              | auth-token   | application/json      | `{ "idEmpresa": "Number > 'required'", "razon_social": "String > 'optional'", "nombre_comercial": "String > 'optional'", "nit": "String > 'optional'", "telefono": "String > 'optional'", "email": "String > 'optional'" }` |

### Rutas de roles

| **URL**                   | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|---------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/roles/getRoles`    | GET         | Vendedor, Administrador      | auth-token   | application/json      |
| `api/v1/roles/modifyRole`  | PUT         | Administrador (con Tag de SuperUser === 1 en BD) | auth-token   | application/json      | `{ "idRol": "Number > 'required'", "rol": "String > 'optional'", "descripcion": "String > 'optional'" }` |

### Rutas de categorías

| **URL**                          | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|-----------------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/categories/getCategories`    | GET         |  Cliente, Vendedor, Administrador      | auth-token   | application/json      |
| `api/v1/categories/addCategory`   | POST        | Administrador              | auth-token   | application/json      | `{ "nombre": "String > 'required'", "descripcion": "String > 'required'" }` |
| `api/v1/categories/modifyCategory`| PUT         | Administrador              | auth-token   | application/json      | `{ "idCategoriaProducto": "Number > 'required'", "nombre": "String > 'optional'", "descripcion": "String > 'optional'" }` |

### Rutas de marcas

| **URL**                       | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|-------------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/brands/getBrands`    | GET         |  Cliente, Vendedor, Administrador      | auth-token   | application/json      |
| `api/v1/brands/addBrand`       | POST        | Administrador              | auth-token   | application/json      | `{ "nombre": "String > 'required'", "descripcion": "String > 'required'" }` |
| `api/v1/brands/modifyBrand`    | PUT         | Administrador              | auth-token   | application/json      | `{ "idMarcaProducto": "Number > 'required'", "nombre": "String > 'optional'", "descripcion": "String > 'optional'" }` |

### Rutas de productos

| **URL**                                | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|----------------------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/products/getProductsPublic/:idProducto?`    | GET         |  Cliente, Vendedor, Administrador      | auth-token   | application/json      |
| `api/v1/products/getProductsInternal/:idProducto?`    | GET         | Vendedor, Administrador      | auth-token   | application/json      |
| `api/v1/products/addProduct`           | POST        | Administrador              | auth-token   | multipart/form-data   | `{ "codigo": "String > 'required'", "nombre": "String > 'required'", "descripcion": "String > 'required'", "categoria_idCategoria": "Number > 'required'", "marca_idMarca": "Number > 'required'" }` |
| `api/v1/products/modifyProduct`        | PUT         | Administrador              | auth-token   | multipart/form-data   | `{ "idProducto": "Number > 'optional'", "codigo": "String > 'optional'", "nombre": "String > 'optional'", "descripcion": "String > 'optional'", "categoria_idCategoria": "Number > 'optional'", "marca_idMarca": "Number > 'optional'" }` |
| `api/v1/products/getIngresosStock`    | GET         |   Administrador      | auth-token   | application/json      |
| `api/v1/products/addStockEntry`     | POST        | Administrador              | auth-token   | application/json      | `{ "cantidad": "Number > 'required'", "precio_compra": "Decimal > 'required'", "precio_venta": "Decimal > 'required'", "producto_idProducto": "Number > 'required'" }` |
| `api/v1/products/modifyStockEntry`     | PUT         | Administrador (con Tag de SuperUser === 1 en BD) | auth-token   | application/json      | `{ "idIngresoStock": "Number > 'required'", "cantidad": "Number > 'optional'", "precio_compra": "Decimal > 'optional'", "precio_venta": "Decimal > 'optional'" }` |
| `api/v1/products/modifyStatusProduct`  | PUT         | Administrador (con Tag de SuperUser === 1 en BD) | auth-token   | application/json      | `{ "idProducto": "Number > 'optional'", "isActive": "Boolean > 'optional'" }` |

### Rutas de órdenes

| **URL**                                  | **Métodos** | **Roles**                 | **Header**    | **Content-Type**      | **Body** |
|------------------------------------------|-------------|---------------------------|--------------|-----------------------|----------|
| `api/v1/getOrders/:idOrden?` | GET        | Cliente, Vendedor, Administrador | auth-token   | application/json   |
| `api/v1/orders/addOrder`                 | POST        | Cliente, Vendedor, Administrador | auth-token   | application/json   | `{ "usuarioCliente_idUsuario": "Number > 'required'", "detalles": [{ "cantidad": "Number > 'required'", "producto_idProducto": "Number > 'required'" }] }` |
| `/api/v1/orders/addOrderDetail`          | POST        | Cliente, Vendedor, Administrador | auth-token   | application/json      | `{ "cantidad": "Number > 'required'", "producto_idProducto": "Number > 'required'", "orden_idOrden": "Number > 'required'" }` |
| `api/v1/orders/modifyOrder`              | PUT         | Vendedor, Administrador    | auth-token   | application/json      | `{ "idOrden": "Number > 'required'", "status_Orden": "Number > 'optional'", "isActive": "Number > 'optional'", "usuarioCliente_idUsuario": "Number > 'optional'", "usuarioVendedor_idUsuario": "Number > 'optional'" }` |
| `api/v1/orders/deleteOrderDetail`        | DELETE      | Cliente, Vendedor, Administrador | auth-token   | application/json      | `{ "idDetalleOrden": "Number > 'required'" }` |
