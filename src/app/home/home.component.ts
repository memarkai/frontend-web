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
  ];

  constructor() { }

  ngOnInit() {
  }

}
