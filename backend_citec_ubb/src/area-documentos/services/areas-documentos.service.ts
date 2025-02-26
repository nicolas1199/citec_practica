import { Injectable, NotFoundException } from '@nestjs/common';
import { ObtenerPorIdAreasDto } from '../dtos/area-documentos.dto';
import { BaseServicesSimple } from '../../common/base/base-services-simple.class';
import { AreasDocumentosModel } from 'src/database/models/area-documento.model';

@Injectable()
export class AreasDocumentosService extends BaseServicesSimple {
    async obtenerTodos(): Promise<AreasDocumentosModel[]> {
        const retornoAreas = await AreasDocumentosModel.findAll();

        if (retornoAreas.length === 0) {
            throw new NotFoundException([`No hay areas de documentos activos`]);
        }

        return retornoAreas;
    }

    async obtenerPorId(clavePrimaria: ObtenerPorIdAreasDto): Promise<AreasDocumentosModel> {
        const retornoTipo = await AreasDocumentosModel.findByPk(clavePrimaria.nombre);

        if (!retornoTipo) {
            throw new NotFoundException([
                `No existe el tipo de usuario con el nombre ${clavePrimaria.nombre}`,
            ]);
        }

        return retornoTipo;
    }
}
