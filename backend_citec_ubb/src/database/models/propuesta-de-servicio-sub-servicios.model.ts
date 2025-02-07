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
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { PropuestasDeServicios } from './propuestas-de-servicios.model';
import { SubServicios } from './sub-servicios.model';

@Table({
    tableName: 'propuesta_de_servicio_sub_servicios',
    timestamps: true,
})
export class PropuestaDeServicioSubServicios extends Model<PropuestaDeServicioSubServicios> {
    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @ForeignKey(() => PropuestasDeServicios) // Relación con PropuestasDeServicios
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'string', default: 'Estanqueidad al aire - NCH 892' })
    @PrimaryKey
    @ForeignKey(() => SubServicios) // Relación con SubServicios
    @Column({
        type: DataType.STRING(100),
        allowNull: false,
    })
    declare nombre: string;

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

export default PropuestaDeServicioSubServicios;
