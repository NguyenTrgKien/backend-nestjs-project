** Database
    - Cài đặt TypeOrm để thao tác với cơ sở dữ liệu 
        npm install @nestjs/typeorm typeorm 
    - Cài đặt thư viện mongoose để kết nối và làm việc đến database mongodb
        npm install mongoose @nestjs/mongoose
    - Entity trong mongodb được gọi là schema
    - Cấu hình kết nối trong app.module.ts
    @Module({
        imports: [
            useFactory: async (configService: ConfigService) => ({
                uri: configService.get<string>('MONGO_URI),
            }),
            inject: [ConfigService]
        ],
    })
    