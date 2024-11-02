import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('register')
  async register(@Body() body) {
    const { email, password } = body;
    const existingUser = await this.userService.findUserByEmail(email);
    if (existingUser) {
      throw new HttpException('Email already exists', HttpStatus.BAD_REQUEST);
    }
    await this.userService.registerUser(email, password);
    return { message: 'User registered successfully' };
  }

  @Post('login')
  async login(@Body() body) {
    const { email, password } = body;
    const user = await this.userService.validateUser(email, password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return { message: 'Login successful' };
  }
}
