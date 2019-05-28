import { Component, OnInit } from '@angular/core';

import { AppointmentEntry } from '../models/appoinment-entry';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  entries: AppointmentEntry[] = [
    {
      expireTime: 10,
      patientName: 'Regino',
      patientAge: 23,
      specialty: 'Odontologia',
      paymentMethod: 'Plano Amil Dental',
      date: 'Segunda, 27/05 às 14:00',
    },
    {
      expireTime: 32,
      patientName: 'Ana Maria',
      patientAge: 36,
      specialty: 'Odontologia',
      paymentMethod: 'Plano Amil Dental',
      date: 'Terça, 28/05 às 10:00',
    },
  ];

  constructor() { }

  ngOnInit() {
  }

  onRefuseClick(entry: AppointmentEntry) {
    console.log('Recusar:');
    console.dir(entry);
  }

  onAcceptClick(entry: AppointmentEntry) {
    console.log('Marcar:');
    console.dir(entry);
  }
}
