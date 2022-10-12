import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user.entity";

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
    @Column({type:'enum',enum:UserRole,default: UserRole.USER})
     role:UserRole;
    @Column()
    phone:number;
    @BeforeInsert()
    emailToLowerCase()
    {
        this.email = this.email.toLowerCase();
     }
}