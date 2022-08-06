import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from 'src/projects/entities/project.entity';
// import { Project } from 'src/projects/entities/project.entity';
// import { User } from 'src/users/entities/user.entity';
// import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBoardDto: CreateBoardDto) {
    const { projectId } = createBoardDto;
    const project = await this.getProject(projectId);
    const newBoard = await this.boardRepository.save({
      project,
      ...createBoardDto,
    });
    delete newBoard.project;
    return newBoard;
  }

  async findAll(projectId) {
    return await this.dataSource
      .createQueryBuilder(Board, 'board')
      .where('projectId = :projectId', {
        projectId,
      })
      .orderBy('board.order', 'ASC')
      .addOrderBy('board.created_at', 'ASC')
      .execute();
  }

  async findOne(id: number) {
    return await this.boardRepository.findOneBy({ id });
  }

  async update(id: number, updateBoardDto: UpdateBoardDto) {
    return await this.boardRepository.update(id, { ...updateBoardDto });
  }

  async remove(id: number) {
    return await (await this.boardRepository.findOneBy({ id })).remove();
  }

  private async getProject(projectId): Promise<Project> {
    return await this.projectRepository.findOneBy({ id: projectId });
  }
}
