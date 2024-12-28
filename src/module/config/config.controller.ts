import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConfigService } from './config.service';
import { Config } from 'src/entities/Config';

@Controller('config')
export class ConfigController {
  constructor(readonly configService: ConfigService) {}

  @Post()
  public async created(@Body() data: Config): Promise<void> {
    await this.configService.created(data);
  }

  @Get()
  public async find(): Promise<Config> {
    return await this.configService.find();
  }
}
