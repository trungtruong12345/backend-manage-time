import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { User } from 'src/users/entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
import { UsersModule } from 'src/users/users.module';
import { Board } from './entities/board.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Note, Tag, Project, Board]),
    UsersModule,
  ],
  controllers: [BoardsController],
  providers: [
    BoardsService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
  exports: [BoardsService],
})
export class BoardsModule {}
