import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { CategoryService } from 'src/services/category.service';
import { UserController } from '../controllers/user.controller';
import { TaskService } from 'src/services/task.service';
import { UserService } from '../services/user.service';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Entry.name, schema: EntrySchema },
    ]),
    MailerModule.forRoot({
      transport: {
        host: process.env.SENDGRID_SERVER,
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_API_KEY,
        },
      },
    }),
    ScheduleModule.forRoot(),
    CacheModule.register(),
  ],
  controllers: [UserController],
  providers: [UserService, TaskService, UserService, CategoryService],
})
export class UserModule {}
