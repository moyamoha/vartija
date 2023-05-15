import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor';
import { CategoryDocument } from 'src/schemas/category.schema';
import { CategoryService } from 'src/services/category.service';
import { CustomReq } from 'src/types/custom';

@UseInterceptors(ErrorsInterceptor)
@UseGuards(AuthTokenGaurd)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @HttpCode(201)
  @Post('')
  async addCategory(
    @Req() req: CustomReq,
    @Body() body: Partial<CategoryDocument>,
  ) {
    return await this.categoryService.createCategory(body, req.user._id);
  }

  @Get('')
  async getCategories(@Req() req: CustomReq) {
    try {
      return await this.categoryService.getAll(req.user._id);
    } catch (e) {
      throw new NotFoundException('Nothing was found');
    }
  }

  @Get(':id')
  async getCategory(@Req() req: CustomReq, @Param('id') id) {
    return await this.categoryService.getCategory(id, req.user._id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteCategory(@Req() req: CustomReq, @Param('id') categId) {
    await this.categoryService.deleteCategory(categId, req.user._id);
  }

  @Put(':id')
  async editCategory(
    @Req() req: CustomReq,
    @Param('id') id,
    @Body('name') newName,
  ) {
    return await this.categoryService.editCategory(id, req.user._id, {
      name: newName,
    });
  }
}
