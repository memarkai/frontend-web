import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS, HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

import * as moment from 'moment';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    constructor(private http: HttpClient){}

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
                case url.endsWith('clinics/get/') && method == 'GET':
                    return getClinics();
                case url.endsWith('insurance/list/') && method == 'GET':
                    return getPlans();
                default:
                    // pass through any requests not handled above
                    const secureReq = request.clone({
                        url: request.url.replace('http://', 'https://')
                    });
                    return next.handle(request);
            }
        }

        // route functions
        function fakeLogin() {
            return ok('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNGFkZTJjY2UtMTMyYi00YTQ0LThlNDItOTUxMTJjMTU5ZGRmIn0.phcLfQqEMrIMlvNwTwPMelmcg77esPM7cXYrb5KbeEQ');
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
                    "name": "Bradesco Saude"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Unimed Recife"
                },
                {
                    "id": "ec1b9708-3ab1-4cf6-8baf-574667c40286",
                    "name": "Amil Dental"
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
