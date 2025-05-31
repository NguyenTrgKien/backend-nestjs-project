import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Tên không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'Email không được để trống!' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  phone?: string;

  image?: string;

  address?: string;
}
