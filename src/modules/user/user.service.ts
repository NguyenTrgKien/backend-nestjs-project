import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/util';
import aqp from 'api-query-params';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async findAllUser(query: string, current: number, pageSize: number) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    if (!current) current = 1; // Mặt định trang hiện tại là 1
    if (!pageSize) pageSize = 10; // Mặc định pageSize là 10

    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);

    const skip = (current - 1) * pageSize;
    const result = await this.userModel
      .find(filter) // Tìm kiếm
      .limit(pageSize) // Số lượng cần lấy
      .skip(skip)
      .select('-password') // Không lấy trường password
      .sort(sort as any); // Sắp xếpxếp
    return { result, totalPages };
  }

  async createUser(dataUser: CreateUserDto) {
    const { name, email, password, phone, image, address } = dataUser;

    const checkEmail = await this.userModel.exists({ email });

    if (checkEmail) {
      throw new BadRequestException(`Email đã tồn tại! ${email}`);
    }

    const hashPassword = await hashPasswordHelper(password);
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });

    return {
      message: 'Thêm người dùng thành công!',
      user: user,
    };
  }

  async updateUser(dataUpdate: UpdateUserDto) {
    const user = await this.userModel.findOne({ _id: dataUpdate.id });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }
    const isUpdate = await this.userModel.updateOne(
      { _id: user.id },
      { ...dataUpdate },
    );

    if (isUpdate.matchedCount === 0) {
      throw new BadRequestException('Không tìm thấy người dùng để cập nhật!');
    }

    if (isUpdate.modifiedCount === 0) {
      return {
        message: 'Không có thay đổi nào được thực hiện (dữ liệu giống nhau)',
      };
    }
    return {
      message: 'Cập nhật người dùng thành công!',
    };
  }

  async deleteUser(id: string) {
    const checkIdUser = mongoose.isValidObjectId(id);
    if (!checkIdUser) {
      throw new BadRequestException('Id không hợp lệ');
    }
    const deleteUser = await this.userModel.deleteOne({ _id: id });

    if (deleteUser.deletedCount === 0) {
      return {
        message: 'Không tìm thấy người dùng để xóa!',
      };
    }

    return {
      message: 'Xóa người dùng thành công!',
    };
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
}
