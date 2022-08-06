import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { NotesModule } from './notes/notes.module';
import { TagsModule } from './tags/tags.module';
import config from './config/config-database';
import { ConfigModule } from '@nestjs/config';
import { ProjectsModule } from './projects/projects.module';
import { BoardsModule } from './boards/boards.module';
import { BoardItemsModule } from './board-items/board-items.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(config),
    UsersModule,
    AuthModule,
    MailModule,
    NotesModule,
    TagsModule,
    ProjectsModule,
    BoardsModule,
    BoardItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
