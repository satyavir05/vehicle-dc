import {
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('logs')
@Controller('logs')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getLogs(
    @Query('vehicle') vehicle?: string,
    @Query('code') code?: string,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.appService.filterLogs(vehicle, code, from, to);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async parseFile(@UploadedFile() file: any) {
    const content = file.buffer.toString('utf-8');
    return await this.appService.processFile(content);
  }

  @Get('all')
  async getAll() {
    return AppService.logs;
  }
}
