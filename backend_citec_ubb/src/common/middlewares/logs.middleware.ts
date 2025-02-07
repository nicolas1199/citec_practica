import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logs } from 'src/database/models/logs.model';
import * as fs from 'fs';
@Injectable()
export class LogsMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip === '::1' ? '127.0.0.1' : req.ip;
        const ruta = req.originalUrl;
        const fechaHora = new Date();

        // Formatear la fecha en español
        const opciones: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        };

        const fechaHoraEnEspañol = new Intl.DateTimeFormat(
            'es-CL',
            opciones,
        ).format(fechaHora);

        await Logs.create({
            ip,
            ruta,
            fecha: fechaHora,
        });

        const logMessage = `[${fechaHoraEnEspañol}] IP: ${ip} Ruta: ${ruta}\n`;

        // Escribir el log en un archivo de texto
        fs.appendFile('logs/logs.txt', logMessage, (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de logs:', err);
            }
        });

        // console.log(`IP del cliente: ${ip}`);
        // console.log(`Ruta: ${ruta}`);
        // console.log(`Fecha y hora: ${fechaHoraEnEspañol}`);
        next(); // Continúa con la siguiente etapa del procesamiento
    }
}
