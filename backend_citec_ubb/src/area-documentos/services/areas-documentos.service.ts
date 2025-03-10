import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseServices } from 'src/common/base/base-services.class';
import { AreasDocumentos } from 'src/database/models/area-documento.model';
import { ObtenerPorIdAreasDto } from '../dtos/area-documentos.dto';

@Injectable()
export class AreasDocumentosService extends BaseServices {
    constructor() {
        super();
    }

    async obtenerTodos(): Promise<AreasDocumentos[]> {
        const areas = await AreasDocumentos.findAll();
        if (areas.length === 0) {
            throw new NotFoundException(['No existen áreas de documentos']);
        }
        return areas;
    }

    async obtenerPorId(nombre: ObtenerPorIdAreasDto): Promise<AreasDocumentos> {
        const area = await AreasDocumentos.findByPk(nombre.nombre);
        if (!area) {
            throw new NotFoundException([`Área de documento no encontrada`]);
        }
        return area;
    }

    async crear(area: AreasDocumentos): Promise<AreasDocumentos> {
        return await AreasDocumentos.create(area);
    }

    async actualizar(cod_area: string): Promise<AreasDocumentos> {
        const area = await AreasDocumentos.findByPk(cod_area);
        if (!area) {
            throw new NotFoundException([`Área de documento no encontrada`]);
        }
        return await area.save();
    }

    async eliminar(cod_area: string): Promise<number> {
        return await AreasDocumentos.destroy({
            where: {
                cod_area,
            },
        });
    }
}
