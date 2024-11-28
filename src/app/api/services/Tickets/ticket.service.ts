import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { TicketResponseDto } from '../../dtos/Ticket/ticket-response-dto';
import { TicketRequestDto } from '../../dtos/Ticket/ticket-request-dto';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = `${environment.baseUrl}/Tickets`;
  private headers: HttpHeaders | undefined;

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }

  getTickets(): Observable<TicketResponseDto[]> {
    return this.http.get<TicketResponseDto[]>(this.apiUrl);
  }

  getTicketById(id: TicketResponseDto): Observable<TicketResponseDto> {
    return this.http.get<TicketResponseDto>(`${this.apiUrl}/${id}`);
  }

  addTicket(ticket: TicketResponseDto): Observable<TicketResponseDto> {
    return this.http
      .post<TicketResponseDto>(this.apiUrl, ticket, { headers: this.headers })
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
