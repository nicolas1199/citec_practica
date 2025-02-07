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
import Giros from './giros.model';

@Table({
    tableName: 'categorias',
    timestamps: true,
})
export class Categorias extends Model<Categorias> {
    @ApiProperty({
        type: 'number',
        default: 'AGRICULTURA, GANADERÍA, SILVICULTURA Y PESCA',
    })
    @PrimaryKey
    @Column({
        type: DataType.STRING(170),
        allowNull: false,
    })
    declare nombre: string;

    @HasMany(() => Giros)
    declare giros: Giros[];

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

export default Categorias;
