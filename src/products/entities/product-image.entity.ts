import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImage {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type:'text',
    })
    url: string;

    @ManyToOne(
        () => Product,
        ( product ) => product.images,
        {
            onDelete: 'CASCADE'
        }
    )
    product: Product

}