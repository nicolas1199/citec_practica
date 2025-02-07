import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CrearOrdenesDeTrabajoDto } from '../dtos/ordenes-de-trabajo.dto';
import OrdenesDeTrabajos from 'src/database/models/ordenes-de-trabajos.model';
import Comunas from 'src/database/models/comunas.model';
import PropuestasDeServicios from 'src/database/models/propuestas-de-servicios.model';
import Pagos from 'src/database/models/pagos.model';
import { TIPOS_DE_PAGO } from 'src/common/constants/tipos-de-pagos.constants';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class OrdenesDeTrabajosService {
    async crear(ordenDeTrabajo: CrearOrdenesDeTrabajoDto): Promise<any> {
        // Ejecutar validaciones en paralelo
        const [propuestaDeServicio, comuna, numeroTipo] = await Promise.all([
            PropuestasDeServicios.findOne({
                where: { id: ordenDeTrabajo.id_propuesta_de_servicio },
            }),
            Comunas.findOne({
                where: { id: ordenDeTrabajo.id_comunas },
                attributes: ['id'],
            }),
            Pagos.findOne({
                where: {
                    numero: ordenDeTrabajo.numero,
                    tipo: ordenDeTrabajo.tipo,
                },
            }),
        ]);

        if (numeroTipo) {
            throw new ConflictException([
                'Ya existe una orden de trabajo con este número y tipo',
            ]);
        }

        if (!propuestaDeServicio) {
            throw new NotFoundException(['La propuesta de servicio no existe']);
        }

        if (!comuna) {
            throw new NotFoundException(['La comuna no existe']);
        }

        const año = new Date().getFullYear();

        // const ordenDeTrabajoCreada = await OrdenesDeTrabajos.create({
        //     año: año,
        //     fecha_solicitud: ordenDeTrabajo.fecha_solicitud,
        //     nombre_solicitante: ordenDeTrabajo.nombre_solicitante,
        //     fecha_entrega: ordenDeTrabajo.fecha_entrega,
        //     observacion: ordenDeTrabajo.observacion,
        //     direccion: ordenDeTrabajo.direccion,
        //     id_comunas: ordenDeTrabajo.id_comunas,
        //     id_propuesta_de_servicio: ordenDeTrabajo.id_propuesta_de_servicio,
        // });

        let uploadPath = join(__dirname, '../../archives');

        if (ordenDeTrabajo.tipo === TIPOS_DE_PAGO.OPCION_1) {
            uploadPath = join(uploadPath, 'facturas');
        } else if (ordenDeTrabajo.tipo === TIPOS_DE_PAGO.OPCION_2) {
            uploadPath = join(uploadPath, 'comprobantes');
        } else {
            uploadPath = join(uploadPath, 'ordenes-de-compra');
        }

        const fileName = `${Date.now()}_${ordenDeTrabajo.imagen}`;
        const fullPath = join(uploadPath, fileName);

        await fs.promises.mkdir(uploadPath, { recursive: true });
        await fs.promises.writeFile(fullPath, ordenDeTrabajo.imagen);

        //ordenDeTrabajoCreada.$add('pagos', ordenDeTrabajo.imagen)

        return 'empresaRetorno';
    }
}
