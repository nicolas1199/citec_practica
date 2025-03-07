import {
    Table,
    Column,
    Model,
    DataType,
    PrimaryKey,
    AutoIncrement,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
} from 'sequelize-typescript';

import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from 'sequelize';

@Table({
    tableName: 'ensayos',
    timestamps: true,
})
export class Ensayos extends Model<Ensayos> {
    @ApiProperty({ type: 'number', default: 1 })
    @PrimaryKey
    @AutoIncrement
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare id: number;

    @ApiProperty({ type: 'string' })
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    declare nombre_ensayo: string;

    @ApiProperty({ type: 'number' })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare tipo_servicio_id: number;

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

    // @BeforeCreate
    // static async asignarID(instance: Ensayos, options: any) {
    //     await Ensayos.sequelize?.transaction(
    //         async (t: Transaction) => {
    //             const ultimoId = ((await Ensayos.max('id', { transaction: t })) || 0) as number;
    //             instance.id = ultimoId + 1;
    //         },
    //     );
    // }

}

export default Ensayos;
