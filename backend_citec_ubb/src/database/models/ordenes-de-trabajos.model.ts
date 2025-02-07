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
    AutoIncrement,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { ESTADOS } from '../../common/constants/estados.constants';
import { Comunas } from './comunas.model';
import { PropuestasDeServicios } from './propuestas-de-servicios.model';
import Pagos from './pagos.model';
import OrdenesDeTrabajosPagos from './ordenes_de_trabajo_pagos.model';

@Table({
    tableName: 'ordenes_de_trabajos',
    timestamps: true,
})
export class OrdenesDeTrabajos extends Model<OrdenesDeTrabajos> {
    @ApiProperty({ type: 'number', default: 1 })
    @AutoIncrement
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'number', default: 2025 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare año: number;

    @ApiProperty({ type: 'string', default: '10/10/2024' })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_solicitud: Date;

    @ApiProperty({ type: 'string', default: 'Juan Perez' })
    @Column({
        type: DataType.STRING(30),
        allowNull: false,
    })
    declare nombre_solicitante: string;

    @ApiProperty({ type: 'string', default: '10/10/2024' })
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare fecha_entrega: Date;

    @ApiProperty({ type: 'string', default: 'Se debe realizar envio a...' })
    @Column({
        type: DataType.STRING(300),
        allowNull: false,
    })
    declare observacion: string;

    @ApiProperty({ type: 'string', default: 'Calle Bulnes 1080 N°10' })
    @Column({
        type: DataType.STRING(150),
        allowNull: false,
    })
    declare direccion: string;

    @ForeignKey(() => Comunas)
    @ApiProperty({ type: 'number', default: 1101 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_comunas: number;

    @BelongsTo(() => Comunas)
    declare comuna: Comunas;

    @ForeignKey(() => PropuestasDeServicios)
    @ApiProperty({ type: 'number', default: 1101 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_propuesta_de_servicio: number;

    @BelongsTo(() => PropuestasDeServicios)
    declare propuesta_de_servicio: PropuestasDeServicios;

    @BelongsToMany(() => Pagos, () => OrdenesDeTrabajosPagos)
    declare pagos: Pagos[];

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

export default OrdenesDeTrabajos;
