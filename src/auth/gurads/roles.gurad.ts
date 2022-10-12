import { User } from 'src/user/models/user.entity';
import { map, Observable } from 'rxjs';
import { UserService } from './../../user/service/user.service';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";




@Injectable()
export class  RolesGuard implements CanActivate{
constructor(
    private reflector :Reflector,
    private userService:UserService
    ){}


canActivate(context :ExecutionContext): boolean | Promise<boolean>|Observable<boolean>{
   const  roles = this.reflector.get<string[]>('roles',context.getHandler());


   if (!roles){

    return true;
   }

   const request = context.switchToHttp().getRequest();
   
   const users:User = request.User;
    return this.userService.findOne(users.id).pipe(
        map((users:User) => {

            const hasRole = () =>roles.indexOf(users.role) > -1;
            let hasPermission: boolean = false;

            if (hasRole()) {hasPermission= true};
            return users && hasPermission;
        })
    )

}

}