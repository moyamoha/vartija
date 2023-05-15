import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Mfa } from 'src/types/custom';
import { DEFAULT_MFA_SETTINGS } from 'src/utils/constants';

export type UserDocument = Document & User;

@Schema()
export class User {
  @Prop({
    required: true,
    index: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) =>
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          v,
        ),
      message: 'The format of email provided is wrong',
    },
  })
  email: string;

  @Prop({ required: true, minlength: 3 })
  firstname: string;

  @Prop({ required: true, minlength: 3 })
  lastname: string;

  @Prop({ required: true, minLength: 10 })
  password: string;

  @Prop()
  lastLoggedIn: Date | null;

  @Prop({ default: false })
  emailConfirmed: boolean;

  @Prop({ default: false })
  isActive: boolean;

  @Prop({
    default: DEFAULT_MFA_SETTINGS,
    type: mongoose.Schema.Types.Mixed,
  })
  mfa: Mfa;
}

export const UserSchema = SchemaFactory.createForClass(User);
