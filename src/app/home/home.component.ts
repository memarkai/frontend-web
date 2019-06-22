import { Component, OnInit } from '@angular/core';

import { AppointmentEntry } from '../models/appoinment-entry';
import { ClinicApiService } from './../services/clinic-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  entries: AppointmentEntry[];
  error: any;

  constructor(private api: ClinicApiService) { }

  ngOnInit() {
    this.getEntriesList();
  }

  getEntriesList() {
    this.api.getOpenConsultations().subscribe(
      success => { this.entries = success as AppointmentEntry[] },
      error => this.error = error
    );
  }

  onRefuseClick(entry: AppointmentEntry) {
    this.api.refuseAppointment(entry).subscribe(
      success => this.removeFromList(entry),
      error => this.error = error
    );
  }

  onAcceptClick(entry: AppointmentEntry) {
    this.api.confirmAppointment(entry).subscribe(
      success => this.removeFromList(entry),
      error => this.error = error
    );
  }

  removeFromList(entry: AppointmentEntry) {
    this.entries = this.entries.filter((value, idx, arr) => {
      return value !== entry;
    });
  }
}
