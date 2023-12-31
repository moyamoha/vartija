import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
import { POSSIBLE_ENTRY_STATUS } from 'src/utils/constants';

export interface CustomReq extends Request {
  user?: UserDocument;
}

export type Mfa = {
  enabled: boolean;
  userSecret: string;
};

export type ResourseType = 'Category' | 'Entry' | 'User';

export type EntryStatus = (typeof POSSIBLE_ENTRY_STATUS)[number];
