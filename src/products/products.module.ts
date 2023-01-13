import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([Product, ProductImage])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports:[ProductsService, TypeOrmModule]
})
export class ProductsModule {}
