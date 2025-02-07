import { Test, TestingModule } from '@nestjs/testing';
import { DocumentosController } from './documentos.controller';
import { ConfigModule } from '@nestjs/config';
import * as fs from "fs";
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import Documentos from 'src/database/models/documentos.model';
import { DocumentosModule } from '../documentos.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';

describe('DocumentosController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [Documentos],
          autoLoadModels: true,
          synchronize: true
        }),
        SequelizeModule.forFeature([Documentos]),
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

    const documentos = fs.readFileSync(
      `${__dirname}/../../database/seeders/archives/documentos.csv`,'utf-8'
    )

    afterAll(async () => {
      await app.close();
    });
  }); 
});
