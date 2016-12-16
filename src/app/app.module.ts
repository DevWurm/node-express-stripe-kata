import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { StripeDojoRoutingModule } from './app-routing.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { PaymentModule } from './payment/payment.module';
import { LoggedInGuard } from './shared/logged-in.guard';
import { AuthService } from './shared/auth.service';
import { ApiService } from './shared/api.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    StripeDojoRoutingModule,
    RegisterModule,
    LoginModule,
    PaymentModule
  ],
  providers: [ApiService, AuthService,LoggedInGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
