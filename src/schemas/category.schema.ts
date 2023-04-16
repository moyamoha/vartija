import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export type CategoryDocument = Document & Category;

@Schema()
export class Category {
  @Prop({ required: true, minlength: 3 })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Entry' })
  items: mongoose.Schema.Types.ObjectId[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
