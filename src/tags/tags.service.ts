import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNotEmpty } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
// import { CreateTagDto } from './dto/create-tag.dto';
// import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
    private readonly dataSource: DataSource,
  ) {}
  // create(createTagDto: CreateTagDto) {
  //   return 'This action adds a new tag';
  // }

  async findAll(userId: number) {
    return await this.dataSource
      .createQueryBuilder()
      .select('tag')
      .from(Tag, 'tag')
      .where('tag.userId = :userId', { userId })
      .orderBy('tag.order', 'ASC')
      .getMany();
  }

  // async update(tag: UpdateTagDto) {
  //   const id = tag.id;
  //   if (!isNotEmpty(id)) return;

  //   return await this.tagRepository.save({ ...tag });
  // }

  // async create(tag: CreateTagDto) {
  //   return await this.tagRepository.save({ ...tag });
  // }

  // async remove(id: number) {
  //   return await (await this.tagRepository.findOneBy({ id })).remove();
  // }

  async updateTags(tags: UpdateTagDto[], userId: number) {
    const ids = [];
    return await this.dataSource
      .transaction(async (transactionalEntityManager) => {
        for (let i = 0; i < tags.length; i++) {
          const tag = tags[i];
          const id = tag.id;
          if (isNotEmpty(tag.id)) {
            ids.push(id);
            delete tag.id;
            await transactionalEntityManager
              .createQueryBuilder()
              .update(Tag, { ...tag })
              .where('id = :id', { id })
              .execute();
          } else {
            const newtag = await transactionalEntityManager
              .create(Tag, {
                name: tag.name,
                color: tag.color,
                tagType: tag.tagType,
                order: tag.order,
                user: await User.findOneBy({ id: userId }),
              })
              .save();
            ids.push(newtag.id);
          }
        }

        const deleTags = await transactionalEntityManager
          .createQueryBuilder()
          .delete()
          .from(Tag)
          .where('tag.userId = :userId', { userId });
        if (ids.length > 0) {
          deleTags.andWhere('id NOT IN (:ids)', { ids });
        } else {
          deleTags.andWhere('id IS NOT NULL');
        }
        deleTags.execute();
      })
      .catch((err) => {
        console.log(err);
        return err;
      });
  }

  async createTagsDefaultForUser(userId: number) {
    const data = [
      {
        name: 'BUG',
        tagType: 1,
        color: '#c0392b',
      },
      {
        name: 'EGG',
        tagType: 1,
        color: '#e67e22',
      },
      {
        name: 'HIGH',
        tagType: 1,
        color: '#e74c3c',
      },
      {
        name: 'NORMAL',
        tagType: 1,
        color: '#27ae60',
      },
      {
        name: 'DRAFT',
        tagType: 0,
        color: '#3471ff',
      },
      {
        name: 'DOC',
        tagType: 0,
        color: '#e67e22',
      },
      {
        name: 'OTHER',
        tagType: 0,
        color: '#FDA7DF',
      },
    ];

    for (let index = 0; index < data.length; index++) {
      const tag = data[index];
      await this.dataSource
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values({
          ...tag,
          order: index,
          user: await User.findOneBy({ id: userId }),
        })
        .execute()
        .then((res) => {
          console.log(res);
          return res;
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} tag`;
  // }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
