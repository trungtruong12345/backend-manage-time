import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { UsersModule } from 'src/users/users.module';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note, Tag]), UsersModule],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
