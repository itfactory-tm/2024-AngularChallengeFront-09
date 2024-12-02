import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { TicketResponseDto } from '../../dtos/Ticket/ticket-response-dto';
import { TicketRequestDto } from '../../dtos/Ticket/ticket-request-dto';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@auth0/auth0-angular';
import slug from 'slug';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  private apiUrl = `${environment.baseUrl}/Tickets`;
  private headers: HttpHeaders | undefined;
  private ticketsSubject = new BehaviorSubject<TicketResponseDto[]>([]);
  tickets$: Observable<TicketResponseDto[]> = this.ticketsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: AuthService
  ) {
    this.auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }
  fetchTickets(): void {
    this.http.get<TicketResponseDto[]>(this.apiUrl).subscribe((tickets) => {
      this.ticketsSubject.next(tickets);
    });
  }

  getTickets(): Observable<TicketResponseDto[]> {
    return this.http.get<TicketResponseDto[]>(this.apiUrl);
  }

  getTicketById(id: TicketResponseDto): Observable<TicketResponseDto> {
    return this.http.get<TicketResponseDto>(`${this.apiUrl}/${id}`);
  }

  addTicket(ticket: TicketRequestDto): Observable<TicketResponseDto> {
    return this.http
      .post<TicketResponseDto>(this.apiUrl, ticket, { headers: this.headers })
      .pipe(catchError(this.handleError));
  }

  deleteTicket(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.headers });
  }

  updateTicket(id: string, ticket: TicketRequestDto): Observable<TicketResponseDto> {
    return this.http.put<TicketResponseDto>(`${this.apiUrl}/${id}`, ticket, { headers: this.headers });
  }

  getTicketBySlug(urlSlug: string): Observable<TicketResponseDto> {
    return this.getTickets().pipe(
      map(tickets => {
        const stage = tickets.find(ticket => slug(ticket.name) === urlSlug);
        if (!stage) {
          throw new Error('Stage not found');
        }
        return stage;
      })
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
