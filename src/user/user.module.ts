import { AuthModule } from './../auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './controller/user.controller';
import { UserEntity } from './models/user.interface';
import { UserService } from './service/user.service';
import { AuthService } from 'src/auth/service/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity]),
  AuthModule
 ],
  controllers: [UserController],
  providers: [UserService,JwtService,AuthService],
  exports: [UserService]
})
export class UserModule {}
