import { Response } from 'express';
import { diskStorage } from 'multer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, ParseFilePipeBuilder, HttpStatus, FileValidator, Get, Param, Res, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { fileFilter, fileRename } from './helpers';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    // fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/products',
      filename: fileRename
    })
    
  }))
  uploadFile(@UploadedFile('file', new ParseFilePipeBuilder()
            .addFileTypeValidator({ fileType: 'png' })
            // .addFileTypeValidator({ fileType: 'jpeg' })
            .addMaxSizeValidator({ maxSize:400000 })
            .build({
              fileIsRequired:true,
              errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
            })
          ) file: Express.Multer.File){

    // if(!file) throw new BadRequestException('File not found');

            const host = this.configService.getOrThrow<string>('HOST_API');

            const secureUrl = `${host}/files/product/${file.filename}`;
            return { secureUrl };
  }

  @Get('product/:imageName')
  findOne(
    @Res() res: Response,
    @Param('imageName') fileName: string 
    ){

    const path =  this.filesService.findOneFile(fileName);
      
    res.sendFile( path );
  }
}
