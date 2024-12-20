import multer, { StorageEngine } from 'multer';
import path from 'path';
import { Request } from 'express';

/**
 * CONFIG: Servidor de archivos estaticos.
 */
const storage: StorageEngine = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        // Asegúrate de que la ruta de destino sea un string y no undefined
        cb(null, path.join(__dirname, '../../images/products')); // Cambia según tu estructura
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // Asegúrate de que el nombre del archivo sea un string
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Nombre único
    },
});

/**
 * EXPORT: Instancia de Multer.
 */
export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5 MB
    fileFilter: (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (file && allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Tipo de archivo no permitido. Solo JPEG, PNG o WEBP.'));
        }
    },
});