import { IsOptional, IsString, IsArray } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  password?: string

  @IsOptional()
  @IsArray()
  permissions?: string[]
}