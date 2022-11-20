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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
import { EntryDocument } from 'src/schemas/entry.schema';
import { EntryService } from 'src/services/entry.service';
import { CustomReq } from 'src/types/custom';
export declare class EntryController {
    private entryService;
    constructor(entryService: EntryService);
    getEntries(req: CustomReq, categId: any): Promise<EntryDocument[]>;
    getEntry(req: CustomReq, id: any): Promise<EntryDocument>;
    editEntry(req: CustomReq, id: any, entryObj: Partial<EntryDocument>): Promise<import("mongoose").Document<any, any, any> & import("src/schemas/entry.schema").Entry & {
        _id: import("mongoose").Types.ObjectId;
    }>;
    addEntry(body: any, req: CustomReq, categoryId: any): Promise<EntryDocument>;
    deleteEntry(req: CustomReq, id: any): Promise<void>;
}
