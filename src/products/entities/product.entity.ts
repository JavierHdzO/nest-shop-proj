import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/auth/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
    @ApiProperty()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'cb8a326-fd61-4ba0-9e14-6e213d1c5850',
        description: 'product Id',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    title: string;

    @ApiProperty()
    @Column({
        type: 'float',
        default: 0
    })
    price: number;

    @ApiProperty()
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty()
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @ApiProperty()
    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @ApiProperty()
    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @ApiProperty()
    @Column({
        type:'text'
    })
    gender: string;

    @ApiProperty()
    @Column({
        type: 'text',
        array: true,
        default:[]
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage,
        productImage => productImage.product,
        { cascade: true, eager: true }
    )
    images?: ProductImage[] 

    @ManyToOne(
        () => User,
        user => user.product,
        { eager: true }
    )
    user: User;

    @BeforeInsert()
    checkSlug(){
        if(!this.slug){
            this.slug = this.title
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "");
        }else{
            this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "");
        }
    }
    
    @BeforeUpdate()
    checkSlugUpdate(){
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", "");
    }

}
