import { Model } from 'mongoose';
import { CategoryDocument } from 'src/schemas/category.schema';
import { EntryDocument } from 'src/schemas/entry.schema';
export declare class CategoryService {
    private categoryModel;
    private entryModel;
    constructor(categoryModel: Model<CategoryDocument>, entryModel: Model<EntryDocument>);
    getAll(ownerId: string): Promise<CategoryDocument[]>;
    createCategory(data: Partial<CategoryDocument>, ownerId: string): Promise<CategoryDocument>;
    getCategory(id: string, ownerId: string): Promise<CategoryDocument>;
    deleteCategory(id: string, ownerId: string): Promise<void>;
    editCategory(id: string, ownerId: string, categ: Partial<CategoryDocument>): Promise<CategoryDocument>;
}
