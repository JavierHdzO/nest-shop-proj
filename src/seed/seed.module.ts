import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeORMError } from 'typeorm';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { ProductsModule } from 'src/products/products.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [ConfigModule, ProductsModule, TypeORMError, AuthModule],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
