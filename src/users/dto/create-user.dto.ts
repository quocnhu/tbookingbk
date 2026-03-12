import { IsEmail, IsString, IsArray, MinLength } from 'class-validator'

export class CreateUserDto {
 @IsString()
   fullName: string
   @IsEmail()
   email: string
 
   @IsString()
   @MinLength(6)
   password: string
}