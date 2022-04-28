import { HttpClient } from '@angular/common/http';
import { Config } from './config.model';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: Config;

  constructor(private http: HttpClient) {}

  public load() {
    this.http
      .get<Config>('./quote/api/config')
      .pipe(tap((res) => (this.config = res)))
      .toPromise();
  }

  public get captchaToken(): string {
    return this.config.captchaToken;
  }
}
