import { JwtAuthGuard } from './../../auth/gurads/jwt-guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Observable, map, catchError, of } from 'rxjs';
import { UpdateResult, DeleteResult } from 'typeorm';
import { User, UserRole } from '../models/user.entity';
import { UserService } from '../service/user.service';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from 'src/auth/gurads/roles.gurad';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() users: User): Observable<User | Object> {
    return this.userService.create(users).pipe(
      map((users: User) => users),
      catchError((err) => of({ error: err.message })),
    );
  }

  @Post('login')
  login(@Body() users: User): Observable<Object> {
    return this.userService.login(users).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: number): Observable<User> {
    return this.userService.findOne(id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() users: User,
  ): Observable<UpdateResult> {
    return this.userService.update(id, users);
  }
  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id/role')
  updateRoleOfUser(@Param('id')id:string,@Body() users:User):Observable<User>{
    
      return this.userService.updateRoleOfUser(Number(id),users);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.userService.delete(id);
  }
}
