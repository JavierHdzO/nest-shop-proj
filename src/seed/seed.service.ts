import { Repository } from 'typeorm';
import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/users.entity';
import { ProductsService } from 'src/products/products.service';
import { initialData } from '../seed/data/seed-data';
import { use } from 'passport';


@Injectable()
export class SeedService {

  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly productService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

  async execute() {
    
      const env = this.configService.getOrThrow<string>('NODE_ENV');

    try {
      if( env !== 'dev' ) throw new InternalServerErrorException();

      await this.deleteTables();
      const user = await this.insertUsers()
      await this.insertNewProducts(user);
      return 'Seed executed successfully';
      
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Production Environment can not use this path');
    }
  }

  private async insertUsers(){
    const seedUsers = initialData.users;
    const users: User[] = [];
    seedUsers.forEach( async(user)=> {
      
       users.push(this.userRepository.create(user));
    })

    const dbUsers = await this.userRepository.save(users);

    return dbUsers[0];
  }

  private async insertNewProducts( user: User) {
    await this.productService.deleteAllProducts();
    
    initialData.products.forEach( async(product) => {
      await this.productService.create(product, user);
    });

    return true;
  }

  private async deleteTables(){
    this.productService.deleteAllProducts();

    const queryBuilder =  this.userRepository.createQueryBuilder();
    await queryBuilder
          .delete()
          .where({})
          .execute();
  }
}
