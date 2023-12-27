import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignUpDTO {
  @ApiProperty({ example: 'Nguyễn Văn A', type: String })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'user', type: String })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: '123456', type: String })
  @IsString()
  @IsNotEmpty()
  password: string;

  // @ApiProperty({ example: '123456', type: String })
  // @IsString()
  // @IsNotEmpty()
  // passwordConfirm: string;
}
