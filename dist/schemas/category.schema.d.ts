import mongoose, { Document } from 'mongoose';
export declare type CategoryDocument = Document & Category;
export declare class Category {
    name: string;
    owner: mongoose.Schema.Types.ObjectId;
    items: [mongoose.Schema.Types.ObjectId];
}
export declare const CategorySchema: mongoose.Schema<Category, mongoose.Model<Category, any, any, any, any>, {}, {}, any, {}, "type", Category>;
