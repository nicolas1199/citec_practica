import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosController } from './documentos.controller';
import { ConfigModule } from '@nestjs/config';
import * as fs from "fs";
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import Documentos from 'src/database/models/documentos.model';
import { DocumentosModule } from '../documentos.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AreasDocumentos } from 'src/database/models/area-documento.model';
import { parse } from 'csv-parse/.';

describe('DocumentosController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [
            Documentos,
            AreasDocumentos,
          ],
          autoLoadModels: true,
          synchronize: true
        }),
        SequelizeModule.forFeature([
          Documentos,
          AreasDocumentos,
        ]),
        DocumentosModule
      ],

    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    /**
    * Crear datos necesarios antes de las pruebas
    */
    const documentoModel = app.get(getModelToken(Documentos))
    const areaDocumentosModel = app.get(getModelToken(AreasDocumentos))

    const documentos = fs.readFileSync(
      `${__dirname}/../../database/seeders/archives/documentos.csv`, 'utf-8'
    )

    const areaDocumentos = fs.readFileSync(
      `${__dirname}/../../database/seeders/archives/tipo-documentos.csv`, 'utf-8'
    )

    //insertar datos de documentos
    const documentosData = parse(documentos, {
      columns: true,
      skip_empty_lines: true,
    })

    //insertar datos de areas de documentos
    const areaDocumentosData = parse(areaDocumentos, {
      columns: true,
      skip_empty_lines: true,
    })

    await documentoModel.bulkCreate(documentosData)

    await areaDocumentosModel.bulkCreate(areaDocumentosData)

    
    afterAll(async () => {
      await app.close();
    });
  });
});
