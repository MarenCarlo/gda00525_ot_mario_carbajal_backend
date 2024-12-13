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
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const connection_1 = __importDefault(require("../database/connection"));
/**
 * Translate Import
 */
const texts_1 = __importDefault(require("../translate/texts"));
/**
 * MIDDLEWARE
 *
 * User Administrator Validation
 */
const validateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user && req.user.user_id) {
            let connection;
            let userID = req.user.user_id;
            (0, connection_1.default)()
                .then((conn) => {
                connection = conn;
                const sql_role = `
                        SELECT 
                            user.fk_role
                        FROM
                            user
                        WHERE user.id_user = ?;
                    `;
                return connection.query(sql_role, userID);
            })
                .then((result) => {
                /**
                 * Is the user role administrator or developer?
                 */
                if (result[0].fk_role == process.env.US_ADMIN_ROLE || result[0].fk_role == process.env.US_DEVELOPER_ROLE) {
                    next();
                }
                else {
                    res.status(401).json({
                        error: true,
                        error_message: texts_1.default.validate_admin.is_not_admin
                    });
                }
            });
        }
        else {
            throw new Error(texts_1.default.validate_admin.not_user_info_error);
        }
    }
    catch (error) {
        res.status(401).json({
            error: true,
            error_message: error
        });
    }
});
exports.default = validateAdmin;
