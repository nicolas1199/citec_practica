import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    BelongsTo,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { ESTADOS } from '../../common/constants/estados.constants';
import { Comunas } from './comunas.model';
import { PropuestasDeServicios } from './propuestas-de-servicios.model';
import Contactos from './contactos.model';
import Giros from './giros.model';
import GirosEmpresas from './giros-empresas.model';

@Table({
    tableName: 'empresas',
    timestamps: true,
})
export class Empresas extends Model<Empresas> {
    @ApiProperty({ type: 'string', default: '11.111.111-1' })
    @PrimaryKey
    @Column({
        type: DataType.STRING(15),
        allowNull: false,
    })
    declare rut: string;

    @ApiProperty({ type: 'string', default: 'Construcciones Spa' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare razon_social: string;

    @ApiProperty({ type: 'string', default: 'Construcciones El Juan' })
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare nombre_de_fantasia: string;

    @ApiProperty({ type: 'string', format: 'email' })
    @Column({
        type: DataType.STRING(70),
        allowNull: false,
    })
    declare email_factura: string;

    @ApiProperty({ type: 'string', default: 'Calle Bulnes 1080 N°10' })
    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare direccion: string;

    @ApiProperty({ type: 'string', default: ESTADOS.OPCION_1 })
    @Column({
        type: DataType.ENUM(ESTADOS.OPCION_1, ESTADOS.OPCION_2),
        allowNull: false,
    })
    declare estado: string;

    @ForeignKey(() => Comunas)
    @ApiProperty({ type: 'number', default: 1101 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_comunas: number;

    @BelongsTo(() => Comunas)
    declare comuna: Comunas;

    @ApiProperty({ type: 'string', default: '+56912345678' })
    @Column({
        type: DataType.STRING(20),
        allowNull: true,
    })
    declare telefono: string;

    @ApiProperty()
    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

    @ApiProperty()
    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare updatedAt: Date;

    @HasMany(() => PropuestasDeServicios)
    declare propuestas: PropuestasDeServicios[];

    @HasMany(() => Contactos)
    declare contactos: Contactos[];

    @BelongsToMany(() => Giros, () => GirosEmpresas)
    declare giros: Giros[];
}

export default Empresas;
