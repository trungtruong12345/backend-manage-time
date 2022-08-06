import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagsService } from './tags.service';
// import { CreateTagDto } from './dto/create-tag.dto';
// import { UpdateTagDto } from './dto/update-tag.dto';
@UseGuards(JwtAuthGuard)
@Controller('api/tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  // @Post()
  // create(@Body() createTagDto: CreateTagDto) {
  //   return this.tagsService.create(createTagDto);
  // }

  @Get()
  async findAll(@Req() request) {
    return await this.tagsService.findAll(parseInt(request.user.userId));
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagsService.findOne(+id);
  // }

  @Patch('updateTags')
  async updateTags(@Body() updateTagsDto: UpdateTagDto[], @Req() request) {
    return await this.tagsService.updateTags(
      updateTagsDto,
      parseInt(request.user.userId),
    );
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagsService.remove(+id);
  // }
}
