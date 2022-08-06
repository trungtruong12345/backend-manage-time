import { IsNotEmpty } from 'class-validator';

export class CreateBoardItemDto {
  @IsNotEmpty()
  title: string;

  content?: string;

  @IsNotEmpty()
  boardId: string | number;

  boardItemBeforeId?: string;

  boardItemAfterId?: string;

  tags?: any[];

  est?: string;
}
