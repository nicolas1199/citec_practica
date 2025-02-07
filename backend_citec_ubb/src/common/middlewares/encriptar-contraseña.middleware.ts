import {
    BadRequestException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
@Injectable()
export class EncriptarContraseñaMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.contraseña) {
            if (typeof req.body.contraseña !== 'string') {
                throw new BadRequestException([
                    'La contraseña debe ser alfanumerica',
                ]);
            }
            const salt = await bcrypt.genSalt(10); // Genera un salt
            req.body.contraseña = await bcrypt.hash(req.body.contraseña, salt); // Encripta la contraseña
        }
        next(); // Continúa con la siguiente etapa del procesamiento
    }
}
