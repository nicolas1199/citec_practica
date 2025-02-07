import { Module, Global, OnApplicationBootstrap, Inject } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { SeederService } from './seeders/services/seeder.service';
import { ConfigType } from '@nestjs/config';
import config from '../config';
import { TiposSeeder } from './seeders/seed/tipos.seeders';
import { UsuariosSeeder } from './seeders/seed/usuarios.seeders';
import { RegionesSeeder } from './seeders/seed/regiones.seeders';
import { ProvinciasSeeder } from './seeders/seed/provincias.seeders';
import { ComunasSeeder } from './seeders/seed/comunas.seeders';
import { EmpresasSeeder } from './seeders/seed/empresas.seeders';
import { CategoriasSeeder } from './seeders/seed/categorias.seeders';
import { GirosSeeder } from './seeders/seed/giros.seeders';
import { GirosEmpresasSeeder } from './seeders/seed/giros-empresas-seeders';
import { ContactosSeeder } from './seeders/seed/contactos.seeders';
import { PropuestasDeServiciosSeeder } from './seeders/seed/propuestas-de-servicios.seeders';
import { SubServiciosSeeder } from './seeders/seed/sub-servicios.sedders';
import { PropuestasDeServiciosSubServicioSeeder } from './seeders/seed/propuestas_de_servicios_sub_servicio.seeders';
import { GruposDeServiciosSeeder } from './seeders/seed/grupos-de-servicios.seeders';
import { GrupoDeServiciosSubServiciosSeeder } from './seeders/seed/grupo-de-servicio-sub-servicio.seeders';
@Global()
@Module({
    providers: [
        {
            provide: Sequelize,
            useFactory: async () => {
                const sequelize = new Sequelize(process.env.DATABASE_URL, {
                    logging: false,
                    models: [__dirname + '/models/**/*.model.js'],
                    pool: {
                        max: 5,
                        min: 0,
                        acquire: 30000,
                        idle: 10000,
                        evict: 10000,
                    },
                });

                await sequelize.sync();
                return sequelize;
            },
        },
        SeederService,
        TiposSeeder,
        UsuariosSeeder,
        RegionesSeeder,
        ProvinciasSeeder,
        ComunasSeeder,
        EmpresasSeeder,
        CategoriasSeeder,
        GirosSeeder,
        GirosEmpresasSeeder,
        ContactosSeeder,
        PropuestasDeServiciosSeeder,
        SubServiciosSeeder,
        PropuestasDeServiciosSubServicioSeeder,
        GruposDeServiciosSeeder,
        GrupoDeServiciosSubServiciosSeeder,
    ],
    exports: [Sequelize],
})
export class DatabaseModule implements OnApplicationBootstrap {
    constructor(
        private readonly seederService: SeederService,
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
    ) {}

    async onApplicationBootstrap() {
        if (
            this.configService.node.env === 'dev' ||
            this.configService.node.env === 'prod'
        ) {
            console.log('Ejecutando seeders en entorno de desarrollo...');
            await this.seederService.run();
        }
    }
}
