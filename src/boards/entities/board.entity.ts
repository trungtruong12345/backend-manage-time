import { BoardItem } from 'src/board-items/entities/board-item.entity';
import { Project } from 'src/projects/entities/project.entity';
// import { User } from 'src/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Board extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.boards, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @OneToMany(() => BoardItem, (boardItem) => boardItem.board)
  boardItems: BoardItem;

  @Column({
    type: 'double',
    nullable: true,
  })
  order: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
