import { ApiProperty } from '@nestjs/swagger';
import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    ForeignKey,
    CreatedAt,
    UpdatedAt,
} from 'sequelize-typescript';

import { OrdenesDeTrabajos } from './ordenes-de-trabajos.model';
import { Pagos } from './pagos.model';

@Table({
    tableName: 'ordenes_de_trabajo_pagos',
    timestamps: true,
})
export class OrdenesDeTrabajosPagos extends Model<OrdenesDeTrabajosPagos> {
    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @ForeignKey(() => OrdenesDeTrabajos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_ordenes: number;

    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @ForeignKey(() => Pagos)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_pagos: number;

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

export default OrdenesDeTrabajosPagos;
