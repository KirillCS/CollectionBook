import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { ACCESS_TOKEN_KEY } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: () => localStorage.getItem(ACCESS_TOKEN_KEY),
        allowedDomains: environment.allowedDomains
      }
    })
  ],
  providers: [
    {
      provide: API_URL,
      useValue: environment.apiUrl
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
