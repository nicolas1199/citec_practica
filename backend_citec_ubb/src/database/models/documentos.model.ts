import { ApiProperty } from "@nestjs/swagger";
import { Column, CreatedAt, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";


@Table({
    tableName: 'Documentos',
    timestamps: true,
    indexes: [
        {
            fields: ['numero', 'tipo'],
            unique: true,
        },
    ],
})

export class Documentos extends Model<Documentos> {
    @ApiProperty({ type: 'string', format: 'email' })
    @PrimaryKey
    @Column({
        type: DataType.STRING(70),
        allowNull: false,
    })
    declare email: string;

    @ApiProperty({ type: 'string', default: 'Juan' })
    @Column({
        type: DataType.STRING(50),
        allowNull: false,
    })
    declare nombre: string;

    @ApiProperty({ type: 'number', default: 1 })
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    declare numero: number;

    @ApiProperty({ type: 'string', default: 'Estanqueidad al aire - NCH 892' })
    @Column({
        type: DataType.ENUM(
            'AA', 'EC'
        ),
        allowNull: false,
    })
    declare tipo: string;

    @ApiProperty()
    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    declare createdAt: Date;

}
export default Documentos