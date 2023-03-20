import { IsObject } from 'class-validator';

export class CreateOrderidDto {
  @IsObject()
  notes: object;
}
