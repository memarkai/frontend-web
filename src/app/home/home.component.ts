import { AppointmentEntryService } from './../services/appointment-entry.service';
import { Component, OnInit } from '@angular/core';

import { AppointmentEntry } from '../models/appoinment-entry';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  entries: AppointmentEntry[];
  error: any;

  constructor(private service: AppointmentEntryService) { }

  ngOnInit() {
    this.getEntriesList();
  }

  getEntriesList() {
    this.entries = this.service.getEntriesList();
    // this.service.getEntriesList().subscribe(
    //   success => this.entries = success,
    //   error => this.error = error
    // );
  }

  onRefuseClick(entry: AppointmentEntry) {
    this.service.refuseAppointment(entry).subscribe(
      success => this.removeFromList(entry),
      error => this.error = error
    );
  }

  onAcceptClick(entry: AppointmentEntry) {
    this.service.confirmAppointment(entry).subscribe(
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
