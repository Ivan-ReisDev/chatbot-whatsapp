import { Injectable } from '@nestjs/common';
import { RepositoryConfigService } from '../repository/repository.config.service';
import { Config } from 'src/entities/Config';

@Injectable()
export class ConfigService {
  constructor(
    private readonly repositoryConfigService: RepositoryConfigService,
  ) {}

  public async find(): Promise<Config> {
    const config = await this.repositoryConfigService.findUniqui();
    return new Config(config);
  }

  public async created(data: Config): Promise<void> {
    await this.repositoryConfigService.created(data);
  }
}
