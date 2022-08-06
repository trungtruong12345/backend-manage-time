import { Board } from 'src/boards/entities/board.entity';
import { Tag } from 'src/tags/entities/tag.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class BoardItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'double',
  })
  order: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  est: string;

  @ManyToOne(() => Board, (board) => board.boardItems, {
    onDelete: 'CASCADE',
  })
  board: Board;

  @ManyToMany(() => Tag, (tag) => tag.boardItems, { cascade: true })
  @JoinTable()
  tags: Tag[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
