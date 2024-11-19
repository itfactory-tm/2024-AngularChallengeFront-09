import { 
  HttpInterceptorFn, 
  HttpRequest, 
  HttpHandlerFn, 
  HttpEvent 
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { inject } from '@angular/core';
import { LoaderService } from './loader.service';

export const loadingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>, 
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Inject service using inject() function
  const loaderService = inject(LoaderService);

  // Track total requests (you can make this a separate service if needed)
  const totalRequests = 0;

  loaderService.setLoading(true);

  return next(req).pipe(
    finalize(() => {
      loaderService.setLoading(false);
    })
  );
};