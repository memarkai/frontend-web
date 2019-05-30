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

  constructor(private service: AppointmentEntryService) { }

  ngOnInit() {
    this.getEntriesList();
  }

  getEntriesList() {
    this.entries = this.service.getEntriesList();
  }

  onRefuseClick(entry: AppointmentEntry) {
    if (this.service.refuseAppointment(entry)) {
      this.removeFromList(entry);
    } else {
      alert('Hi i\'m an Error. Take care of me.');
    }
  }

  onAcceptClick(entry: AppointmentEntry) {
    if (this.service.confirmAppointment(entry)) {
      this.removeFromList(entry);
    } else {
      alert('Hi i\'m an Error. Take care of me.');
    }
  }

  removeFromList(entry: AppointmentEntry) {
    this.entries = this.entries.filter((value, idx, arr) => {
      return value !== entry;
    });
  }
}
