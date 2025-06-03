import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;
// User là tên các thuộc tính (name, email. password...)
// Document là interface của mongoose đại diện cho một document
// User & Document tạo ra kiểu dữ liệu mới là UserDocument, có cả các field(name, email, password) và các method của mongoose documentdocument

@Schema({ timestamps: true }) // Tự động tạo trường updated_at và created_at
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  image: string;

  @Prop({ default: 'USERS' })
  role: string;

  @Prop({ default: 'LOCAL' })
  accountType: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  address: string;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;

  @Prop()
  createAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); // Dòng này dùng để chuyển class user thành schema của mongoose schema
