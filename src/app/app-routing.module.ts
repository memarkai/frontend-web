import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { PreferencesComponent } from './preferences/preferences.component';

const routes: Routes = [
  {path: 'clinic', component: HomeComponent},
  {path: 'calendar', component: CalendarComponent},
  {path: 'chats', component: ChatComponent},
  {path: 'settings', component: PreferencesComponent},
  {path: '', redirectTo: '/clinic', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
