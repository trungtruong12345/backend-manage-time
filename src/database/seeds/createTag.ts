import { Tag } from 'src/tags/entities/tag.entity';
import { Connection } from 'typeorm';

const createTags = async (con: Connection) => {
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
    const count = await con
      .createQueryBuilder()
      .from(Tag, 'tags')
      .where('name = :name AND tagType = :tagType', {
        name: tag.name,
        tagType: tag.tagType,
      })
      .getCount();
    if (count < 1) {
      await con
        .createQueryBuilder()
        .insert()
        .into(Tag)
        .values({
          ...tag,
          order: index,
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
};

export default createTags;
