import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from '../../../config';
import { UsuariosSeeder } from '../seed/usuarios.seeders';
import { TiposSeeder } from '../seed/tipos.seeders';
import { RegionesSeeder } from '../seed/regiones.seeders';
import { ProvinciasSeeder } from '../seed/provincias.seeders';
import { ComunasSeeder } from '../seed/comunas.seeders';
import { EmpresasSeeder } from '../seed/empresas.seeders';
import { GirosSeeder } from '../seed/giros.seeders';
import { CategoriasSeeder } from '../seed/categorias.seeders';
import { GirosEmpresasSeeder } from '../seed/giros-empresas-seeders';
import { ContactosSeeder } from '../seed/contactos.seeders';
import { PropuestasDeServiciosSeeder } from '../seed/propuestas-de-servicios.seeders';
import { SubServiciosSeeder } from '../seed/sub-servicios.sedders';
import { PropuestasDeServiciosSubServicioSeeder } from '../seed/propuestas_de_servicios_sub_servicio.seeders';
import { GruposDeServiciosSeeder } from '../seed/grupos-de-servicios.seeders';
import { GrupoDeServiciosSubServiciosSeeder } from '../seed/grupo-de-servicio-sub-servicio.seeders';

@Injectable()
export class SeederService {
    constructor(
        @Inject(config.KEY) private configService: ConfigType<typeof config>,
        private readonly tiposSeeder: TiposSeeder,
        private readonly usuariosSeeder: UsuariosSeeder,
        private readonly regionesSeeder: RegionesSeeder,
        private readonly provinciasSeeder: ProvinciasSeeder,
        private readonly comunasSeeder: ComunasSeeder,
        private readonly empresasSeeder: EmpresasSeeder,
        private readonly categoriasSeeder: CategoriasSeeder,
        private readonly girosSeeder: GirosSeeder,
        private readonly girosEmpresasSeeder: GirosEmpresasSeeder,
        private readonly contactosSeeder: ContactosSeeder,
        private readonly propuestasdeServiciosSeeder: PropuestasDeServiciosSeeder,
        private readonly subServiciosSeeder: SubServiciosSeeder,
        private readonly propuestasDeServiciosSubServicioSeeder: PropuestasDeServiciosSubServicioSeeder,
        private readonly gruposDeServiciosSeeder: GruposDeServiciosSeeder,
        private readonly grupoDeServiciosSubServiciosSeeder: GrupoDeServiciosSubServiciosSeeder,
    ) {}

    async run() {
        await this.tiposSeeder.run();
        await this.usuariosSeeder.run();
        await this.regionesSeeder.run();
        await this.provinciasSeeder.run();
        await this.comunasSeeder.run();
        await this.empresasSeeder.run();
        await this.categoriasSeeder.run();
        await this.girosSeeder.run();
        await this.girosEmpresasSeeder.run();
        await this.contactosSeeder.run();
        await this.propuestasdeServiciosSeeder.run();
        await this.subServiciosSeeder.run();
        await this.propuestasDeServiciosSubServicioSeeder.run();
        await this.gruposDeServiciosSeeder.run();
        await this.grupoDeServiciosSubServiciosSeeder.run();
    }
}
