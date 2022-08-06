import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { Note } from './entities/note.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Tag } from 'src/tags/entities/tag.entity';
// import { map, Observable } from 'rxjs';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
    @InjectRepository(Tag) private readonly tagReponsitory: Repository<Tag>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userid, createNoteDto: CreateNoteDto) {
    const user = await this.usersService.findOne(userid);
    const tags = await this.tagReponsitory.findByIds(createNoteDto.tags);
    createNoteDto.tags = tags;
    const note = await this.noteRepository.save({
      user,
      ...createNoteDto,
    });

    delete note.user;
    return note;
  }

  async paginate(
    option: IPaginationOptions,
    userId: number,
    search: string,
    tags: any[],
  ): Promise<Pagination<Note>> {
    const query = this.noteRepository.createQueryBuilder('notes');
    query.where('notes.userId = :id', { id: userId });

    if (!!search)
      query.andWhere('notes.title LIKE :search', { search: `%${search}%` });

    if (!!tags && tags.length > 0) {
      query
        .innerJoinAndSelect('notes.tags', 'tag')
        .andWhere('tag.id in (:tags)', { tags });
    }
    query.orderBy('notes.id', 'DESC');
    return paginate<Note>(query, option);
  }

  async findOne(id: number, userId: number) {
    const note = await this.dataSource
      .createQueryBuilder(Note, 'note')
      .leftJoinAndSelect('note.tags', 'tag')
      .where('note.userId = :userId and note.id = :id', { userId, id })
      .getOne();
    return note;
  }

  async update(id: number, userId: number, updateNoteDto: UpdateNoteDto) {
    const { title, content } = updateNoteDto;
    await this.dataSource
      .createQueryBuilder()
      .update(Note)
      .set({ title, content })
      .where('id = :id and userId = :userId', { id, userId })
      .execute();
    const note = await this.findOne(id, userId);
    if (note.id) {
      const tags = await await this.tagReponsitory.findByIds(
        updateNoteDto.tags,
      );
      note.tags = tags;
      await this.noteRepository.save(note);
    }
    return note;
  }

  async remove(id: number, userId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(Note)
      .where('id = :id and userId = :userId', { id, userId })
      .execute();
  }
}
