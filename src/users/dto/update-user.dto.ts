import { PartialType } from '@nestjs/mapped-types';
// import { UpdateNoteDto } from 'src/notes/dto/update-note.dto';
// import { Note } from 'src/notes/entities/note.entity';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  active?: boolean;
  // notes?: Note[];
}
