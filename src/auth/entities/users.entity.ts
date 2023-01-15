import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
        nullable:false
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
}
