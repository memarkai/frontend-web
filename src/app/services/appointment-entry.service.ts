import { AppointmentEntry } from './../models/appoinment-entry';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppointmentEntryService {
  baseURL = '/api/clinic';

  constructor() { }

  getEntriesList() {
    const objList: AppointmentEntry[] = [{
      expireTime: 10,
      patientName: 'Regino',
      patientAge: 28,
      specialty: 'Odontologia',
      paymentMethod: 'Amil Dental',
      date: 'Segunda, 01/06 às 14:00'
    }];

    return objList;
  }

  confirmAppointment(entry: AppointmentEntry) {
    return true;
  }

  refuseAppointment(entry: AppointmentEntry) {
    return true;
  }
}
