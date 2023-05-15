import { NotFoundException } from '@nestjs/common';
import { ResourseType } from 'src/types/custom';

export const throwNotFoundError = (itemType: ResourseType, itemId: string) => {
  throw new NotFoundException(`${itemType} with id ${itemId} was not found`);
};
