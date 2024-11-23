import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserResponseDto } from '../../dtos/User/user-response-dto';
import { catchError, Observable, switchMap, take, throwError } from 'rxjs';
import { baseUrl } from '../../../lib/constants';
import { UserRequestDto } from '../../dtos/User/user-request-dto';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  apiUrl = `${baseUrl}/Users`;
  constructor(
    public auth: AuthService,
    private http: HttpClient
  ) {}

  public getUsers(): Observable<UserResponseDto[]> {
    return this.http.get<UserResponseDto[]>(this.apiUrl);
  }

  updateUser(id: string, user: UserRequestDto): Observable<UserRequestDto> {
    return this.http
      .put<UserRequestDto>(`${this.apiUrl}/${id}`, user)
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
            .post<UserRequestDto>(this.apiUrl, newUser)
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
