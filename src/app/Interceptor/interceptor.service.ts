import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthGaurdService } from '../gaurd/auth-gaurd.service';

@Injectable({
  providedIn: 'root',
})
export class InterceptorService implements HttpInterceptor {
  token: any;

  constructor(private AuthGaurdService: AuthGaurdService) {
   if(sessionStorage.getItem('token')){
    this.token = sessionStorage.getItem('token');
    // console.log(this.token," access token to be sent via headers");
   }
  }

  intercept(req: any, next: any) {
    let tokenizeReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`,
      },
    });
    return next.handle(tokenizeReq);
  }
}
