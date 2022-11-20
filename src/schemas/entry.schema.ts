import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
// import { User } from './user.schema';

export type EntryDocument = Document & Entry;

@Schema()
export class Entry {
  @Prop({ required: true, minlength: 3 })
  title: string;

  @Prop({ required: true, minlength: 3 })
  username: string;

  @Prop({ required: true, minlength: 5 })
  password: string;

  @Prop({
    validate: {
      validator: (v) =>
        /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/gm.test(
          v,
        ) || v === '',
      message: 'The format of provided url is not correct',
    },
  })
  url: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: mongoose.Schema.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: mongoose.Schema.Types.ObjectId;
}

export const EntrySchema = SchemaFactory.createForClass(Entry);
