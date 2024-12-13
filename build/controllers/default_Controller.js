"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultController = void 0;
class DefaultController {
    default(req, res) {
        var ip = req.socket.remoteAddress;
        console.info(ip);
        const parseBoolean = (value) => (value === null || value === void 0 ? void 0 : value.toLowerCase()) === 'true';
        res.status(200).json({
            status: parseBoolean(process.env.SV_STATE),
            title: process.env.SV_APP,
            version: "v0.9.2",
            state: "Beta",
            message_public: 'Routes that can be consumed without the need for an authentication token.',
            public_routes: [
                {
                    url: 'api/v1/',
                    methods: 'GET',
                },
                {
                    url: '/v1/login',
                    methods: 'POST'
                },
            ],
            message_private: 'Routes that can be consumed only with an authentication token.',
            private_routes: [
                {
                    url: '/v1/register',
                    methods: 'POST',
                    header: 'auth-token'
                },
                {
                    url: '/v1/user_state/:id',
                    methods: 'PATCH',
                    header: 'auth-token'
                },
                {
                    url: '/v1/products',
                    methods: 'GET, POST',
                    header: 'auth-token'
                },
                {
                    url: '/v1/products/:filter',
                    methods: 'GET',
                    header: 'auth-token',
                    filters: 'name="asc", name="des", price="asc", price="des", added_date="asc", added_date="des"'
                },
                {
                    url: '/v1/product/:id',
                    methods: 'GET, PATCH',
                    header: 'auth-token'
                },
            ]
        });
    }
}
exports.defaultController = new DefaultController();
