import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import { JWTPayload } from './../models/jwt-payload';

import * as moment from 'moment';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';

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
                case url.endsWith('clinics/get/') && method == 'GET':
                    return getClinics();
                case url.endsWith('insurance/list/') && method == 'GET':
                    return getPlans();
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
            return ok(retrieveList('openEntries'));
        }

        function getClinics() {
            return ok(
                {
                    "id": "2561d1ba-f773-4349-b428-f98dbf43cae8",
                    "email": "clinic@test.com",
                    "phone": null,
                    "name": "Clinica Santa Cruz",
                    "address": "Av. Fantasia, 450, Cidade Universitária, Recife-PE",
                    "created_at": "2019-05-19T16:46:09.777414Z",
                    "is_staff": false,
                    "latitude": null,
                    "longitude": null,
                    "plans": []
                }
            )
        }

        function getPlans() {
            return ok([
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Bradesco"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Unimed Recife"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Amil"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "SulAmérica"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Hapvida"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Cassi"
                }
            ])
        }

        function confirmAppointment() {
            let entries = retrieveList('openEntries');
            let appointments = retrieveList('appointments');
            const entry = getFromCollection(entries, body.patient);

            entries = removeFromCollection(entries, 'date', entry.date);
            saveCollection('openEntries', entries);

            appointments.push(entry);
            saveCollection('appointments', appointments);

            return ok();
        }

        function refuseAppointment() {
            let entries = retrieveList('openEntries');
            const entry = getFromCollection(entries, body.patient);

            entries = removeFromCollection(entries, 'id', entry.id);
            saveCollection('openEntries', entries);

            return ok();
        }

        // localStorage access point
        function saveCollection(table: string, collection: any[]) {
            localStorage.setItem(table, JSON.stringify(collection));
        }

        function retrieveList(table: string) {
            return JSON.parse(localStorage.getItem(table)) || [];
        }

        // helper functions
        function getFromCollection(collection: any[], id: string) {
            for (let i = 0; i < collection.length; i++) {
                if (collection[i].id === id) {
                    return collection[i];
                }
            }
            return null;
        }

        function removeFromCollection(collection: any[], key: string, value: any) {
            return collection.filter((e, i, arr) => {
                return e[key] != value;
            });
        }

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function error(message) {
            return throwError({ error: { message } });
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

// init localStorage
localStorage.setItem('appointments', JSON.stringify([
    {
        id: 'd58fc3b0-e1fb-4843-a7d4-d250ab356de0',
        expireTime: 5,
        patientName: 'Lais',
        patientAge: 23,
        specialty: 'Odontologia',
        paymentMethod: 'Bradesco Saude',
        date: moment(new Date(2019, 7, 3, 11))
    },
]));
localStorage.setItem('openEntries', JSON.stringify([
    {
        id: 'd58fc3b0-e1fb-4843-a7d4-d250ab356de0',
        expireTime: 10,
        patientName: 'Regino',
        patientAge: 26,
        specialty: 'Odontologia',
        paymentMethod: 'Amil Dental',
        date: moment(new Date(2019, 7, 1, 10))
    },
    {
        id: 'f6ab0a07-017b-481c-ac68-5e4385e5d81b',
        expireTime: 15,
        patientName: 'Ana Carolina',
        patientAge: 19,
        specialty: 'Odontologia',
        paymentMethod: 'Hapvida',
        date: moment(new Date(2019, 7, 1, 10))
    },
    {
        id: '103a9f09-1b41-47b7-a43c-55f6a0ad731f',
        expireTime: 20,
        patientName: 'Gaspar',
        patientAge: 60,
        specialty: 'Odontologia',
        paymentMethod: 'Bradesco Saude',
        date: moment(new Date(2019, 7, 2, 11))
    },
    {
        id: 'ddbb2297-f507-4322-a48a-9b1d6a5aefaa',
        expireTime: 50,
        patientName: 'Jackson',
        patientAge: 44,
        specialty: 'Odontologia',
        paymentMethod: 'Mastercard Débito',
        date: moment(new Date(2019, 7, 2, 10))
    },
    {
        id: '51189d7b-020f-4511-9bf5-037f6f7fbd65',
        expireTime: 60,
        patientName: 'Yossi',
        patientAge: 33,
        specialty: 'Odontologia',
        paymentMethod: 'Bradesco Saude',
        date: moment(new Date(2019, 7, 3, 10))
    }
]));
