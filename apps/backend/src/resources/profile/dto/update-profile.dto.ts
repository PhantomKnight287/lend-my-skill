import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDTO {
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  bio?: string;
}
