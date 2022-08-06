import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { TagsService } from 'src/tags/tags.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
  ) {}

  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
  ) {
    console.log(username, password);
    const validateUser = await this.authService.validateUser(
      username,
      password,
    );
    if (!!validateUser) {
      return await this.authService.login(validateUser);
    }

    throw new BadRequestException('Login false!');
  }

  @Post('google')
  async loginByGoogle(@Body('access_token') access_token: string) {
    const data = await this.authService.google(access_token);
    const { email = null, name = null } = data;
    console.log(email);
    if (email) {
      let user = await this.usersService.findOneBy({ email });
      if (!user?.email) {
        user = await this.usersService.create({
          username: name,
          email,
          password: String(
            Math.floor(Math.random() * (999999 - 100000)) + 100000,
          ),
        });
        user.active = true;
        await User.save(user);
        await this.tagsService.createTagsDefaultForUser(user.id);
      }
      const token = await this.authService.login(user);
      return { ...token, username: user.username, email: user.email };
    } else {
      return {};
    }
  }

  // @UseGuards(JwtAuthGuard)
  // @Get('profile')
  // getProfile(@Request() req) {
  //   return req.user;
  // }
}
