import { BoardItem } from 'src/board-items/entities/board-item.entity';
import { Note } from 'src/notes/entities/note.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

enum tagType {
  Note = 0,
  BoardItem = 1,
}

@Entity()
export class Tag extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  color: string;

  @ManyToMany(() => Note, (note) => note.tags, {
    onDelete: 'CASCADE',
  })
  notes: Note[];

  @ManyToOne(() => User, (user) => user.tags)
  user: User;

  @ManyToMany(() => BoardItem, (boardItem) => boardItem.tags, {
    onDelete: 'CASCADE',
  })
  boardItems: BoardItem[];

  @Column({
    type: 'int',
    default: 0,
  })
  tagType: tagType;

  @Column({
    default: 0,
  })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
