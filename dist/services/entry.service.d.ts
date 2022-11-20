/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { CategoryDocument } from 'src/schemas/category.schema';
import { Entry, EntryDocument } from 'src/schemas/entry.schema';
import { UserDocument } from 'src/schemas/user.schema';
export declare class EntryService {
    private entryModel;
    private categModel;
    constructor(entryModel: Model<EntryDocument>, categModel: Model<CategoryDocument>);
    getEntries(user: UserDocument, categoryId?: string): Promise<EntryDocument[]>;
    getEntry(ownerId: string, id: string): Promise<EntryDocument>;
    createEntry(body: Partial<EntryDocument>, ownerId: string, categoryId: string): Promise<EntryDocument>;
    editEntry(ownerId: string, id: string, entryObj: Partial<EntryDocument>): Promise<import("mongoose").Document<any, any, any> & Entry & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    deleteEntry(ownerId: string, id: string): Promise<void>;
}
