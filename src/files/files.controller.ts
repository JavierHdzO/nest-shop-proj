import { Controller, Post, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, BadRequestException, ParseFilePipeBuilder, HttpStatus, FileValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileRename } from './helpers';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    // fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/uploads',
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
            return file;
  }

  
}
