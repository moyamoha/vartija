import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EntryController } from 'src/controllers/entry.controller';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';
import { EntryService } from 'src/services/entry.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entry.name, schema: EntrySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [EntryController],
  providers: [EntryService],
})
export class EntryModule {}
