import { NotFoundException } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { GetEntriesQuery, ResourseType } from 'src/types/custom';

export const throwNotFoundError = (itemType: ResourseType, itemId: string) => {
  throw new NotFoundException(`${itemType} with id ${itemId} was not found`);
};

export const getFilterForGettingEntries = (query: GetEntriesQuery) => {
  const filter = {} as any;
  if (query.category) filter.category = new ObjectId(query.category);
  if (query.search) filter.title = { $regex: query.search, $options: 'i' };
  if (query.status) {
    filter.status = query.status;
  }
  return filter;
};
