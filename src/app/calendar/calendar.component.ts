import { Component, OnInit } from '@angular/core';
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
import { finalize, takeUntil } from 'rxjs/operators';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { registerLocaleData } from '@angular/common';

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

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.startDay = this.viewDate.getDay();
    this.setElementsByDefault();
  }


  beforeMonthViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    body.forEach(day => {
      day.badgeTotal = day.events.filter(
        event => event.meta.incrementsBadgeTotal
      ).length;
    });
  }

  setElementsByDefault(){
    const patientEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Rodrigo César',
      start: new Date(),
      meta: {
        tmpEvent: true
      }
    }

    const confirmationEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Pendente',
      start: new Date(2019, 5, 24, 13),
      meta: {
        tmpEvent: true
      }
    }

    this.events = [...this.events, patientEvent, confirmationEvent];
  }

  startDragToCreate(
    segment: DayViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Horário Livre',
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

  private refresh() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }

}
