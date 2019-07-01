import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
import { colors } from './colors';
import { CalendarMonthViewDay } from 'angular-calendar';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewEncapsulation
} from '@angular/core';
import {
  CalendarEvent,
  CalendarEventTitleFormatter,
  CalendarView
} from 'angular-calendar';
import { DayViewHourSegment } from 'calendar-utils';
import { fromEvent } from 'rxjs';
import { finalize, takeUntil, reduce } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { registerLocaleData } from '@angular/common';
import { ClinicApiService } from '../services/clinic-api.service';
import * as $ from './../../../node_modules/jquery';

registerLocaleData(ptBr)

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}

export class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
  weekTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.weekTooltip(event, title);
    }
  }

  dayTooltip(event: CalendarEvent, title: string) {
    if (!event.meta.tmpEvent) {
      return super.dayTooltip(event, title);
    }
  }
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [
    {
      provide: CalendarEventTitleFormatter,
      useClass: CustomEventTitleFormatter
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent implements OnInit {
  viewDate: Date = new Date();
  dragToCreateActive = false;
  events: CalendarEvent[] = [];
  nomeMedico: string = "Marcos Castro";
  locale: string = 'pt';
  startDay: number = 0;
  doctors: any[];
  currentDoctor: Object = new Object();
  currentDoctorDTO: Object = new Object();
  error: any;
  @ViewChild('myModal') myModal:ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ClinicApiService,
  ) { }

  ngOnInit() {
    this.getMyDoctors();
    this.startDay = this.viewDate.getDay();
    this.setElementsByDefault();
    this.api.getClosedConsultations().subscribe(data =>
      {console.log(data)})
  }

  getMyDoctors() {
    this.api.getDoctors().subscribe(
      success => 
      {
        console.log(success)
        this.doctors = success as any
      },
      error => this.error = error
    )
  }

  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      day.badgeTotal = day.events.filter(
        event => event.meta.incrementsBadgeTotal
      ).length;
    });
  }

  setElementsByDefault(){
    
      let i = 1;
      let date: Date = new Date();
      date.setDate(date.getDate() + i);
      date.setHours(date.getHours() + i*30);
      var patientEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Consulta Marcada',
      start: date,
      meta: {
        tmpEvent: true
      },
      color: colors.red,
      actions: [
        {
          label: '<i class="fa fa-fw fa-times"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter(iEvent => iEvent !== event);
            console.log('Event deleted', event);
          }
        }
      ]
    } 
      let i1 = 0;
      let date1: Date = new Date();
      date.setDate(date1.getDate());
      date.setHours(date1.getMinutes() + 36);
    var patientEvent2: CalendarEvent = {
      id: this.events.length,
      title: 'Consulta Marcada',
      start:date1 ,
      meta: {
        tmpEvent: true
      },
      color: colors.red,
      actions: [
        {
          label: '<i class="fa fa-fw fa-times"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter(iEvent => iEvent !== event);
            console.log('Event deleted', event);
          }
        }
      ]
    }    
    const confirmationEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Pendente',
      start: new Date(2019, 5, 24, 13),
      meta: {
        tmpEvent: true
      }
    }

    this.events = [...this.events, patientEvent, patientEvent2,confirmationEvent];
  }

  getStartDate(segment: DayViewHourSegment){
    var space: Object = new Object();
    space['doctor'] = this.currentDoctor['id']; 
    var day = segment.date.getDate();
    var monthIndex = segment.date.getMonth();
    var year = segment.date.getFullYear();
    var minutes = segment.date.getMinutes();
    var hours = segment.date.getHours();
    var seconds = segment.date.getSeconds();
    var myFormattedDate = day+"/"+(monthIndex+1)+"/"+year+" "+ hours+":"+minutes+":"+seconds;
    return myFormattedDate;
  }

  getEndDate(segment: DayViewHourSegment){
    var space: Object = new Object();
    space['doctor'] = this.currentDoctor['id']; 
    var day = segment.date.getDate();
    var monthIndex = segment.date.getMonth();
    var year = segment.date.getFullYear();
    var minutes = segment.date.getMinutes();
    var hours = segment.date.getHours();
    var seconds = segment.date.getSeconds();
    var myFormattedDate = day+"/"+(monthIndex+1)+"/"+year+" "+ hours+":"+minutes+":"+seconds;
    return myFormattedDate;
  }

  startDragToCreate(
    segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {

    let space:Object = new Object();
    space['startDate'] = this.getStartDate(segment);
    console.log(space['startDate']);
    segment.date.setMinutes(segment.date.getMinutes() + 30);
    let endDate:String = this.getEndDate(segment);
    console.log(endDate)
    space["doctor"] = this.currentDoctor["id"];
    space['endDate'] = endDate;
    console.log(space);

    var retorno = this.api.createSpaceConsult(space).subscribe(data =>{
      return true;
    })

    if(retorno){
    segment.date.setMinutes(segment.date.getMinutes() - 30);
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Horário Livre',
      start: segment.date,
      meta: {
        tmpEvent: true
      },
      actions: [
        {
          label: '<i class="fa fa-fw fa-times"></i>',
          onClick: ({ event }: { event: CalendarEvent }): void => {
            this.events = this.events.filter(iEvent => iEvent !== event);
            console.log('Event deleted', event);
          }
        }
      ]
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate);

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refresh();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh();
      });
    }
  }

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

  setDoctor(doctor){
    this.currentDoctor = doctor;
  }
}
