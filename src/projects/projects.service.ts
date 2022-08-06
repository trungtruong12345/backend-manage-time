import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardItem } from 'src/board-items/entities/board-item.entity';
import { BoardsService } from 'src/boards/boards.service';
import { Board } from 'src/boards/entities/board.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { DataSource, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { isNotEmpty } from 'class-validator';

@Injectable()
export class ProjectsService {
  constructor(
    private readonly boardsService: BoardsService,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async create(userId, createProjectDto: CreateProjectDto) {
    const user = await this.getUser(userId);
    const newProject = await this.projectRepository.save({
      user,
      ...createProjectDto,
    });
    if (isNotEmpty(newProject.id)) {
      const todo = this.boardsService.create({
        name: 'Todo',
        projectId: newProject.id,
        order: 1,
      });
      const doing = this.boardsService.create({
        name: 'Doing',
        projectId: newProject.id,
        order: 2,
      });
      const done = this.boardsService.create({
        name: 'Done',
        projectId: newProject.id,
        order: 3,
      });
      await Promise.all([todo, doing, done]);
    }
    delete newProject.user;
    return newProject;
  }

  async findAll(userId) {
    const projects = await this.dataSource
      .createQueryBuilder(Project, 'project')
      .where('project.userId = :userId', { userId })
      .orderBy('project.order', 'DESC')
      .addOrderBy('project.created_at', 'DESC')
      .getMany();
    const data = [];
    for (let index = 0; index < projects.length; index++) {
      const project = projects[index];
      const BoardItems = this.dataSource
        .createQueryBuilder(BoardItem, 'boardItem')
        .innerJoin(Board, 'board', 'boardItem.boardId = board.id')
        .innerJoin(Project, 'project', 'project.id = board.projectId')
        .where('project.id = :id', { id: project.id });
      const updated_at = (
        await BoardItems.orderBy('boardItem.updated_at', 'DESC').getOne()
      )?.updated_at;
      const maxUpdatedAt =
        !!updated_at && updated_at >= project.created_at
          ? updated_at
          : project.created_at;
      data.push({
        id: project.id,
        name: project.name,
        updated_at: project.updated_at,
        created_at: project.created_at,
        countBoardItems: await BoardItems.getCount(),
        order: project.order,
        maxUpdatedAt,
      });
    }
    return data;
  }

  async findOne(id: number) {
    return await this.projectRepository.findOneBy({ id });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const res = await this.projectRepository.save({ id, ...updateProjectDto });
    delete res.user;
    return res;
  }

  async remove(id: number) {
    return await (await this.projectRepository.findOneBy({ id })).remove();
  }

  private async getUser(userId): Promise<User> {
    return await this.usersService.findOne(userId);
  }
}
