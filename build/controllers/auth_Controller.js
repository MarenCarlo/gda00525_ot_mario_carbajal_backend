"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("@hapi/joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/**
 * Shared Functions
 */
const secondsToMidnight_1 = require("../shared/secondsToMidnight");
/**
 * Translate Import
 */
const texts_1 = __importDefault(require("../translate/texts"));
/**
 * Validation of Data Inputs entered by Users
 */
const schemaLogin = joi_1.default.object({
    nameUser: joi_1.default.string().min(4).max(32).required().messages({
        'string.base': texts_1.default.auth_controller.joi.nameUser.string_base,
        'string.min': texts_1.default.auth_controller.joi.nameUser.string_min,
        'string.max': texts_1.default.auth_controller.joi.nameUser.string_max,
        'any.required': texts_1.default.auth_controller.joi.nameUser.required,
    }),
    passUser: joi_1.default.string().min(8).max(32).required().messages({
        'string.base': texts_1.default.auth_controller.joi.passUser.string_base,
        'string.min': texts_1.default.auth_controller.joi.passUser.string_min,
        'string.max': texts_1.default.auth_controller.joi.passUser.string_max,
        'any.required': texts_1.default.auth_controller.joi.passUser.required,
    }),
});
/**
 * Validation of Data Inputs entered by Users
 */
const schemaGetSessionToken = joi_1.default.object({
    userID: joi_1.default.number().integer().min(1).required().messages({
        'number.base': 'El Número de ID De Usuario debe ser de tipo Number',
        'number.integer': 'El Número de ID de Usuario Debe Ser de tipo Number - Integer',
        'number.min': 'El Número de ID de Usuario no puede ser menor a 0',
        'any.required': 'No Se Recibió Ningun Número de ID de Usuario',
    }),
});
/**
 * Principal Controller
 */
