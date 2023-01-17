import { User } from 'src/auth/entities/users.entity';
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToOne } from 'typeorm';
import { ProductImage } from './product-image.entity';

@Entity()
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    title: string;

    @Column({
        type: 'float',
        default: 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    @Column({
        type: 'int',
        default: 0
    })
    stock: number;

    @Column({
        type: 'text',
        array: true
    })
    sizes: string[];

    @Column({
        type:'text'
    })
    gender: string;

    @Column({
        type: 'text',
        array: true,
        default:[]
    })
    tags: string[];

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
