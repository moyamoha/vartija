import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { EntryService } from 'src/services/entry.service';
import { CustomReq } from 'src/types/custom';
import {
  CategoryIdInQuery,
  ChangeCategoryPayload,
  CreateEntryPayload,
  EditEntryPayload,
} from 'src/utils/dtos/entry';
import { IdInParams } from 'src/utils/dtos/mongo';

@UseGuards(AuthTokenGaurd)
@Controller('entries')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get('')
  async getEntries(
    @Req() req: CustomReq,
    @Query('category') category,
    @Query('status') status,
    @Query('search') search,
  ) {
    const q = { category, status, search };
    return await this.entryService.getEntries(req.user, q);
  }

  @Get(':id')
  async getEntry(@Req() req: CustomReq, @Param() params: IdInParams) {
    return await this.entryService.getEntry(req.user._id, params.id);
  }

  @Put(':id')
  async editEntry(
    @Req() req: CustomReq,
    @Param() params: IdInParams,
    @Body() payload: EditEntryPayload,
  ) {
    return await this.entryService.editEntry(req.user._id, params.id, payload);
  }

  @Post('')
  async addEntry(
    @Body() body: CreateEntryPayload,
    @Req() req: CustomReq,
    @Query() query: CategoryIdInQuery,
  ) {
    return await this.entryService.createEntry(
      body,
      req.user._id,
      query.categoryId,
    );
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteEntry(@Req() req: CustomReq, @Param() params: IdInParams) {
    return await this.entryService.deleteEntry(req.user._id, params.id);
  }

  @HttpCode(200)
  @Patch(':id/change-category')
  async changeEntryCategory(
    @Param() params: IdInParams,
    @Body() body: ChangeCategoryPayload,
  ) {
    await this.entryService.changeEntryCategory(params.id, body);
  }
}
