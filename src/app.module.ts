import  {join } from 'path';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';
import { JoiValidationSchema } from './config/validation-schema'; 

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      validationSchema: JoiValidationSchema
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public')
    })
  ],
})
export class AppModule {}
