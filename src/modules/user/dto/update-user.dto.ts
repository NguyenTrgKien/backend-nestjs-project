import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsMongoId({ message: '  Id không hợp lệ!' })
  @IsNotEmpty({ message: 'Vui lòng truyền id người dùng!' })
  id: string;

  name: string;

  phone?: string;

  image: string;

  address?: string;
}
