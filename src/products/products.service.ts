import {
  Injectable,
  InternalServerErrorException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate } from 'uuid';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities/product-image.entity';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/auth/entities/users.entity';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    const { images = [], ...productDetails } = createProductDto;
    try {
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map((image) =>
          this.productImageRepository.create({ url: image }),
        ),
        user: user
      });
      await this.productRepository.save(product);

      return product;
    } catch (error: any) {
      this.handlerException(error);
    }
  }

  async findAll(queryParams: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParams;
    try {
      const products = await this.productRepository.find({
        take: limit,
        skip: offset,
        relations: {
          images: true,
        },
      });
      return products.map(({ images, ...spreadProduct }) => ({
        ...spreadProduct,
        images: images.map(({ url }) => url),
      }));
    } catch (error) {
      this.handlerException(error);
    }
  }

  async findOne(term: string) {
    let product: Product;

    if (validate(term)) {
      product = await this.productRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.productRepository.createQueryBuilder('product');

      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('product.images', 'productImages' )
        .getOne();
    }

    if (!product)
      throw new BadRequestException(`Product with id(${term}) not found`);

    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const { images, ...restProduct } = updateProductDto;

    const product = await this.productRepository.preload({
      id,
      ...restProduct
    });

    if (!product) throw new BadRequestException(`Product with Id(${id} not found)`);
    
    const queryRunner =  this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      
      if( images ){
        await queryRunner.manager.delete(ProductImage, { product:{ id } });

        product.images = images.map( image => this.productImageRepository.create({ url:image }));
        
      }else{
        product.images = await this.productImageRepository.findBy({product:{id}});
      }

      product.user = user;
      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();
      await queryRunner.release();
      // await this.productRepository.save(product);
      return product;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();

      this.handlerException(error);
    }
  }

  async remove(id: string) {
    const product = await this.productRepository.delete(id);
    if (product.affected === 0)
      throw new BadRequestException(`Product with id(${id}) not found`);
    return 'Product deleted successfully';
  }


  async deleteAllProducts(){

    const env =  this.configService.getOrThrow<string>('NODE_ENV');

    if( env === 'dev' ){
      const query =  this.productRepository.createQueryBuilder('product');

      try {
        return await query.delete().where({}).execute();
      } catch (error) {
        this.handlerException(error);
      }
    }
  }


  private handlerException(error) {
    console.log(error);
    if (error.code === '23505')
      throw new BadRequestException(`${error.detail}`);
    if (error.status === 400)
      throw new BadRequestException(`${error.response.message}`);

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
