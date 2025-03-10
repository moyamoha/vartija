import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ObjectId } from 'mongodb';
import { Model, Types } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Entry, EntryDocument } from 'src/schemas/entry.schema';
import { UserDocument } from 'src/schemas/user.schema';
import {
  ChangeCategoryPayload,
  EditEntryPayload,
  EntrySearchQuery,
} from 'src/utils/dtos/entry';
import {
  getFilterForGettingEntries,
  throwNotFoundError,
} from 'src/utils/utility-functions';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
    @InjectModel(Category.name) private categModel: Model<CategoryDocument>,
  ) {}

  async getEntries(
    user: UserDocument,
    query: EntrySearchQuery,
  ): Promise<EntryDocument[]> {
    const filter = getFilterForGettingEntries(query);
    const entries = await this.entryModel
      .find({
        owner: user._id,
        ...filter,
      })
      .sort({ title: 1 });
    return entries;
  }

  async getEntry(ownerId: string, id: string): Promise<EntryDocument> {
    const foundEntry = await this.entryModel.findOne({
      owner: ownerId,
      _id: id,
    });
    // .populate('category', { name: 1 });
    if (!foundEntry) throwNotFoundError('Entry', id);
    return foundEntry;
  }

  async createEntry(
    body: Partial<EntryDocument>,
    ownerId: string,
    categoryId: string,
  ): Promise<EntryDocument> {
    const category = await this.categModel.findOne({
      owner: ownerId,
      _id: categoryId,
    });
    if (!category) {
      throwNotFoundError('Category', categoryId);
    }
    try {
      const entry = new this.entryModel({
        ...body,
        owner: ownerId,
        category: new ObjectId(categoryId),
      });
      category.items.push(entry._id);
      await category.save();
      const result = await entry.save();
      return result;
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async editEntry(ownerId: string, id: string, entryObj: EditEntryPayload) {
    if (entryObj.category) {
      // Check if the category id is correct and exists
      const categ = await this.categModel.findOne({
        _id: new ObjectId(entryObj.category),
        owner: ownerId,
      });
      if (!categ) {
        throwNotFoundError('Category', entryObj.category);
      }
    }
    try {
      const updated = await this.entryModel.findOneAndUpdate(
        {
          _id: id,
          owner: ownerId,
        },
        { ...entryObj },
        { returnDocument: 'after', runValidators: true },
      );
      // await updated.validate();
      return updated;
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async changeEntryCategory(id: string, body: ChangeCategoryPayload) {
    try {
      const oldCategory = await this.categModel.findById(body.oldCategoryId);
      const newCategory = await this.categModel.findById(body.newCategoryId);
      if (!oldCategory) throwNotFoundError('Category', body.oldCategoryId);
      if (!newCategory) throwNotFoundError('Category', body.newCategoryId);

      const entry = await this.entryModel.findById(id);
      if (!entry) throwNotFoundError('Entry', id);
      entry.category = new Types.ObjectId(body.newCategoryId);

      oldCategory.items = oldCategory.items.filter((c) => c.toString() !== id);
      newCategory.items.push(new Types.ObjectId(id));
      await entry.save();
      await oldCategory.save();
      await newCategory.save();
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteEntry(ownerId: string, id: string) {
    const deleted = await this.entryModel.findOneAndDelete({
      _id: id,
      owner: ownerId,
    });
    if (!deleted) {
      throwNotFoundError('Entry', id);
    }
    await this.categModel.findByIdAndUpdate(deleted.category, {
      $pull: { items: deleted._id },
    });
  }
}
