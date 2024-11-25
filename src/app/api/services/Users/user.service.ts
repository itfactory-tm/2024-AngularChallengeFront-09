import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserResponseDto } from '../../dtos/User/user-response-dto';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { UserRequestDto } from '../../dtos/User/user-request-dto';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${environment.baseUrl}/Users`;
  private headers: HttpHeaders | undefined;
  constructor(
    public auth: AuthService,
    private http: HttpClient
  ) {
    auth.getAccessTokenSilently().subscribe({
      next: token =>
        (this.headers = new HttpHeaders({ authorization: `Bearer ${token}` })),
    });
  }

  public getUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  updateUser(id: string, user: UserRequestDto): Observable<UserRequestDto> {
    return this.http
      .put<UserRequestDto>(`${this.apiUrl}/${id}`, user, {
        headers: this.headers,
      })
      .pipe(catchError(this.handleError));
  }

  // Method to sync user with the backend
  public syncUser(): Observable<UserRequestDto> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          const newUser: UserRequestDto = {
            auth0Id: user.sub ?? '',
            email: user.email ?? '',
            isAdmin: false,
          };

          return this.http
            .post<UserRequestDto>(this.apiUrl, newUser, {
              headers: this.headers,
            })
            .pipe(catchError(this.handleError));
        } else {
          return throwError(() => new Error('User data is not available.'));
        }
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
