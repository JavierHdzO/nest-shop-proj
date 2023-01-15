import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {

    @IsString()
    @IsEmail()
    email!:string

    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password!:string;

    @IsString()
    @MinLength(2)
    @IsOptional()
    fullName?: string;
}
