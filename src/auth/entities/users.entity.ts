import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Entity()
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        type:'text',
        unique: true,
        nullable:false
    })
    email: string;

    @Column({
        type:'text',
        nullable:false,
        select: false
    })
    password: string;

    @Column({
        type:'text',
        nullable: true
    })
    fullName?: string;

    @Column({
        type:'bool',
        default: true
    })
    isActive: boolean

    @Column({
        type:'text',
        array: true,
        default: ['user']
    })
    roles: string[]

    @BeforeInsert()
    @BeforeUpdate()
    private loweCase(){
        this.email = this.email.toLowerCase();
    }

   

    @BeforeInsert()
    private hashPassword(){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(this.password, salt);

        this.password = hash;
    }

}
