

export const fileFilter = ( req: Express.Request, file: Express.Multer.File, callback: Function) => {

    if( !file ) return callback( new Error('File not found'), false );

    const fileExtension = file.mimetype.split('/')[1];
    const validExtensions = ['jpeg', 'png', 'jpg'];

    if(validExtensions.includes(fileExtension)){
        return callback(null, true);
    }
}