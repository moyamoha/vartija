import { CategoryDocument } from 'src/schemas/category.schema';
import { CategoryService } from 'src/services/category.service';
import { CustomReq } from 'src/types/custom';
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    addCategory(req: CustomReq, body: Partial<CategoryDocument>): Promise<CategoryDocument>;
    getCategories(req: CustomReq): Promise<CategoryDocument[]>;
    getCategory(req: CustomReq, id: any): Promise<CategoryDocument>;
    deleteCategory(req: CustomReq, categId: any): Promise<void>;
    editCategory(req: CustomReq, id: any, newName: any): Promise<CategoryDocument>;
}
