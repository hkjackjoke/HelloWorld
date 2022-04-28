import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreEffects } from './core/effects/core.effects';
import { coreReducer } from './core/reducers/core.reducer';
import { SharedModule } from './shared/shared.module';
import { ErrorHandler } from '@angular/core';
import { InsightsErrorHandlerService } from './core/services/error.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    SharedModule,
    HttpClientModule,

    StoreModule.forRoot({ core: coreReducer }),
    EffectsModule.forRoot([CoreEffects]),
  ],
  providers: [{ provide: ErrorHandler, useClass: InsightsErrorHandlerService }],
  bootstrap: [AppComponent]
})
export class AppModule { }
