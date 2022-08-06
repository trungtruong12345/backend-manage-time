import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @Req() request) {
    try {
      return await this.projectsService.create(
        request.user.userId,
        createProjectDto,
      );
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get()
  async findAll(@Req() request) {
    return await this.projectsService.findAll(request.user.userId);
  }

  @Get(':id')
  async indOne(@Param('id') id: string) {
    return await this.projectsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    try {
      return await this.projectsService.update(+id, updateProjectDto);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.projectsService.remove(+id);
  }
}
