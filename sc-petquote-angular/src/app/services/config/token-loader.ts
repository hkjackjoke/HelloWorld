import { ConfigService } from './config.service';

export function getToken(config: ConfigService) {
    return config.captchaToken;
}
