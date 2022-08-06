import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BoardItemsService } from './board-items.service';
import { CreateBoardItemDto } from './dto/create-board-item.dto';
import { UpdateBoardItemDto } from './dto/update-board-item.dto';

@Controller('api/board-items')
@UseGuards(JwtAuthGuard)
export class BoardItemsController {
  constructor(private readonly boardItemsService: BoardItemsService) {}

  @Post()
  async create(@Body() createBoardItemDto: CreateBoardItemDto) {
    try {
      return await this.boardItemsService.create(createBoardItemDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get('getCount')
  async getCount(@Query('boardId') boardId: string) {
    const res: number = await this.boardItemsService.getCount(boardId);
    return res;
  }

  @Get()
  async findAll(
    @Query('boardId') boardId: string,
    @Query('boardItemBeforeId') boardItemBeforeId: string,
    @Query('search') search: string,
  ) {
    const res: any[] = await this.boardItemsService.findAll(
      boardId,
      boardItemBeforeId,
      search,
    );
    return res;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.boardItemsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardItemDto: UpdateBoardItemDto,
  ) {
    try {
      return await this.boardItemsService.update(+id, updateBoardItemDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boardItemsService.remove(+id);
  }
}
