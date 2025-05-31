** Database
    - Cài đặt thư viện mongoose để kết nối và làm việc đến database mongodb
        npm install mongoose @nestjs/mongoose
    - Sự khác nhau giữa mongodb và mysql
        MySQL (RDBMS)	MongoDB (NoSQL)
        Bảng (table)	Bộ sưu tập (collection)
        Hàng (row)	Tài liệu (document)
        Cột (column)	Trường (field)
        Khóa chính (primary key)	_id (do MongoDB tự sinh nếu không có)
        Khóa ngoại (foreign key)	Thường nhúng tài liệu hoặc tham chiếu bằng ID
        
    - Cấu trúc dự án nestjs khi làm việc với mongodb
        // Cấu trúc thư mục
        src/
        |-- app.module.ts              // Module gốc của ứng dụng
        |-- main.ts                    // Điểm khởi chạy ứng dụng
        |-- users/
            |-- schemas/               // Định nghĩa schema MongoDB
                |-- user.schema.ts
            |-- dto/                   // Data Transfer Objects
                |-- create-user.dto.ts
                |-- update-user.dto.ts
            |-- users.controller.ts    // Controller xử lý request
            |-- users.service.ts       // Service xử lý logic
            |-- users.module.ts        // Module users


    - Entity là trong mysql còn trong mongodb được gọi là schema
    - Cấu hình kết nối mongodb trong app.module.ts
        @Module({
            imports: [
                useFactory: async (configService: ConfigService) => ({
                    uri: configService.get<string>('MONGO_URI),
                }),
                inject: [ConfigService]
            ],
        })

    - Định nghĩa schema trong mongodb:

        export type UserDocument = User & Document;

        @Schema({
        timestamps: true, // Tự động thêm createdAt và updatedAt
        })
        export class User {
        @Prop({ required: true })
        name: string;

        @Prop({ required: true, unique: true })
        email: string;

        @Prop()
        age: number;

        @Prop({ default: true })
        isActive: boolean;
        }
        export const UserSchema = SchemaFactory.createForClass(User);



    - Cài đặt hai package class-validator và class-transformer dùng để thực hiện cấu hình các file dto
    - Tạo các file dto để xác định dữ liệu một cách rõ ràng, đảm bảo an toàn dữ liệu,
    giảm dư thừa dữ liệu khi client truyền lên

    - Cài đặt thư viện npm aqp: dùng để tách nội dung url do client gửi lên server (/users?filter[name]=John&limit=5&sort=-createdAt&skip=10&fields=name,email)
    - Thay vì phải phân tích từng tham số thủ công thì nó sẽ tự phân tích ra như thế này 
        {
            filter: { name: 'John' },
            limit: 5,
            skip: 10,
            sort: '-createdAt',
            projection: { name: 1, email: 1 },
        }
    
    - Authentication JWT login (Xác thực người dùng)
    - Cài đặt thư viện: npm install @nestjs/jwt -> Dùng để tạo access_token cho người dùng
    - openssl rand -hex 32: lệnh này dùng để tạo một secret ngẫu nhiên trong 
    - Cài đặt thư viện passport: Dùng để xác thực người dùng
    - npm install --save @nestjs/passport passport passport-local
    - npm install --save-dev @types/passport-local
        + @nestjs/passport: thư viện cầu nối giữa nestjs và passport giúp tích hợp passport vào nestjs một cách mươt mà
        + passport: thư viện authentication middleware phổ biến cho NodeJS, hỗ trợ nhiều loại xác thực (local, Google, FaceBook...) là một nền tảng chỉnh để xác thực
        + passport-local: là một chiến lượt cụ thể cho passport, chiến lượt local chính là xác thực bảng username, password 
    - Guards: là một cơ chế bảo vệ để kiểm soát truy cập vào các route(đường dẫn API), guards quyết định xem một yêu cầu request có được đi tiếp không