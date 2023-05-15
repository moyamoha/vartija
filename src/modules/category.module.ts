import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryController } from 'src/controllers/category.controller';
import { Category, CategorySchema } from 'src/schemas/category.schema';
import { Entry, EntrySchema } from 'src/schemas/entry.schema';
import { CategoryService } from 'src/services/category.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.name, schema: CategorySchema },
      { name: Entry.name, schema: EntrySchema },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
