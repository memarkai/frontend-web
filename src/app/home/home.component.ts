import { Component, OnInit } from '@angular/core';

import { AppointmentEntry } from '../models/appoinment-entry';
import { ClinicApiService } from './../services/clinic-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  entries: AppointmentEntry[] = [];
  error: any;

  constructor(private api: ClinicApiService) { }

  ngOnInit() {
    this.getEntriesList();
  }

  getEntriesList() {
    this.api.getOpenConsultations().subscribe(
      success => { debugger; 
        success.map(item => {let i = 1;
          let test:AppointmentEntry= new AppointmentEntry();
          test = item;
          test.specialty = "Odontologista";
          let testDate: Date = new Date();
          testDate.setDate(testDate.getDate() + i++);
          testDate.setHours(testDate.getHours() + 2);
          test.start_date = testDate.toLocaleDateString() + " " + testDate.toLocaleTimeString();
          this.entries.push(test);
        })
       },
      error => this.error = error
    );
  }

  onRefuseClick(entry: AppointmentEntry) {
    this.api.refuseAppointment(entry).subscribe(
      success => this.getEntriesList(),
      error => this.error = error
    );
  }

  onAcceptClick(entry: AppointmentEntry) {
    this.api.confirmAppointment(entry).subscribe(
      success => this.getEntriesList(),
      error => this.error = error
    );
  }

  removeFromList(entry: AppointmentEntry) {
    this.entries = this.entries.filter((value, idx, arr) => {
      return value !== entry;
    });
  }
}
