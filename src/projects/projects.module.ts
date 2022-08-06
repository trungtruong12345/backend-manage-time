import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';
import { Project } from './entities/project.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { BoardItemsModule } from 'src/board-items/board-items.module';
import { BoardsModule } from 'src/boards/boards.module';
import { Board } from 'src/boards/entities/board.entity';
import { BoardItem } from 'src/board-items/entities/board-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Note, Tag, Project, Board, BoardItem]),
    UsersModule,
    BoardItemsModule,
    BoardsModule,
  ],
  controllers: [ProjectsController],
  providers: [
    ProjectsService,
    JwtService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class ProjectsModule {}
