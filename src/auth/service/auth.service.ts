import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { from, Observable, of } from 'rxjs';
import { User } from 'src/user/models/user.entity';
const bcrypt =require('bcrypt');


@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private configService: ConfigService){}

    generateJWT(users: User): Observable <string> {

        return from(this.jwtService.signAsync(

            {
                users
              },
              {
                secret: this.configService.get<string>('JWT_SECRET'),
                expiresIn: '1000s',
              },
        ));
    }

    hashPassword(password: string): Observable <string> {
        return from<string>(bcrypt.hash(password, 12));

    }

    comparePasswords(newPassword: string, passwortHash: string): Observable<any>{
        return from(bcrypt.compare(newPassword, passwortHash));
    }
}
