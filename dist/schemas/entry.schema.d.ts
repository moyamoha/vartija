import mongoose, { Document } from 'mongoose';
export declare type EntryDocument = Document & Entry;
export declare class Entry {
    title: string;
    username: string;
    password: string;
    url: string;
    category: mongoose.Schema.Types.ObjectId;
    owner: mongoose.Schema.Types.ObjectId;
}
export declare const EntrySchema: mongoose.Schema<Entry, mongoose.Model<Entry, any, any, any, any>, {}, {}, any, {}, "type", Entry>;
