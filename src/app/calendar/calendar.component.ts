import { Component, OnInit } from '@angular/core';
import ptBr from '@angular/common/locales/pt';
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
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { registerLocaleData } from '@angular/common';
import { ClinicApiService } from '../services/clinic-api.service';
import * as moment from 'moment';

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
  locale: string = 'pt';
  startDay: number = 0;
  doctors: any[];
  currentDoctor: Object = new Object();
  currentDoctorDTO: Object = new Object();
  error: any;

  constructor(
    private cdr: ChangeDetectorRef,
    private api: ClinicApiService,
  ) { }

  ngOnInit() {
    this.getMyDoctors();
    this.startDay = this.viewDate.getDay();
  }

  getMyDoctors() {
    this.api.getDoctors().subscribe(
      success => this.doctors = success as any,
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
    segment.date.setMinutes(segment.date.getMinutes() + 30);
    let endDate:String = this.getEndDate(segment);
    space["doctor"] = this.currentDoctor["id"];
    space['endDate'] = endDate;

    var retorno = this.api.createSpaceConsult(space).subscribe(
      data => { return true; }
    )

    if(retorno){
    segment.date.setMinutes(segment.date.getMinutes() - 30);
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Horário Aberto',
      start: segment.date,
      meta: {
        tmpEvent: true
      }
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
    this.api.getAppointments(doctor['id'], new Date()).subscribe(
      success => {
        const data = success as any[];
        let events = [];
        
        data.forEach((item) => {
          const eventEntry: CalendarEvent = {
            id: this.events.length,
            title: item.status == 'open' ? 'Consulta aberta' : 'Consulta agendada',
            start: moment(item['startDate']).toDate(),
            end: moment(item['endDate']).toDate(),
            meta: {
              tmpEvent: false,
            }
          }

          if (item.status == 'closed') {
            eventEntry.color = {
              primary: '#15572480',
              secondary: '#28a74580'
            };
          }

          events.push(eventEntry);
        })

        this.events = [...events];
      },
      error => this.error = error
    );
  }
}
