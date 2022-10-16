import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { UserService } from './user.service';
import { User } from './decorators/user.decorator';
import { UpdateUserDto } from './dto/updateUser.dto';
import { Types } from 'mongoose';
import { UserModel } from './user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @Auth('admin')
  async getProfile(@User('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put('profile')
  async updateProfile(@User('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto);
  }

  @Auth()
  @Get('profile/favorites')
  async getFavorites(@User('_id') _id: Types.ObjectId) {
    return this.userService.getFavoriteMovies(_id);
  }

  @Auth()
  @HttpCode(200)
  @Put('profile/favorites')
  async toggleFavorites(
    @Body('movieId') movieId: Types.ObjectId,
    @User() user: UserModel,
  ) {
    return this.userService.toggleFavorite(movieId, user);
  }

  @Get('count')
  @Auth('admin')
  async getCountUsers() {
    return this.userService.getCount();
  }

  @Get()
  @Auth('admin')
  async getUsers() {
    return this.userService.getAll();
  }

  @Get('profile/:_id')
  @Auth('admin')
  async getUser(@Param('_id') _id: string) {
    return this.userService.byId(_id);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Put(':_id')
  async updateUser(@Param('_id') _id: string, @Body() dto: UpdateUserDto) {
    return this.userService.updateProfile(_id, dto);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Auth()
  @Delete(':_id')
  async deleteUser(@Param('_id') _id: string) {
    return this.userService.delete(_id);
  }
}
