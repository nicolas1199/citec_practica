import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CrearDocumentoDto, EliminarDocumentoDto, obtenerDocumentoPorIdDto, ActualizarDocumentoDto } from '../dto/documento.dto';
import Documentos from 'src/database/models/documentos.model';
import { BaseServices } from 'src/common/base/base-services.class';
import { VALIDEZ_DE_DOCUMENTO } from 'src/common/constants/validez-de-documento.constants';

@Injectable()
export class DocumentosService extends BaseServices {

  async crear(documento: CrearDocumentoDto): Promise<Documentos> {
    const existeDocumento = await Documentos.findOne({
      where: { nombre: documento.nombre }
    })
    if (existeDocumento) {
      throw new ConflictException(['Ya existe un documento con ese nombre']);
    }
    const documentoCreado = await Documentos.create({
      ...documento
    })
    return documentoCreado;
  }

  async obtenerTodos(): Promise<Documentos[]> {
    const documentos = await Documentos.findAll();
    if (documentos.length === 0) {
      throw new NotFoundException([`No existen documentos`]);
    }
    return documentos;
  }

  async obtenerPorId(clavePrimaria: obtenerDocumentoPorIdDto): Promise<Documentos> {
    const documentos = await Documentos.findByPk(clavePrimaria.numero)
    if (!documentos) {
      throw new NotFoundException([`Documento no encontrado`]);
    }
    return documentos;
  }

  async actualizar(documento: ActualizarDocumentoDto): Promise<Documentos> {
    const documentoExistente = await Documentos.findByPk(documento.numero)
    const documentoExistenteNuevo = await Documentos.findOne({
      where: { nombre: documento.nuevo_nombre }
    })
    if (!documentoExistente) {
      throw new NotFoundException([`Documento n° ${documento.numero} no encontrado o no existe`])
    }
    if (documentoExistenteNuevo && documento.nombre === documento.nuevo_nombre) {
      throw new ConflictException([`Ya existe un documento con el nombre "${documento.nuevo_nombre}"`])
    }

    const filasAfectadas = await Documentos.update(
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

    const documentoActualizado = await Documentos.findByPk(documento.numero)

    return documentoActualizado
  }
  async eliminar(clavePrimaria: EliminarDocumentoDto): Promise<Documentos> {
    const documento = await Documentos.findByPk(clavePrimaria.numero)

    if (!documento) {
      throw new NotFoundException([`No existe el documento n° ${clavePrimaria.numero}`])
    }

    const filasAfectadas = await Documentos.update(
      { validez_documento: VALIDEZ_DE_DOCUMENTO.OPCION_2 },
      { where: { numero: clavePrimaria.numero } })

    const documentoEliminado = await Documentos.findByPk(clavePrimaria.numero)

    return documentoEliminado;
  }
}
