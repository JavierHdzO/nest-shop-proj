import  {join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from 'src/config/configuration';
import { JoiValidationSchema } from './config/validation-schema';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: JoiValidationSchema
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host:process.env.HOST_DB,
      port: Number(process.env.PORT_DB),
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD_DB,
      database:process.env.DATABASE_NAME,
      entities: [Product],
      autoLoadEntities: true,
      synchronize: true
    }),
    ProductsModule,
    CommonModule
  ],
})
export class AppModule {}
