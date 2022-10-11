import { User } from './../models/user.entity';
import { UserEntity } from './../models/user.interface';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService:  AuthService
    ){}

        create(users : User): Observable<User> {
            return this.authService.hashPassword(users.password).pipe(
                switchMap((passwordHash: string) => {
                    const newUser = new UserEntity();
                    newUser.name = users.name;
                    newUser.username = users.username;
                    newUser.email = users.email;
                    newUser.password = passwordHash;
                    newUser.phone = users.phone;
         
                    return from(this.userRepository.save(newUser)).pipe(
                        map((users: User) => {
                            const {password, ...result} = users;
                            return result;
                        }),
                        catchError(err => throwError(err))
                    )
                })
            )   
         }
         
         findOne(id): Observable<User> {
            return from(this.userRepository.findOneBy({id})).pipe(
                map((users: User)=> {
                    const {password, ...result} = users;
                    return result;
                })
            )
         }
         
         findAll(): Observable<User[]>{
            return from(this.userRepository.find()).pipe(
                map((users: User[])=> {
                    users.forEach(function (v) {delete v.password});
                    return users;
                })
            );
         }
         
         delete(id: number): Observable<DeleteResult>{
            return from(this.userRepository.delete(id));
         }
         
         update(id: number, users: User): Observable<UpdateResult>{
            delete users.email;
            delete users.password;
         
            return from(this.userRepository.update(id, users));
         }
         
         login(users: User): Observable<string> {
            return this.validateUser(users.email, users.password).pipe(
                switchMap((users: User)=> {
                    if(users) {
                        return this.authService.generateJWT(users).pipe(map((jwt: string)=> jwt));
                    } else {
                        return 'wrong Credentials';
                    }
                })
            )
         }
         validateUser(email: string, password: string): Observable<User> {
            return this.findByMail(email).pipe(
                switchMap((users: User)=> this.authService.comparePasswords(password, users.password).pipe(
                    map((match: boolean)=> {
                        if(match) {

                            const {password, ...result} = users;
                            return result;
                        } else {
                            throw Error;
                        }
                    })
                ))
            )
         }
         findByMail(email): Observable<User> {
            return from(this.userRepository.findOneBy({email}));
         }
         
         
}
