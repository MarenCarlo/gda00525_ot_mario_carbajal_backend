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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MIDDLEWARE
 *
 * Validacion de usuario con rol de Admin o Vendedor
 */
const validateAdminOrSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (user.rol.idRol === 1 || user.rol.idRol === 2) {
        next();
    }
    else {
        return res.status(401).json({
            error: true,
            message: 'No tiene los permisos suficientes para realizar esta acción.',
            data: {}
        });
    }
});
exports.default = validateAdminOrSeller;
