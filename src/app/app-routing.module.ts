import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { ChatComponent } from './chat/chat.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { ScheduleDetailComponent } from './schedule-detail/schedule-detail.component';

const routes: Routes = [
  {path: 'schedule', component: CalendarComponent, canActivate: [AuthGuard],
    children:[
      {
        path:  'detail',
        component:  ScheduleDetailComponent
      }
    ]
  },
  {path: 'chats', component: ChatComponent, canActivate: [AuthGuard]},
  {path: 'settings', component: PreferencesComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: '', component: HomeComponent, canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
