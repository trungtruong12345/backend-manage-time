import { Module } from '@nestjs/common';
import { BoardItemsService } from './board-items.service';
import { BoardItemsController } from './board-items.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/users/entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Board } from 'src/boards/entities/board.entity';
import { BoardItem } from './entities/board-item.entity';
import { BoardsModule } from 'src/boards/boards.module';
import { TagsModule } from 'src/tags/tags.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Note, Tag, Project, Board, BoardItem]),
    UsersModule,
    BoardsModule,
    TagsModule,
  ],
  controllers: [BoardItemsController],
  providers: [
    BoardItemsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class BoardItemsModule {}
