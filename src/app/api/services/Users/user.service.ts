import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserResponseDto } from '../../dtos/User/user-response-dto';
import { catchError, Observable, throwError } from 'rxjs';
import { baseUrl } from '../../../lib/constants';

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

  // Method to sync user with the backend
  public syncUser(): void {
    this.auth.user$.subscribe(user => {
      if (user) {
        const newUser: UserResponseDto = {
          auth0Id: user.sub ?? '',
          email: user.email ?? '',
          isAdmin: false,
        };

        this.http
          .post<UserResponseDto>(this.apiUrl, newUser)
          .pipe(catchError(this.handleError))
          .subscribe({
            next: response =>
              console.log('User synced successfully:', response),
            error: err => console.error('Error syncing user:', err),
          });
      }
    });
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorMessage =
      error.status === 400
        ? error.error
        : 'Er is een onverwachte fout opgetreden.';
    return throwError(() => new Error(errorMessage));
  }
}
