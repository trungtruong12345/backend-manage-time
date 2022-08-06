import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsService } from 'src/boards/boards.service';
import { Board } from 'src/boards/entities/board.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateBoardItemDto } from './dto/create-board-item.dto';
import { UpdateBoardItemDto } from './dto/update-board-item.dto';
import { BoardItem } from './entities/board-item.entity';
import { isNotEmpty } from 'class-validator';
import { Tag } from 'src/tags/entities/tag.entity';

@Injectable()
export class BoardItemsService {
  constructor(
    @InjectRepository(BoardItem)
    private readonly boardItemRepository: Repository<BoardItem>,
    @InjectRepository(Tag)
    private readonly tagReponsitory: Repository<Tag>,
    private readonly boardsService: BoardsService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createBoardItemDto: CreateBoardItemDto) {
    const {
      boardId,
      boardItemBeforeId = null,
      boardItemAfterId = null,
      title,
      content = null,
      tags,
      est,
    } = createBoardItemDto;
    const board = await this.getBoard(boardId);
    const order = await this.getOrderValue(
      boardItemBeforeId,
      boardItemAfterId,
      board,
    );
    const data = {
      board,
      title,
      content,
      order,
      est,
    };

    if (isNotEmpty(tags)) {
      data['tags'] = await this.tagReponsitory.findByIds(tags);
    }
    const boardItem = await this.boardItemRepository.save(data);
    return boardItem;
  }

  async findAll(
    boardId: number | string,
    boardItemBeforeId = null,
    search: string | null | undefined,
    limit = 20,
  ): Promise<any[]> {
    let res: any[] = [];
    if (!!boardItemBeforeId) {
      const boardItemBefore: BoardItem = await this.findOne(boardItemBeforeId);
      const orderBefore = boardItemBefore.order;
      res = await this.dataSource
        .createQueryBuilder(BoardItem, 'boardItem')
        .leftJoinAndSelect('boardItem.tags', 'tags')
        .where(
          'boardItem.order < :orderBefore and boardItem.boardId = :boardId and boardItem.title like :title',
          {
            orderBefore,
            boardId,
            title: `%${search || ''}%`,
          },
        )
        .limit(limit)
        .orderBy('boardItem.order', 'DESC')
        .getMany();
    } else {
      res = await this.dataSource
        .createQueryBuilder(BoardItem, 'boardItem')
        .leftJoinAndSelect('boardItem.tags', 'tags')
        .where('boardItem.boardId = :boardId and boardItem.title like :title', {
          boardId,
          title: `%${search || ''}%`,
        })
        .limit(limit)
        .orderBy('boardItem.order', 'DESC')
        .getMany();
    }

    return res;
  }

  async getCount(boardId) {
    return await this.dataSource
      .createQueryBuilder(BoardItem, 'boardItem')
      .where('boardItem.boardId = :boardId', { boardId })
      .getCount();
  }

  async findOne(id: number) {
    const boardItem = await this.dataSource
      .createQueryBuilder(BoardItem, 'boardItem')
      .leftJoinAndSelect('boardItem.tags', 'tag')
      .where('boardItem.id = :id', { id })
      .getOne();

    return boardItem;
  }

  async update(id: number, updateBoardItemDto: UpdateBoardItemDto) {
    const {
      title,
      content,
      boardItemBeforeId,
      boardItemAfterId,
      boardId,
      tags,
      est,
    } = updateBoardItemDto;
    let board = null;
    if (boardId) {
      board = await this.getBoard(boardId);
    } else {
      board = await (await this.findOne(id)).board;
    }
    let order = updateBoardItemDto.order;
    if (!order) {
      order = await this.getOrderValue(
        boardItemBeforeId,
        boardItemAfterId,
        board,
      );
    }
    const data = {
      title,
      content,
      order: Number(order),
      board,
      est,
    };

    if (isNotEmpty(tags)) {
      data['tags'] = await this.tagReponsitory.findByIds(tags);
    }
    // return await this.boardItemRepository.update(id, data);
    return await this.boardItemRepository.save({ id, ...data });
  }

  remove(id: number) {
    return `This action removes a #${id} boardItem`;
  }

  private async getBoard(boardId): Promise<Board> {
    return await this.boardsService.findOne(boardId);
  }

  private async getOrderValue(
    boardItemBeforeId = null,
    boardItemAfterId = null,
    board,
  ) {
    const MAX = 100;
    const MIN = 0;
    let boardItemBefore: BoardItem | null;
    let boardItemAfter: BoardItem | null;
    let order = null;
    if (!!boardItemBeforeId) {
      boardItemBefore = await this.findOne(parseInt(boardItemBeforeId));
    }
    if (!!boardItemAfterId) {
      boardItemAfter = await this.findOne(parseInt(boardItemAfterId));
    }

    do {
      if (!!boardItemBefore && !!boardItemAfter) {
        order = this.getRandomFloat(
          boardItemAfter.order,
          boardItemBefore.order,
        );
      } else if (!!boardItemBefore && !boardItemAfter) {
        order = this.getRandomFloat(MIN, boardItemBefore.order);
      } else if (!boardItemBefore && !!boardItemAfter) {
        order = this.getRandomFloat(boardItemAfter.order, MAX);
      } else {
        order = MAX / this.randomIntFromInterval(1, 70);
      }
    } while (
      isNotEmpty(
        await (
          await this.boardItemRepository.findOneBy({
            board: board,
            order: order,
          })
        )?.id,
      )
    );

    return order;
  }

  private getRandomFloat(min, max) {
    const str = (Math.random() * (max - min) + min).toFixed(100);
    return parseFloat(str);
  }

  private randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
