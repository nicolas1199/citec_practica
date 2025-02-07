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
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Provincias } from './provincias.model';

@Table({
    tableName: 'comunas',
    timestamps: true,
})
export class Comunas extends Model<Comunas> {
    @ApiProperty({ type: 'number', default: 1101 })
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'string', default: 'CONCEPCIÓN' })
    @Column({
        type: DataType.STRING(30),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'number', default: 1 })
    @ForeignKey(() => Provincias)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id_provincias: number;

    @BelongsTo(() => Provincias)
    declare provincia: Provincias;

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

export default Comunas;
