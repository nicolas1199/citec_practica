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
    HasOne,
    BelongsToMany,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';

import { Empresas } from './empresas.model';
import Categorias from './categorias.model';
import GirosEmpresas from './giros-empresas.model';

@Table({
    tableName: 'giros',
    timestamps: true,
})
export class Giros extends Model<Giros> {
    @ApiProperty({ type: 'number', default: '011101' })
    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare codigo: number;

    @ApiProperty({ type: 'string', default: 'CULTIVO DE TRIGO' })
    @Column({
        type: DataType.STRING(170),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'string', default: 'SI' })
    @Column({
        type: DataType.STRING(2),
        allowNull: false,
    })
    declare afecto_iva: string;

    @ApiProperty({
        type: 'string',
        default: 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
    })
    @ForeignKey(() => Categorias)
    @Column({
        type: DataType.STRING(170),
        allowNull: false,
    })
    declare nombre_categorias: string;

    @BelongsTo(() => Categorias)
    declare categoria: Categorias;

    @BelongsToMany(() => Empresas, () => GirosEmpresas)
    declare empresas: Empresas[];

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

export default Giros;
