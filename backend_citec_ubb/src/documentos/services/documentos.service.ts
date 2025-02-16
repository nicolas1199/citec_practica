import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    CrearDocumentoDto,
    EliminarDocumentoDto,
    obtenerDocumentoPorIdDto,
    UpdateDocumentoDto,
} from '../dto/documento.dto';
import Documentos from 'src/database/models/documentos.model';
import { BaseServices } from 'src/common/base/base-services.class';

@Injectable()
export class DocumentosService extends BaseServices {
    async crear(documento: CrearDocumentoDto): Promise<Documentos> {
        const existeDocumento = await Documentos.findOne({
            where: { nombre: documento.nombre },
        });
        if (existeDocumento) {
            throw new ConflictException([
                'Ya existe un documento con ese nombre',
            ]);
        }
        const documentoCreado = await Documentos.create({
            ...documento,
        });
        return documentoCreado;
    }

    async obtenerTodos(): Promise<Documentos[]> {
        const documentos = await Documentos.findAll();
        if (documentos.length === 0) {
            throw new NotFoundException([`No existen documentos`]);
        }
        return documentos;
    }

    async obtenerPorId(
        clavePrimaria: obtenerDocumentoPorIdDto,
    ): Promise<Documentos> {
        const documentos = await Documentos.findByPk(clavePrimaria.numero);
        if (!documentos) {
            throw new NotFoundException([`Documento no encontrado`]);
        }
        return documentos;
    }

    async actualizar(documento: UpdateDocumentoDto): Promise<Documentos> {
        const documentoExistente = await Documentos.findByPk(documento.numero);
        const documentoActualizado = Documentos.findByPk();
        return;
    }
    async eliminar(clavePrimaria: EliminarDocumentoDto): Promise<Documentos> {
        const documento = await Documentos.findByPk(clavePrimaria.numero);
        if (!documento) {
            throw new NotFoundException([
                `No existe el documento n° ${clavePrimaria.numero}`,
            ]);
        }
        const documentoEliminado = await Documentos.findByPk(
            clavePrimaria.numero,
        );

        const filasAfectadas = await Documentos.destroy({
            where: { numero: clavePrimaria.numero },
        });

        return documentoEliminado;
    }
}
