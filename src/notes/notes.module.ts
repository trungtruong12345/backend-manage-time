import { Module } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Note } from './entities/note.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { Tag } from 'src/tags/entities/tag.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([User, Note, Tag]), UsersModule],
  controllers: [NotesController],
  providers: [
    NotesService,
    JwtService,
    // {
    //   provide: APP_GUARD,
    //   useClass: JwtAuthGuard,
    // },
  ],
})
export class NotesModule {}
