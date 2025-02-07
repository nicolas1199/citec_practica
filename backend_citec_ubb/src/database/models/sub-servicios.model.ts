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
import { GrupoDeServicioSubServicios } from './grupo-de-servicio-sub-servicios.model';
import { PropuestasDeServicios } from './propuestas-de-servicios.model';
import { PropuestaDeServicioSubServicios } from './propuesta-de-servicio-sub-servicios.model';

@Table({
    tableName: 'sub_servicios',
    timestamps: true,
})
export class SubServicios extends Model<SubServicios> {
    @ApiProperty({ type: 'string', default: 'Estanqueidad al aire - NCH 892' })
    @PrimaryKey
    @Column({
        type: DataType.STRING(200),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'number', default: 10 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare pago_neto: number;

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

    @BelongsToMany(() => GruposDeServicios, () => GrupoDeServicioSubServicios)
    declare grupoDeServicio: GruposDeServicios[];

    @BelongsToMany(
        () => PropuestasDeServicios,
        () => PropuestaDeServicioSubServicios,
    )
    declare propuestasDeServicios: PropuestasDeServicios[];
}

export default SubServicios;
