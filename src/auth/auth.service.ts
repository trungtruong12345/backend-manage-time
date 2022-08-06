import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpModule: HttpService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    console.log(username);
    const user = await this.usersService.findOneBy({ username });
    if (
      !user ||
      !(await bcrypt.compare(password, user.password)) ||
      !user.active
    ) {
      return null;
    }
    delete user.password;
    delete user.confirmCode;
    return user;
  }

  async login(user: any) {
    const payload = { username: user.username, userId: user.id };
    console.log(payload);
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async google(access_token: string) {
    try {
      const url =
        'https://www.googleapis.com/oauth2/v3/userinfo?access_token=' +
        access_token;
      const res = await this.httpModule.axiosRef.get(url);
      return { email: res.data.email, name: res.data?.name };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
