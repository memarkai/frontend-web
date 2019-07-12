import { Component, OnInit } from '@angular/core';

import { ClinicApiService } from './../services/clinic-api.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {
  doctors = [];
  selectedDoctor: any;
  selectedDate: any;
  calendarInvisible = false;
  scheduleInvisible = true;
  error: any;

  constructor(private api: ClinicApiService) {}

  ngOnInit() {
    this.getMyDoctors();
    this.selectedDate = new Date();
  }

  getMyDoctors() {
    this.api.getDoctors().subscribe(
      success => this.doctors = success as any,
      error => this.error = error
    )
  }

}
