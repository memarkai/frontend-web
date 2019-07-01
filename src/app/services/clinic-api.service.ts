import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AppointmentEntry } from './../models/appoinment-entry';
import { AuthService } from './auth.service';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClinicApiService {

  private apiRoot = environment.apiRoot;
  public error: any;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) { }

  getOpenConsultations() {
    const myId = this.auth.getMyId();
    return this.http.get(
      this.apiRoot.concat(`schedule/consultation/candidate/clinic/list/${myId}/`),
    );
  }

  confirmAppointment(entry: AppointmentEntry) {
    return this.http.post(
      this.apiRoot.concat(`schedule/consultation/candidate/accept/${entry.consultation}/`),
      {
        patient: entry.id
      }
    );
  }

  refuseAppointment(entry: AppointmentEntry) {
    return this.http.post(
      this.apiRoot.concat(`schedule/consultation/candidate/refuse/${entry.consultation}`),
      {
        patient: entry.id
      }
    );
  }

  getClinicInformation(){
    return this.http.get(
      this.apiRoot.concat('clinics/get/')
    );
  }

  getAllPlans(){
    return this.http.get(
      this.apiRoot.concat('insurance/list/')
    );
  }

  getDoctors(){
    return this.http.get(
      this.apiRoot.concat('clinics/doctor/list/')
    );
  }

  createSpaceConsult(space){
    return this.http.post(
      this.apiRoot.concat('schedule/consultation/create/'), space
    );
  }

  getSpeciality(id){
    return this.http.get(
      this.apiRoot.concat('specialty/get/' + id)
    );
  }

  getAppointments (doctor: string, date: any) {
    const startDate = date.toLocaleDateString('pt-BR');
    date.setDate(date.getDate() + 6);
    const endDate = date.toLocaleDateString('pt-BR');

    return this.http.get(
      this.apiRoot.concat(`schedule/consultation/doctor/list/${doctor}/?startDate=${startDate}&endDate=${endDate}`)
    );
  }
}
