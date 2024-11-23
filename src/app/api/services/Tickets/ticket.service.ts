import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TicketDto } from '../../dtos/ticket-dto';
import { environment } from '../../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = `${environment.baseUrl}/Tickets`;

  constructor(private http: HttpClient) {}

  getTickets(): Observable<TicketDto[]> {
    return this.http.get<TicketDto[]>(this.apiUrl);
  }

  getTicketById(id: TicketDto): Observable<TicketDto> {
    return this.http.get<TicketDto>(`${this.apiUrl}/${id}`);
  }

  addTicket(ticket: TicketDto): Observable<TicketDto> {
    return this.http
      .post<TicketDto>(this.apiUrl, ticket)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
