import {
  BadGatewayException,
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
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import dayjs from 'dayjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly mailerService: MailerService,
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

  async getProfile(userId: string) {
    const isValidId = mongoose.isValidObjectId(userId); // Kiểm tra xem có phải là một ObjectId hợp lệ hay không
    if (!isValidId) {
      throw new BadGatewayException('Id người dùng không hợp lệ!');
    }
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng!');
    }
    return user;
  }

  handleRegister = async (registerDto: CreateAuthDto) => {
    const { email, password, name } = registerDto;

    // Kiểm tra email đã tồn tại?
    const isExist = await this.userModel.findOne({ email });
    if (isExist) {
      throw new BadRequestException(
        `Email ${email} đã tồn tại. Vui lòng chọn email khác`,
      );
    }
    // Băm mật khẩu
    const hashPassword = await hashPasswordHelper(password);
    const codeId = uuidv4();
    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      isActive: false,
      codeId: codeId,
      codeExpired: dayjs().add(1, 'M'),
      createAt: new Date(),
    });

    try {
      // Gửi email đăng kí thành công
      await this.mailerService.sendMail({
        to: user.email, // list of receivers
        subject: 'Thông báo đăng kí người dùng thành công ✔', // Subject line
        template: 'register', // Tên template dùng để render nội dung email
        context: {
          // Các biến sẽ truyền vào template
          username: user.name,
          email: user.email,
          registrationDate: user.createAt,
        },
      });
    } catch (error) {
      console.error('Gửi email thất bại: ', error);
    }

    return {
      message: 'Tạo người dùng thành công!',
      id: user._id,
    };
  };
}
