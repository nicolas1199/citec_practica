import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { DocumentosModule } from '../documentos.module';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import Documentos from 'src/database/models/documentos.model';
import { AreasDocumentos } from 'src/database/models/area-documento.model';
import { AREAS_DE_DOCUMENTO } from 'src/common/constants/area-documentos.constants';
import { CrearDocumentoDto } from '../dto/documento.dto';
import { sync } from 'rimraf';

describe('DocumentosController', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot(),
                SequelizeModule.forRoot({
                    dialect: 'sqlite',
                    storage: ':memory:',
                    models: [Documentos, AreasDocumentos],
                    autoLoadModels: true,
                    synchronize: true,
                }),
                SequelizeModule.forFeature([Documentos, AreasDocumentos]),
                DocumentosModule,
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

        const areasModel = app.get(getModelToken(AreasDocumentos));
        const areas = Object.values(AREAS_DE_DOCUMENTO);
        for (const area of areas) {
            await areasModel.create({
                nombre: area,
            });
        }
    });

    afterAll(async () => {
        await app.close();
    });

    const ruta = '/documentos'
    describe('Areas', () => {

        it('Deben existir al menos 2 areas', async () => {
            const areasModel = app.get(getModelToken(AreasDocumentos));
            const count = await areasModel.count();
            expect(count).toBeGreaterThanOrEqual(2);
        });

    })
});
