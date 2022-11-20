import { Request } from 'express';
import { UserDocument } from 'src/schemas/user.schema';
export interface CustomReq extends Request {
    user?: UserDocument;
}
