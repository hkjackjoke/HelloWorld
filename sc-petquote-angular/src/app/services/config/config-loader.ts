import { ConfigService } from './config.service';

export function loadConfigs(configService: ConfigService) {
  return () => configService.load();
}
