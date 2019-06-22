import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';

import { AppointmentEntry } from './../models/appoinment-entry';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicApiService {

  private apiRoot = environment.apiRoot;

  constructor(private http: HttpClient) { }

  getOpenConsultations() {
    return this.http.get(
      this.apiRoot.concat('schedule/consultation/search/open/'),
    );
  }

  confirmAppointment(entry: AppointmentEntry) {
    return this.http.post(
      this.apiRoot.concat('schedule/consultation/candidate/accept/'),
      {
        patient: entry.id
      }
    )
  }

  refuseAppointment(entry: AppointmentEntry) {
    return this.http.post(
      this.apiRoot.concat('schedule/consultation/candidate/refuse/'),
      {
        patient: entry.id
      }
    )
  }
}
