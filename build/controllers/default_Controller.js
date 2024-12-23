"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultController = void 0;
class DefaultController {
    default(req, res) {
        var ip = req.socket.remoteAddress;
        console.info(ip);
        const parseBoolean = (value) => (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'true';
        res.status(200).json({
            staging: parseBoolean(process.env.SV_STATE) === true ? 'Production' : 'Development',
            title: process.env.SV_APP,
            version: "v1.0.0",
            state: "Alpha",
            public_routes_info: 'Rutas consumibles sin necesidad de un token de sesion',
            public_routes: [
                {
                    url: 'api/v1/',
                    methods: 'GET',
                    body: {}
                },
                {
                    url: 'api/v1/LogIn',
                    methods: 'POST',
                    "Content-Type": 'application/json',
                    body: {
                        username: "String > 'required' (acepta Username o Email)",
                        passphrase: "String > 'required'"
                    }
                },
            ],
            private_routes_info: 'Rutas consumibles con un token de sesion',
            private_routes: [
                {
                    users_routes: [
                        {
                            url: 'api/v1/users/SignUp',
                            roles: 'Administrador | Vendedor',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "nombre_completo": "String > 'required'",
                                "username": "String > 'required'",
                                "passphrase": "String > 'required'",
                                "repeat_passphrase": "String > 'required'",
                                "telefono": "String > 'required'",
                                "email": "String > 'required'",
                                "direccion": "String > 'required'",
                                "fecha_nacimiento": "String > 'required'",
                                "rol_idRol": "Number > 'required'",
                                "empresa_idEmpresa": "Number > 'required'",
                            }
                        },
                        {
                            url: 'api/v1/users/modifyUser',
                            roles: 'Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idUsuario": "Number > 'required'",
                                "nombre_completo": "String > 'optional'",
                                "username": "String > 'optional'",
                                "passphrase": "String > 'optional'",
                                "telefono": "String > 'optional'",
                                "email": "String > 'optional'",
                                "direccion": "String > 'optional'",
                                "fecha_nacimiento": "String > 'optional'",
                                "newStateValue": "Boolean > 'optional'",
                                "rol_idRol": "Number > 'optional'",
                                "empresa_idEmpresa": "Number > 'optional'",
                            }
                        }
                    ],
                    enterprises_routes: [
                        {
                            url: 'api/v1/enterprises/addEnterprise',
                            roles: 'Administrador | Vendedor',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "razon_social": "String > 'required'",
                                "nombre_comercial": "String > 'required'",
                                "nit": "String > 'required'",
                                "telefono": "String > 'required'",
                                "email": "String > 'required'"
                            }
                        },
                        {
                            url: 'api/v1/enterprises/modifyEnterprise',
                            roles: 'Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idEmpresa": "Number > 'required'",
                                "razon_social": "String > 'optional'",
                                "nombre_comercial": "String > 'optional'",
                                "nit": "String > 'optional'",
                                "telefono": "String > 'optional'",
                                "email": "String > 'optional'"
                            }
                        }
                    ],
                    roles_routes: [
                        {
                            url: 'api/v1/roles/modifyRole',
                            roles: 'Administrador (con Tag de SuperUser === 1 en BD)',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idRol": "Number > 'required'",
                                "rol": "String > 'optional'",
                                "descripcion": "String > 'optional'"
                            }
                        }
                    ],
                    category_routes: [
                        {
                            url: 'api/v1/categories/addCategory',
                            roles: 'Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "nombre": "String > 'required'",
                                "descripcion": "String > 'required'"
                            }
                        },
                        {
                            url: 'api/v1/categories/modifyCategory',
                            roles: 'Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idCategoriaProducto": "Number > 'required'",
                                "nombre": "String > 'optional'",
                                "descripcion": "String > 'optional'"
                            }
                        }
                    ],
                    brand_routes: [
                        {
                            url: 'api/v1/brands/addBrand',
                            roles: 'Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "nombre": "String > 'required'",
                                "descripcion": "String > 'required'"
                            }
                        },
                        {
                            url: 'api/v1/brands/modifyBrand',
                            roles: 'Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idMarcaProducto": "Number > 'required'",
                                "nombre": "String > 'optional'",
                                "descripcion": "String > 'optional'"
                            }
                        }
                    ],
                    product_routes: [
                        {
                            url: 'api/v1/products/addProduct',
                            roles: 'Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'multipart/form-data',
                            "multipart-body": [{
                                    jsonData: {
                                        "codigo": "String > 'required'",
                                        "nombre": "String > 'required'",
                                        "descripcion": "String > 'required'",
                                        "categoria_idCategoria": "Number > 'required'",
                                        "marca_idMarca": "Number > 'required'"
                                    },
                                    image: {
                                        "image": "File > 'required' (png, jpeg y webp)"
                                    }
                                }]
                        },
                        {
                            url: 'api/v1/products/modifyProduct',
                            roles: 'Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'multipart/form-data',
                            "multipart-body": [{
                                    jsonData: {
                                        "idProducto": "Number > 'optional'",
                                        "codigo": "String > 'optional'",
                                        "nombre": "String > 'optional'",
                                        "descripcion": "String > 'optional'",
                                        "categoria_idCategoria": "Number > 'optional'",
                                        "marca_idMarca": "Number > 'optional'"
                                    },
                                    image: {
                                        "image": "File > 'optional' (png, jpeg y webp)"
                                    }
                                }]
                        },
                        {
                            url: 'api/v1/products/addStockEntry',
                            roles: 'Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "cantidad": "Number > 'required'",
                                "precio_compra": "Decimal > 'required'",
                                "precio_venta": "Decimal > 'required'",
                                "producto_idProducto": "Number > 'required'",
                            },
                        },
                        {
                            url: 'api/v1/products/modifyStockEntry',
                            roles: 'Administrador (con Tag de SuperUser === 1 en BD)',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idIngresoStock": "Number > 'required'",
                                "cantidad": "Number > 'optional'",
                                "precio_compra": "Decimal > 'optional'",
                                "precio_venta": "Decimal > 'optional'"
                            },
                        },
                        {
                            url: 'api/v1/products/modifyStatusProduct',
                            roles: 'Administrador (con Tag de SuperUser === 1 en BD)',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idProducto": "Number > 'optional'",
                                "isActive": "Boolean > 'optional'"
                            }
                        },
                    ],
                    order_routes: [
                        {
                            url: 'api/v1/orders/addOrder',
                            roles: 'Cliente | Vendedor | Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'multipart/form-data',
                            body: {
                                "usuarioCliente_idUsuario": "Number > 'required'",
                                "detalles": [
                                    {
                                        "cantidad": "Number > 'required'",
                                        "producto_idProducto": "Number > 'required'"
                                    }
                                ]
                            }
                        },
                        {
                            url: '/api/v1/orders/addOrderDetail',
                            roles: 'Cliente | Vendedor | Administrador',
                            methods: 'POST',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "cantidad": "Number > 'required'",
                                "producto_idProducto": "Number > 'required'",
                                "orden_idOrden": "Number > 'required'"
                            }
                        },
                        {
                            url: 'api/v1/orders/modifyOrder',
                            roles: 'Vendedor | Administrador',
                            methods: 'PUT',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idOrden": "Number > 'required'",
                                "status_Orden": "Number > 'optional'",
                                "isActive": "Number > 'optional'",
                                "usuarioCliente_idUsuario": "Number > 'optional'",
                                "usuarioVendedor_idUsuario": "Number > 'optional'",
                            }
                        },
                        {
                            url: 'api/v1/orders/deleteOrderDetail',
                            roles: 'Cliente | Vendedor | Administrador',
                            methods: 'DELETE',
                            header: 'auth-token',
                            "Content-Type": 'application/json',
                            body: {
                                "idDetalleOrden": "Number > 'required'"
                            }
                        }
                    ],
                }
            ]
        });
    }
}
exports.defaultController = new DefaultController();
