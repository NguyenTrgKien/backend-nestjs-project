// File này được cấu hình để tạo một custom decorator tên là @Public, mục đích chính là để đánh dấu một route là public, tức là không cần xác thực
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
