import { Note } from 'src/notes/entities/note.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  username: string;

  @Column({
    default: null,
    unique: true,
  })
  email?: string;

  @Column()
  password: string;

  @Column({
    default: false,
  })
  active?: boolean;

  @Column({
    default: null,
  })
  confirmCode?: string;

  @Column({
    default: null,
  })
  deviceToken?: string;

  @OneToMany(() => Note, (note) => note.user)
  notes: Note;

  @OneToMany(() => Project, (project) => project.user)
  projects: Project;

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag;
}
