import { Component, OnInit } from '@angular/core';

import { ClinicApiService } from './../services/clinic-api.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {
  doctors = [];
  events = [];
  selectedDoctor: any;
  selectedDate: Date;
  startDate: Date;
  calendarInvisible = true;
  scheduleInvisible = true;
  error: any;

  constructor(private api: ClinicApiService) {}

  ngOnInit() {
    this.getMyDoctors();
    this.selectedDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(1);
  }

  getMyDoctors() {
    this.api.getDoctors().subscribe(
      success => this.doctors = success as any,
      error => this.error = error
    )
  }

  setDoctor(doctor) {
    if (doctor == this.selectedDoctor) return;

    this.selectedDoctor = doctor;
    this.events = [];
    this.scheduleInvisible = true;
    this.calendarInvisible = false;
    this.api.getAppointments(doctor.id, this.startDate).subscribe(
      success => {
        this.events = success as any[];
      },
      error => this.error = error
    )
  }
}
