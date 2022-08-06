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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';

@Controller('api/boards')
@UseGuards(JwtAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto) {
    try {
      return await this.boardsService.create(createBoardDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  async findAll(@Query('projectId') projectId: string) {
    return await this.boardsService.findAll(projectId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.boardsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBoardDto: UpdateBoardDto,
  ) {
    try {
      return await this.boardsService.update(+id, updateBoardDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.boardsService.remove(+id);
  }
}
