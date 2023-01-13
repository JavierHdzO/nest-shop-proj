import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeORMError } from 'typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [ConfigModule, ProductsModule, TypeORMError],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
