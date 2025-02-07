import { ApiProperty } from '@nestjs/swagger';
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
    Sequelize,
    AutoIncrement,
    HasOne,
    HasMany,
    BelongsToMany,
} from 'sequelize-typescript';

import { GruposDeServicios } from './grupos-de-servicios.model';
import { SubServicios } from './sub-servicios.model';

@Table({
    tableName: 'grupo_de_servicio_sub_servicios',
    timestamps: true,
})
export class GrupoDeServicioSubServicios extends Model<GrupoDeServicioSubServicios> {
    @ApiProperty({
        type: 'string',
        default: 'EVALUACIÓN TÉCNICA PRESTACIONAL DE VENTANAS',
    })
    @PrimaryKey
    @ForeignKey(() => GruposDeServicios)
    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare nombre_g: string;

    @ApiProperty({ type: 'string', default: 'Estanqueidad al aire - NCH 892' })
    @PrimaryKey
    @ForeignKey(() => SubServicios)
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare nombre_s: string;

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
}

export default GrupoDeServicioSubServicios;
