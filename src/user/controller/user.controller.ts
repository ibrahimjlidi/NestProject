import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable, map, catchError, of } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
import { User } from '../models/user.entity';
import { UserService } from '../service/user.service';

@Controller('users')
export class UserController {
    constructor(private userService:UserService){}

@Post()
create(@Body() users: User): Observable <User | Object>{
    return this.userService.create(users).pipe(
        map((users: User)=> users),
        catchError(err => of({error: err.message}))
    );
}

@Post('login')
login(@Body() users: User): Observable<Object>{
    return this.userService.login(users).pipe(
        map((jwt: string)=>{
            return { access_token: jwt};
        })
    )
}
    
@Get(':id')
findOne(@Param('id')id: number): Observable<User> {
    return this.userService.findOne(id);
}

@Get()
findAll():Observable<User[]> {
    return this.userService.findAll();
}

@Put(':id')
update(
    @Param('id')id:number,
    @Body()users:User
):Observable<UpdateResult>
{
    return this.userService.update(id,users);
}

@Delete(':id')
delete(@Param('id')id: number):Observable<DeleteResult> {
    return this.userService.delete(id);
  }
}
