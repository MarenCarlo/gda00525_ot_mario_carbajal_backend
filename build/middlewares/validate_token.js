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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
/**
 * Translate Import
 */
const texts_1 = __importDefault(require("../texts/texts"));
/**
 * MIDDLEWARE
 *
 * Session Token Validation
 */
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.header('auth-token');
    /**
     * Is Token Received?
     */
    if (!token)
        return res.status(401).json({
            error_token: true,
            error_message: texts_1.default.validate_token.denied_access
        });
    const secret = process.env.TOKEN_SECRET;
    /**
     * Is TOKEN_SECRET defined?
     */
    if (!secret) {
        return res.status(500).json({
            error_token: true,
            error_message: texts_1.default.validate_token.secret_not_defined
        });
    }
    try {
        const verified = jsonwebtoken_1.default.verify(token, secret);
        req.user = verified;
        next();
    }
    catch (error) {
        /**
         * Is Token invalid?
         */
        res.status(401).json({
            error_token: true,
            error_message: texts_1.default.validate_token.invalid_token
        });
    }
});
exports.default = verifyToken;
