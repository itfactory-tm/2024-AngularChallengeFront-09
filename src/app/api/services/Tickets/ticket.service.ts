import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TicketDto } from '../../dtos/ticket-dto';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private baseUrl: string = "https://localhost:7091";

  constructor(private http: HttpClient) { }

  getTickets(): Observable<TicketDto[]>{
    return this.http.get<TicketDto[]>(this.baseUrl + "/api/Tickets");
  }

  getTicketById(id: TicketDto): Observable<TicketDto>{
    return this.http.get<TicketDto>(this.baseUrl + "/api/Tickets/" + id)
  }

  addTicket(ticket: TicketDto): Observable<TicketDto>{
    return this.http.post<TicketDto>(this.baseUrl + "/api/Tickets", ticket).pipe(
      catchError(this.handleError)
    )
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = (error.status === 400) ? error.error : "Er is een onverwachte fout opgetreden.";
    return throwError(() => new Error(errorMessage));
  }
}
