import { existsSync } from 'fs';
import { join } from 'path'; 
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {

  
    findOneFile( fileName: string ){

        const path = join(__dirname, '../../static/products', fileName);

        if( !existsSync(path) ) throw new BadRequestException('File not found');

        return path;
        
    }
}
