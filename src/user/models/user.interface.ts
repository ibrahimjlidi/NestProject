import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name:string;
    @Column({unique:true})
    username:string;
    @Column()
    email:string;
    @Column()
    password:string;
    @Column()
    phone:number;
    @BeforeInsert()
    emailToLowerCase()
    {
        this.email = this.email.toLowerCase();
     }
}