import { Component, OnInit } from '@angular/core';

import { ClinicApiService } from './../services/clinic-api.service';

@Component({
  selector: 'app-schedule-detail',
  templateUrl: './schedule-detail.component.html',
  styleUrls: ['./schedule-detail.component.css']
})
export class ScheduleDetailComponent implements OnInit {
  error: any;
  doctors = [];
  events = [];
  selectedDoctor: any;
  selectedDate: Date;
  calendarInvisible = true;
  scheduleInvisible = true;
  // Calendar attributes
  startDate: Date;
  monthString: string;
  yearString: number;
  month: any[];
  selectedItem: any;

  constructor(private api: ClinicApiService) {}

  ngOnInit() {
    this.getMyDoctors();
    this.selectedDate = new Date();
    this.startDate = new Date();
    this.startDate.setDate(1);
    this.setupCalendar();
  }

  getMyDoctors() {
    this.api.getDoctors().subscribe(
      success => this.doctors = success as any,
      error => this.error = error
    )
  }

  getAppointments() {
    this.resetEvents();
    this.api.getAppointments(this.selectedDoctor.id, this.selectedDate).subscribe(
      success => {
        const data = success as any[];
        data.forEach((e) => {
          const date = new Date(e.startDate);
          this.events[this.timeToIndex(date)].available = true;
          this.events[this.timeToIndex(date)].id = e.consultation;
        });
      },
      error => this.error = error
    )
    this.scheduleInvisible = false;
  }
  
  removeConsultationSpace(item) {
    this.api.deleteSpaceConsult(item.id).subscribe(
      success => this.getAppointments(),
      error => this.error = error
    )
  }

  addConsultationSpace(item) {
    const temp = item.time.split(':');
    let startDate = new Date(this.selectedDate.toISOString());
    startDate.setHours(temp[0]);
    startDate.setMinutes(temp[1]);
    startDate.setSeconds(0);
    let endDate = new Date(startDate.toISOString());
    endDate.setMinutes(startDate.getMinutes() + 29);

    this.api.createSpaceConsult({
      doctor: this.selectedDoctor.id,
      startDate: startDate.toLocaleString('pt-BR'),
      endDate: endDate.toLocaleString('pt-BR')
    }).subscribe(
      success => this.getAppointments(),
      error => this.error = error
    )
  }

  resetEvents() {
    for (let i=0; i < 48; i++) {
      this.events[i] = {
        time: this.indexToTime(i),
        available: false,
        candidate: false,
      }
    }
  }

  timeToIndex(date) {
    let idx = date.getHours() * 2;
    if (date.getMinutes() > 0) idx += 1;
    return idx;
  }

  indexToTime(idx) {
    let hour = Math.floor(idx/2).toString().padStart(2, '0');
    let minutes = idx%2? "30":"00";
    return `${hour}:${minutes}`;
  }

  setDoctor(doctor) {
    if (doctor == this.selectedDoctor) return;

    this.selectedDoctor = doctor;
    this.scheduleInvisible = true;
    this.calendarInvisible = false;
  }

  selectItem(item) {
    if (item.enabled) {
      this.selectedDate = item.date;
      this.getAppointments();
    }
  }

  // Calendar methods
  previousMonth() {
    this.startDate.setMonth(this.startDate.getMonth() - 1);
    this.setupCalendar();
  }

  nextMonth() {
    this.startDate.setMonth(this.startDate.getMonth() + 1);
    this.setupCalendar();
  }

  setupCalendar() {
    this.monthString = this.getMonthString();
    this.yearString = this.startDate.getFullYear();
    this.month = []

    let date = new Date(this.startDate.toISOString());
    const force = Number(!this.startDate.getDay());
    date.setDate(1 - this.startDate.getDay() - (7 * force));

    let monthData = []
    let weekData = []
    for(var i=0; i < 42; i++) {
      weekData.push({
        date: new Date(date.toISOString()),
        enabled: date.getMonth() == this.startDate.getMonth(),
      });
      if (date.getDay() == 6) {
        monthData.push(weekData);
        weekData = [];
      }
      date.setDate(date.getDate() + 1);
    }

    this.month = monthData;
  }

  getMonthString() {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril',
      'Maio', 'Junho', 'Julho', 'Agosto',
      'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ]
    return months[this.startDate.getMonth()]
  }
}
