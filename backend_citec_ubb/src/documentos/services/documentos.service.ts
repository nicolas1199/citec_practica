import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearDocumentoDto, EliminarDocumentoDto, obtenerDocumentoPorIdDto, ActualizarDocumentoDto } from '../dto/documento.dto';
import DocumentosModel from 'src/database/models/documentos.model';
import { BaseServices } from 'src/common/base/base-services.class';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';

@Injectable()
export class DocumentosService extends BaseServices {

  async crear(documento: CrearDocumentoDto): Promise<DocumentosModel> {
    const documentoCreado = await DocumentosModel.create({
      ...documento
    })
    return documentoCreado;
  }

  async obtenerTodos(): Promise<DocumentosModel[]> {
    const documentos = await DocumentosModel.findAll();
    if (documentos.length === 0) {
      throw new NotFoundException([`No existen documentos`]);
    }
    return documentos;
  }

  async obtenerPorId(clavePrimaria: obtenerDocumentoPorIdDto): Promise<DocumentosModel> {
    const documentos = await DocumentosModel.findByPk(clavePrimaria.numero)
    if (!documentos) {
      throw new NotFoundException([`Documento no encontrado`]);
    }
    return documentos;
  }

  async actualizar(documento: ActualizarDocumentoDto): Promise<DocumentosModel> {
    const documentoExistente = await DocumentosModel.findByPk(documento.numero)

    if (!documentoExistente) {
      throw new NotFoundException([`Documento n° ${documento.numero} no encontrado o no existe`])
    }
    if (documento.nombre === documento.nuevo_nombre) {
      throw new ConflictException([`El documento ya tiene el nombre "${documento.nuevo_nombre}"`])
    }

    const filasAfectadas = await DocumentosModel.update(
      {
        nombre: documento.nuevo_nombre,
        direccion: documento.nueva_direccion,
        area_documento: documento.nueva_area_documento,
        fecha_inicio: documento.nueva_fecha_inicio,
        fecha_finalizacion: documento.nueva_fecha_finalizacion,
        validez_documento: documento.nueva_validez_documento
      },
      {
        where: { numero: documento.numero }
      })

    const documentoActualizado = await DocumentosModel.findByPk(documento.numero)

    return documentoActualizado
  }

  async eliminar(clavePrimaria: EliminarDocumentoDto): Promise<DocumentosModel> {
    const documento = await DocumentosModel.findByPk(clavePrimaria.numero)

    if (!documento) {
      throw new NotFoundException([`No existe el documento n° ${clavePrimaria.numero}`])
    }

    const filasAfectadas = await DocumentosModel.update(
      { validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_2 },
      { where: { numero: clavePrimaria.numero } })

    const documentoEliminado = await DocumentosModel.findByPk(clavePrimaria.numero)

    return documentoEliminado;
  }

  async obtenerTodosEliminados(): Promise<DocumentosModel[]> {
    const documentos = await DocumentosModel.findAll({
      where: { validez: VALIDEZ_DE_DOCUMENTO.OPCION_2 },
    });
    return documentos;
  }
}
