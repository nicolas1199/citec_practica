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

import { ApiProperty } from '@nestjs/swagger';
import Giros from './giros.model';
import Empresas from './empresas.model';
import { DATE, Sequelize } from 'sequelize';

@Table({
    tableName: 'giros_empresas',
    timestamps: true,
})
export class GirosEmpresas extends Model<GirosEmpresas> {
    @ApiProperty({ type: 'number', default: '11.111.111-1' })
    @PrimaryKey
    @ForeignKey(() => Empresas)
    @Column({
        type: DataType.STRING(15),
        allowNull: false,
    })
    declare rut_empresas: string;

    @ApiProperty({ type: 'number', default: '011101' })
    @PrimaryKey
    @ForeignKey(() => Giros)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare codigo_giros: number;

    @ApiProperty()
    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
    declare createdAt: Date;

    @ApiProperty()
    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    })
    declare updatedAt: Date;
}

export default GirosEmpresas;
