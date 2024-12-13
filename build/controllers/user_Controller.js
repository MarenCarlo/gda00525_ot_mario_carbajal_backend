"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const connection_1 = __importDefault(require("../database/connection"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const joi_1 = __importDefault(require("@hapi/joi"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/**
 * Translate Import
 */
const texts_1 = __importDefault(require("../translate/texts"));
/**
 * Validation of Data Inputs entered by Users
 */
const schemaSignUp = joi_1.default.object({
    nameUser: joi_1.default.string().min(4).max(32).required().messages({
        'string.base': texts_1.default.user_controller.joi.nameUser.string_base,
        'string.min': texts_1.default.user_controller.joi.nameUser.string_min,
        'string.max': texts_1.default.user_controller.joi.nameUser.string_max,
        'any.required': texts_1.default.user_controller.joi.nameUser.required,
    }),
    passUser: joi_1.default.string().min(8).max(32).required().messages({
        'string.base': texts_1.default.user_controller.joi.passUser.string_base,
        'string.min': texts_1.default.user_controller.joi.passUser.string_min,
        'string.max': texts_1.default.user_controller.joi.passUser.string_max,
        'any.required': texts_1.default.user_controller.joi.passUser.required,
    }),
    roleUser: joi_1.default.number().integer().min(1).max(99).required().messages({
        'number.base': texts_1.default.user_controller.joi.roleUser.number_base,
        'number.integer': texts_1.default.user_controller.joi.roleUser.number_integer,
        'number.min': texts_1.default.user_controller.joi.roleUser.number_min,
        'number.max': texts_1.default.user_controller.joi.roleUser.number_max,
        'any.required': texts_1.default.user_controller.joi.roleUser.required,
    }),
});
/**
 * user_controller
 *
 * Controller of functions that have to do with actions that modify User data
 */
class user_Controller {
    /**
     * Endpoint signUp
     * Used to register new users in the APP.
     */
    signUp(req, res) {
        (0, connection_1.default)()
            .then((connection) => __awaiter(this, void 0, void 0, function* () {
            const ip = req.socket.remoteAddress;
            console.log(ip);
            const { error } = schemaSignUp.validate(req.body);
            if (error) {
                res.status(400).json({
                    error: true,
                    error_message: error.details[0].message
                });
                throw new Error(texts_1.default.user_controller.wrong_form_data_error);
            }
            const sql = `
                    SELECT
                        user.userName
                    FROM
                        user
                    WHERE user.userName = ?
                `;
            return connection.query(sql, [req.body.nameUser]);
        }))
            .then((query_result) => __awaiter(this, void 0, void 0, function* () {
            if (query_result[0] === undefined) {
                console.log(req.body);
                let { nameUser, passUser, roleUser } = req.body;
                const salt = yield bcrypt_1.default.genSalt(12);
                const cryptedPass = yield bcrypt_1.default.hash(passUser, salt);
                const sql = `
                        INSERT INTO user (codeUser, userName, passUser, fk_State, fk_Role, fk_organization, masterKey, developer, added_date, updated_at) 
                        VALUES ('USE-00000005', ?, ?, '2', ?, '0', '0', 0, NOW(), NOW());
                    `;
                return Promise.all([(0, connection_1.default)().then(conn => conn.query(sql, [nameUser, cryptedPass, roleUser]))]);
            }
            else {
                res.status(400).json({
                    error: true,
                    error_message: texts_1.default.user_controller.previously_registered_user
                });
                return Promise.reject(texts_1.default.user_controller.previously_registered_user_error);
            }
        }))
            .then(() => {
            console.log(texts_1.default.user_controller.clg_new_user);
            res.status(201).json({
                error: false,
                message: texts_1.default.user_controller.new_registered_user,
            });
        })
            .catch((error) => {
            console.log(error);
        });
    }
}
exports.userController = new user_Controller();
