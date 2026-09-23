import { HttpInterceptorFn } from '@angular/common/http';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({
    setHeaders: {
      'Authorization': `Bearer YOUR_API_SECRET_TOKEN`,
      'x-api-key': `YOUR_BUS_API_KEY`,
      'Content-Type': 'application/json'
    }
  });
  return next(apiReq);
};