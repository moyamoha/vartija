import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from 'src/schemas/category.schema';
import { Entry, EntryDocument } from 'src/schemas/entry.schema';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class EntryService {
  constructor(
    @InjectModel(Entry.name) private entryModel: Model<EntryDocument>,
    @InjectModel(Category.name) private categModel: Model<CategoryDocument>,
  ) {}

  async getEntries(
    user: UserDocument,
    categoryId?: string,
  ): Promise<EntryDocument[]> {
    let entries = [];
    if (categoryId) {
      const category = await this.categModel.findById(categoryId);
      if (!category) {
        throw new NotFoundException(`Category ${categoryId} was not found`);
      }

      entries = await this.entryModel.find({
        owner: user._id,
        category: categoryId,
      });
    } else {
      entries = await this.entryModel.find({
        owner: user._id,
      });
      // .populate('category', { name: 1 });
    }
    return entries;
  }

  async getEntry(ownerId: string, id: string): Promise<EntryDocument> {
    const foundEntry = await this.entryModel.findOne({
      owner: ownerId,
      _id: id,
    });
    // .populate('category', { name: 1 });
    if (!foundEntry) {
      throw new NotFoundException(`Entry ${id} was not found`);
    }
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
    if (!category)
      throw new NotFoundException(
        `Category ${categoryId} to which you want to attach new entry, was not found`,
      );

    try {
      const entry = new this.entryModel({
        ...body,
        owner: ownerId,
        category: categoryId,
      });
      category.items.push(entry._id);
      await category.save();
      return await entry.save();
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async editEntry(
    ownerId: string,
    id: string,
    entryObj: Partial<EntryDocument>,
  ) {
    if (entryObj.category) {
      // Check if the category id is correct and exists
      const categ = await this.categModel.findOne({
        _id: entryObj.category,
        owner: ownerId,
      });
      if (!categ) {
        throw new NotFoundException(
          `Category ${entryObj.category} to which you want to attach new entry, was not found`,
        );
      }
    }
    try {
      const updated = await this.entryModel.findOneAndUpdate(
        {
          _id: id,
          owner: ownerId,
        },
        entryObj,
        { returnDocument: 'after', runValidators: true },
      );
      // await updated.validate();
      return updated;
    } catch (e) {
      throw new BadRequestException(e, e.message);
    }
  }

  async deleteEntry(ownerId: string, id: string) {
    const deleted = await this.entryModel.findOneAndDelete({
      _id: id,
      owner: ownerId,
    });
    if (!deleted) {
      throw new NotFoundException(`Entry ${id} was not found`);
    }
    await this.categModel.findByIdAndUpdate(deleted.category, {
      $pull: { items: deleted._id },
    });
  }
}
