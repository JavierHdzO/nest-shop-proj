import { Injectable, InternalServerErrorException, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate } from 'uuid';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ){}

  async create(createProductDto: CreateProductDto) {
    
    try {
      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;
    } catch (error: any) {
      this.handlerException(error);
    }
  }

  async findAll(queryParams: PaginationDto) {
    const { limit = 10, offset=0 } = queryParams;
    try {
      const products =  await this.productRepository.find({ take:limit, skip:offset });
      return products;
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findOne(term: string) {

      let product: Product;

      if( validate(term) ){
        product = await this.productRepository.findOneBy({id:term});
      }else{
        const queryBuilder = this.productRepository.createQueryBuilder();

        product =  await queryBuilder.where('UPPER(title)=:title or slug=:slug', {
          title:term.toUpperCase(),
          slug: term.toLowerCase()
        }).getOne();
      }

      if( !product ) throw new BadRequestException(`Product with id(${term}) not found`);

      return product;
    
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  async remove(id: string) {
      const product =  await this.productRepository.delete(id);
      if(product.affected === 0) throw new BadRequestException(`Product with id(${id}) not found`);
      return product;
    
  }

  private handlerException(error){
      console.log(error);
      if(error.code === "23505" || error.status === 400) throw new BadRequestException(`${error.detail || error.response.message}`);
     
      this.logger.error(error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