class auth_Controller {
    /**
     * Endpoint logIn
     *
     * Works to return user session tokens
     */
    logIn(req, res) {
        (0, connection_1.default)()
            .then((connection) => {
            const ip = req.socket.remoteAddress;
            console.log(ip);
            const { error } = schemaLogin.validate(req.body);
            if (error) {
                res.status(400).json({
                    error: true,
                    error_message: error.details[0].message
                });
                throw new Error(texts_1.default.auth_controller.wrong_form_data_error);
            }
            const sql1 = `
                    SELECT
                        user.id_user,
                        user.codeUser,
                        user.userName,
                        user_state.id_state,
                        user_state.stateName,
                        user_role.id_role,
                        user_role.roleName
                    FROM
                        user
                    INNER JOIN user_state ON user.fk_state = user_state.id_state
                    INNER JOIN user_role ON user.fk_role = user_role.id_role
                    WHERE user.userName = ?
                `;
            return connection.query(sql1, [req.body.nameUser]);
        })
            .then((query_result) => {
            if (query_result[0] !== undefined) {
                if (query_result[0].id_state == process.env.US_ACTIVE_STATE) {
                    const sql2 = `
                            SELECT
                                user.passUser
                            FROM
                                user
                            WHERE user.userName = ?
                        `;
                    return Promise.all([query_result, (0, connection_1.default)().then(conn => conn.query(sql2, query_result[0].userName))]);
                }
                else {
                    res.status(401).json({
                        error: true,
                        error_message: texts_1.default.auth_controller.inactive_user
                    });
                    return Promise.reject(texts_1.default.auth_controller.inactive_user_error);
                }
            }
            else {
                res.status(404).json({
                    error: true,
                    error_message: `${texts_1.default.auth_controller.nonexistent_user} ${req.body.nameUser}`
                });
                return Promise.reject(texts_1.default.auth_controller.nonexistent_user_error);
            }
        })
            .then(([query_result, result2]) => {
            const validPassword = bcrypt_1.default.compareSync(req.body.passUser, result2[0].passUser);
            if (!validPassword) {
                res.status(401).json({
                    error: true,
                    error_message: texts_1.default.auth_controller.wrong_password
                });
                return Promise.reject(texts_1.default.auth_controller.wrong_password_error);
            }
            else {
                if (!process.env.TOKEN_SECRET) {
                    console.error(texts_1.default.auth_controller.secret_not_defined);
                    throw new Error(texts_1.default.auth_controller.secret_not_defined_error);
                }
                else {
                    const currentTime = new Date();
                    const expiration_Time = (0, secondsToMidnight_1.secondsToMidnight)(currentTime);
                    const token = jsonwebtoken_1.default.sign({
                        user_id: query_result[0].id_user,
                        user_code: query_result[0].codeUser,
                        user_name: query_result[0].userName,
                        user_state: query_result[0].stateName,
                        user_role: query_result[0].roleName
                    }, process.env.TOKEN_SECRET, {
                        expiresIn: expiration_Time
                    });
                    console.log(texts_1.default.auth_controller.clg_successfully_logged_in);
                    res.status(200).header('auth-token', token).json({
                        error: false,
                        token_temporal: false,
                        message: texts_1.default.auth_controller.successfully_logged_in,
                        token,
                        query_result
                    });
                }
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }
    /**
     * Endpoint logIn
     * Sirve para realizar todas las validaciónes necesarias para Iniciar Sesión.
     */
    get_temporal_token(req, res) {
        (0, connection_1.default)()
            .then((connection) => {
            const ip = req.socket.remoteAddress;
            console.log(ip);
            const { error } = schemaGetSessionToken.validate(req.body);
            if (error) {
                res.status(400).json({
                    error: true,
                    error_message: error.details[0].message
                });
                throw new Error(texts_1.default.auth_controller.wrong_form_data_error);
            }
            const sql1 = `
                    SELECT
                        user.id_user,
                        user.codeUser,
                        user.userName,
                        user_state.id_state,
                        user_state.stateName,
                        user_role.id_role,
                        user_role.roleName
                    FROM
                        user
                    INNER JOIN user_state ON user.fk_state = user_state.id_state
                    INNER JOIN user_role ON user.fk_role = user_role.id_role
                    WHERE user.id_user = ?
                `;
            return connection.query(sql1, [req.body.userID]);
        })
            .then((query_result) => {
            if (query_result[0] !== undefined) {
                if (query_result[0].id_state == process.env.US_ACTIVE_STATE) {
                    if (!process.env.TOKEN_SECRET) {
                        console.error(texts_1.default.auth_controller.secret_not_defined);
                        throw new Error(texts_1.default.auth_controller.secret_not_defined_error);
                    }
                    else {
                        const token = jsonwebtoken_1.default.sign({
                            user_id: query_result[0].id_user,
                            user_code: query_result[0].codeUser,
                            user_name: query_result[0].userName,
                            user_state: query_result[0].stateName,
                            user_role: query_result[0].roleName
                        }, process.env.TOKEN_SECRET, {
                            expiresIn: process.env.JWT_TOKEN_TEMPORAL_EXPIRATION_TIME
                        });
                        console.log(texts_1.default.auth_controller.clg_successfully_logged_in);
                        res.status(200).header('auth-temporal-token', token).json({
                            error: false,
                            token_temporal: true,
                            message: 'Token Temporal Generado Correctamente',
                            token,
                            query_result
                        });
                    }
                }
                else {
                    res.status(401).json({
                        error: true,
                        error_message: texts_1.default.auth_controller.inactive_user
                    });
                    return Promise.reject(texts_1.default.auth_controller.inactive_user_error);
                }
            }
            else {
                res.status(404).json({
                    error: true,
                    error_message: `No Existe ningún usuario con ID: ${req.body.userID}`
                });
                return Promise.reject(texts_1.default.auth_controller.nonexistent_user_error);
            }
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
exports.authController = new auth_Controller();
