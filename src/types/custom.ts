import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { POSSIBLE_ENTRY_STATUS } from 'src/utils/constants';
import { POSSIBLE_ACTIVITY_TYPES } from 'src/utils/constants';

export interface CustomReq extends Request {
  user?: UserDocument;
}

export type ChangeCategoryPayload = {
  oldCategoryId: string;
  newCategoryId: string;
};

export type ResourseType = 'Category' | 'Entry' | 'User';

export type EntryStatus = typeof POSSIBLE_ENTRY_STATUS[number];
export type IUserActivity = typeof POSSIBLE_ACTIVITY_TYPES[number];
