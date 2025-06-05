import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from '../../decorator/customize';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/create-user')
  @Public()
  createUser(@Body() dataUser: CreateUserDto) {
    return this.userService.createUser(dataUser);
  }

  @Get('/get-user')
  getUser(
    @Query() query: string,
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
  ) {
    return this.userService.findAllUser(query, +current, +pageSize);
  }

  @Patch('/update-user')
  updateUsers(@Body() dataUpdate: UpdateUserDto) {
    return this.userService.updateUser(dataUpdate);
  }

  @Delete('/delete-user/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get('/get-profile/:userId')
  @Public() // Khai báo public để route này không cần sử dụng guard
  getProfile(@Param('userId') userId: string) {
    return this.userService.getProfile(userId);
  }
}
