import { AppointmentEntry } from './../models/appoinment-entry';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppointmentEntryService {
  baseURL = 'http://ec2-3-16-1-205.us-east-2.compute.amazonaws.com/api/';

  constructor(private http: HttpClient) { }

  getEntriesList() {
    const objList: AppointmentEntry[] = [{
      expireTime: 10,
      patientName: 'Regino',
      patientAge: 28,
      specialty: 'Odontologia',
      paymentMethod: 'Amil Dental',
      date: 'Segunda, 01/06 às 14:00'
    },
    {
      expireTime: 23,
      patientName: 'Ana Clara',
      patientAge: 32,
      specialty: 'Odontologia',
      paymentMethod: 'Amil Dental',
      date: 'Terça, 02/06 às 10:00'
    }];

    return objList;
  }

  confirmAppointment(entry: AppointmentEntry) {
    return true;
  }

  refuseAppointment(entry: AppointmentEntry) {
    return true;
  }

  private getHeader(){
    let headers = new HttpHeaders();
    const token = localStorage.getItem('token');
    headers = headers.set('Bearer ', token);
    return headers
  }

  login(){
    var dataLogin:Object = new Object();
    dataLogin["email"] = "sudo-user@markai.com";
    dataLogin["password"] = "YQBMXYBT";

    return this.http.post(this.baseURL + 'login/', dataLogin, {responseType: "text"});
  }

  criaMedico(doctor){
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem("token") });
    
    return this.http.post(this.baseURL 
      + "clinics/doctor/create/", 
      doctor, {headers: headers} )
  }
}
