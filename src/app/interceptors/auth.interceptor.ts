import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNGFkZTJjY2UtMTMyYi00YTQ0LThlNDItOTUxMTJjMTU5ZGRmIn0.phcLfQqEMrIMlvNwTwPMelmcg77esPM7cXYrb5KbeEQ')
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
