import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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
  EntrySearchQuery,
} from 'src/utils/dtos/entry';
import { IdInParams } from 'src/utils/dtos/mongo';

@UseGuards(AuthTokenGaurd)
@Controller('entries')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get('')
  async getEntries(@Req() req: CustomReq, @Query() q: EntrySearchQuery) {
    return await this.entryService.getEntries(req.user, q);
  }

  @Get(':id')
  async getEntry(@Req() req: CustomReq, @Param() params: IdInParams) {
    return await this.entryService.getEntry(req.user._id, params.id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async editEntry(
    @Req() req: CustomReq,
    @Param() params: IdInParams,
    @Body() payload: EditEntryPayload,
  ) {
    return await this.entryService.editEntry(req.user._id, params.id, payload);
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteEntry(@Req() req: CustomReq, @Param() params: IdInParams) {
    return await this.entryService.deleteEntry(req.user._id, params.id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id/change-category')
  async changeEntryCategory(
    @Param() params: IdInParams,
    @Body() body: ChangeCategoryPayload,
  ) {
    await this.entryService.changeEntryCategory(params.id, body);
  }
}
