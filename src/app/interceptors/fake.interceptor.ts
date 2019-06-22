import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { JWTPayload } from './../models/jwt-payload';

import * as moment from 'moment';

// array in local storage for registered users
let users = JSON.parse(localStorage.getItem('users')) || [];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize())
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('login/') && method === 'POST':
                    return fakeLogin();
                case url.endsWith('schedule/consultation/search/open/') && method === 'GET':
                    return getOpenEntries();
                case url.endsWith('schedule/consultation/candidate/accept/') && method === 'POST':
                    return confirmAppointment();
                case url.endsWith('schedule/consultation/candidate/refuse/') && method === 'POST':
                    return refuseAppointment();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }
        }

        // route functions
        function fakeLogin() {
            return ok('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiY2U5NTc1MGItMmFhYS00ZGQ1LWFiYjAtZGQ1MmFhNTNiNmVjIiwiZXhwIjoxNTYzNzY1NDEyfQ.De_kEUHRswM5l0cpB1KJSnlK2YN433PdaaMfnIYlbzc');
        }

        function getOpenEntries() {
            return ok([
                {
                  id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
                  expireTime: 10,
                  patientName: 'Regino',
                  patientAge: 26,
                  specialty: 'Odontologia',
                  paymentMethod: 'Amil Dental',
                  date: moment(new Date(2019, 7, 1))
                },
                {
                  id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
                  expireTime: 20,
                  patientName: 'Jackson',
                  patientAge: 44,
                  specialty: 'Odontologia',
                  paymentMethod: 'Mastercard Débito',
                  date: moment(new Date(2019, 7, 2))
                },
                {
                  id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
                  expireTime: 30,
                  patientName: 'Yossi',
                  patientAge: 33,
                  specialty: 'Fisioterapia',
                  paymentMethod: 'Bradesco Saude',
                  date: moment(new Date(2019, 7, 3))
                }
            ])
        }

        function confirmAppointment() {
            return ok();
        }

        function refuseAppointment() {
            return ok();
        }

        // helper functions
        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer fake-jwt-token';
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1], 0);
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
