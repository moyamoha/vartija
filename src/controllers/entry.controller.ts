import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthTokenGaurd } from 'src/config/auth-token.gaurd';
import { ErrorsInterceptor } from 'src/interceptors/error.interceptor';
import { EntryDocument } from 'src/schemas/entry.schema';
import { EntryService } from 'src/services/entry.service';
import { CustomReq } from 'src/types/custom';

@UseInterceptors(ErrorsInterceptor)
@UseGuards(AuthTokenGaurd)
@Controller('entries')
export class EntryController {
  constructor(private entryService: EntryService) {}

  @Get('')
  async getEntries(@Req() req: CustomReq, @Query('categoryId') categId) {
    if (categId) return await this.entryService.getEntries(req.user, categId);
    else return await this.entryService.getEntries(req.user);
  }

  @Get(':id')
  async getEntry(@Req() req: CustomReq, @Param('id') id) {
    return await this.entryService.getEntry(req.user._id, id);
  }

  @Put(':id')
  async editEntry(
    @Req() req: CustomReq,
    @Param('id') id,
    @Body() entryObj: Partial<EntryDocument>,
  ) {
    return await this.entryService.editEntry(req.user._id, id, entryObj);
  }

  @Post('')
  async addEntry(
    @Body() body,
    @Req() req: CustomReq,
    @Query('categoryId') categoryId,
  ) {
    return await this.entryService.createEntry(body, req.user._id, categoryId);
  }

  @HttpCode(204)
  @Delete(':id')
  async deleteEntry(@Req() req: CustomReq, @Param('id') id) {
    return await this.entryService.deleteEntry(req.user._id, id);
  }
}
