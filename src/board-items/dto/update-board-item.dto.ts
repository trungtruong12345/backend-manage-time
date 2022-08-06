import { PartialType } from '@nestjs/mapped-types';
import { CreateBoardItemDto } from './create-board-item.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBoardItemDto extends PartialType(CreateBoardItemDto) {
  @IsNotEmpty()
  title: string;

  content?: string;

  @IsNotEmpty()
  boardId: string | number;

  boardItemBeforeId?: string;

  boardItemAfterId?: string;

  order?: number | string;
}
