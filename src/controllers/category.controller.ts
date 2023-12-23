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
} from '@nestjs/common';

import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { CategoryService } from 'src/services/category.service';
import { CustomReq } from 'src/types/custom';
import {
  CreateCategoryPayload,
  EditCategoryPayload,
} from 'src/utils/dtos/category';
import { IdInParams } from 'src/utils/dtos/mongo';

@UseGuards(AuthTokenGaurd)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @HttpCode(201)
  @Post('')
  async addCategory(
    @Req() req: CustomReq,
    @Body() body: CreateCategoryPayload,
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
  async getCategory(@Req() req: CustomReq, @Param() params: IdInParams) {
    return await this.categoryService.getCategory(params.id, req.user._id);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteCategory(@Req() req: CustomReq, @Param() params: IdInParams) {
    await this.categoryService.deleteCategory(params.id, req.user._id);
  }

  @Put(':id')
  async editCategory(
    @Req() req: CustomReq,
    @Param() params: IdInParams,
    @Body() payload: EditCategoryPayload,
  ) {
    return await this.categoryService.editCategory(params.id, req.user._id, {
      name: payload.newName,
    });
  }
}
