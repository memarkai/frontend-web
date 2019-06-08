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

  getEntriesList() {
    return [
      {
        id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
        expireTime: 10,
        patientName: 'Regino',
        patientAge: 26,
        specialty: 'Odontologia',
        paymentMethod: 'Amil Dental',
        date: moment(new Date(2019, 6, 12))
      },
      {
        id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
        expireTime: 10,
        patientName: 'Biroleide',
        patientAge: 44,
        specialty: 'Odontologia',
        paymentMethod: 'Mastercard Débito',
        date: moment(new Date(2019, 6, 13))
      }
    ];
    // return this.http.get(
    //   this.apiRoot.concat('schedule/consultation/...'),
    // );
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
