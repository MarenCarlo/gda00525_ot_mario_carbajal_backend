"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
/**
 * CONFIG: Servidor de archivos estaticos.
 */
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        // Asegúrate de que la ruta de destino sea un string y no undefined
        cb(null, path_1.default.join(__dirname, '../../images/products')); // Cambia según tu estructura
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Asegúrate de que el nombre del archivo sea un string
        cb(null, uniqueSuffix + path_1.default.extname(file.originalname)); // Nombre único
    },
});
/**
 * EXPORT: Instancia de Multer.
 */
exports.upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (file && allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de archivo no permitido. Solo JPEG, PNG o WEBP.'));
        }
    },
});
