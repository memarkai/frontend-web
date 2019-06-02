import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { TopbarComponent } from './topbar/topbar.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoginComponent } from './login/login.component';
import { AppointmentEntryService } from './services/appointment-entry.service';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    TopbarComponent,
    HomeComponent,
    CalendarComponent,
    ChatComponent,
    PreferencesComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
  ],
  providers: [
    AppointmentEntryService,
    AuthService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
