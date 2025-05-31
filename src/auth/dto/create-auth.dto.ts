import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({ message: 'username không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'password không được để trống' })
  password: string;
}
