import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProductsService } from 'src/products/products.service';
import { initialData } from '../seed/data/seed-data';


@Injectable()
export class SeedService {

  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductsService,
  ){}

  async execute() {
    
      const env = this.configService.getOrThrow<string>('NODE_ENV');

    try {
      if( env !== 'dev' ) throw new InternalServerErrorException();

      await this.insertNewProducts();
      return 'Seed executed successfully';
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Production Environment can not use this path');
    }
  }



  private async insertNewProducts() {
    await this.productService.deleteAllProducts();
    
    initialData.products.forEach( async(product) => {
      await this.productService.create(product);
    });

    return true;
  }
}
