import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  BadRequestException,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Note } from './entities/note.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('api/notes')
@UseGuards(JwtAuthGuard)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  async findAll(
    @Query('page') page: number | 1,
    @Query('search') search: string,
    @Query('tags') tags: any[],
    @Req() request,
  ): Promise<Pagination<Note>> {
    const limit = 20;
    return await this.notesService.paginate(
      { page, limit },
      request.user.userId,
      search,
      tags,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request) {
    return await this.notesService.findOne(+id, request.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @Req() request,
  ) {
    return await this.notesService.update(
      +id,
      request.user.userId,
      updateNoteDto,
    );
  }

  @Post()
  async create(@Body() createNoteDto: CreateNoteDto, @Req() request) {
    try {
      const note = await this.notesService.create(
        request.user.userId,
        createNoteDto,
      );
      return note;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() request) {
    return this.notesService.remove(+id, request.user.userId);
  }
}
