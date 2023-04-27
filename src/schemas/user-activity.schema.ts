import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { POSSIBLE_ACTIVITY_TYPES } from 'src/utils/constants';

export type UserActivityDocument = Document & UserActivity;

@Schema()
export class UserActivity {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId;

  @Prop({
    required: true,
    enum: POSSIBLE_ACTIVITY_TYPES,
  })
  activityType: string;

  @Prop({ required: false, default: new Date(), type: Date })
  timestamp: Date | string;
}

export const UserActivitySchema = SchemaFactory.createForClass(UserActivity);
