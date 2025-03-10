import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Entry, EntryDocument } from 'src/schemas/entry.schema';
import { CreateCategoryPayload } from 'src/utils/dtos/category';
import { throwNotFoundError } from 'src/utils/utility-functions';

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
    data: CreateCategoryPayload,
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
      throwNotFoundError('Category', id);
    }
    return category;
  }

  async deleteCategory(id: string, ownerId: string): Promise<void> {
    const categoryBeforeDeletion = await this.categoryModel.findOneAndDelete({
      owner: ownerId,
      _id: id,
    });
    if (!categoryBeforeDeletion) {
      throwNotFoundError('Category', id);
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
      throwNotFoundError('Category', id);
    }
    return updated;
  }
}
