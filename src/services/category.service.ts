import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Entry, EntryDocument } from 'src/schemas/entry.schema';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>,
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
  ) {}

  async getAll(ownerId: string): Promise<CategoryDocument[]> {
    return await this.categoryModel
      .find({
        owner: ownerId,
      })
      .sort({ name: 1 })
      .collation({ locale: 'en' })
      .populate('items');
  }

  async createCategory(
    data: Partial<CategoryDocument>,
    ownerId: string,
  ): Promise<CategoryDocument> {
    try {
      const category = new this.categoryModel({
        ...data,
        owner: ownerId,
      });
      const result = await category.save();
      return result;
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async getCategory(id: string, ownerId: string): Promise<CategoryDocument> {
    const category = await this.categoryModel
      .findOne({
        owner: ownerId,
        _id: id,
      })
      .populate('items');
    if (!category) {
      throw new NotFoundException(`Category ${id} was not found`);
    }
    return category;
  }

  async deleteCategory(id: string, ownerId: string): Promise<void> {
    const categoryBeforeDeletion = await this.categoryModel.findOneAndDelete({
      _id: id,
      ownerId: ownerId,
    });
    if (!categoryBeforeDeletion) {
      throw new NotFoundException(`Category ${id} was not found`);
    }
    await this.entryModel.deleteMany({
      category: categoryBeforeDeletion._id,
      owner: ownerId,
    });
  }

  async editCategory(
    id: string,
    ownerId: string,
    categ: Partial<CategoryDocument>,
  ): Promise<CategoryDocument> {
    const updated = await this.categoryModel
      .findOneAndUpdate(
        {
          _id: id,
          owner: ownerId,
        },
        categ,
        {
          returnDocument: 'after',
          runValidators: true,
        },
      )
      .populate('items');
    if (!updated) {
      throw new NotFoundException(`Category ${id} was not found`);
    }
    return updated;
  }
}
