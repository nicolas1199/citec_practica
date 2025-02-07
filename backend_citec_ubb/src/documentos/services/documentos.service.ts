import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import * as fs from "fs";
import { CreateDocumentoDto, EliminarDocumentoDto, obtenerDocumentoPorIdDto, UpdateDocumentoDto } from '../dto/documento.dto';
import Documentos from 'src/database/models/documentos.model';
import { BaseServices } from 'src/common/base/base-services.class';

@Injectable()
export class DocumentosService extends BaseServices {

  async crear(documento: CreateDocumentoDto): Promise<Documentos> {
    const existeDocumento = await Documentos.findOne({
      where: { numero: documento.numero }
    })
    if (existeDocumento) {
      throw new ConflictException(['Ya existe un usuario con ese email']);
    }
    const documentoCreado = await Documentos.create({
      ...documento,
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

  async actualizar(clavePrimaria: obtenerDocumentoPorIdDto, usuario: UpdateDocumentoDto): Promise<Documentos> {
    const documento = await Documentos.findByPk(clavePrimaria.numero)
    const documentoActualizado = Documentos.findByPk()
    return
  }
  async eliminar(clavePrimaria: EliminarDocumentoDto): Promise<Documentos> {
    const documento = await Documentos.findByPk(clavePrimaria.numero)
    if (!documento) {
      throw new NotFoundException([`No existe el documento n° ${clavePrimaria.numero}`])
    }
    const documentoEliminado = await Documentos.findByPk(clavePrimaria.numero)
    
    const filasAfectadas = await Documentos.destroy({where: {numero: clavePrimaria.numero}})

    return documentoEliminado;
  }
}
