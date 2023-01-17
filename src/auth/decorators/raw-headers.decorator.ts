import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";


export const GetRawHeader =  createParamDecorator(
    ( data, context: ExecutionContext ):string[] =>{
        const req = context.switchToHttp().getRequest();

        const rawHeaders = req.rawHeaders;
        
        if( !rawHeaders )
            throw new InternalServerErrorException();
        
        return rawHeaders;
    }
);