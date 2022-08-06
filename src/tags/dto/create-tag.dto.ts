import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty()
  name: string;

  color: string;

  tagType: number;

  order: number;
}
