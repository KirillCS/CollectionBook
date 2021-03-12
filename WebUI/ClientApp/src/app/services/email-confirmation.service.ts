import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';
import { LoginResponse } from 'src/app/models/responses/login.response';
import { UpdateEmailResponse } from 'src/app/models/responses/update-email.response';

@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public isEmailConfirmed(id: string): Observable<boolean> {
    let params = new HttpParams().set('id', id);
    return this.httpClient.get<boolean>(`${this.apiUrl}api/email/confirmed`, { params });
  }

  public sendConfirmationMessage(id: string): Observable<void> {
    let params = new HttpParams().set('id', id);
    return this.httpClient.get<void>(`${this.apiUrl}api/email/sendconfirmation`, { params });
  }

  public updateEmail(id: string, email: string): Observable<UpdateEmailResponse> {
    return this.httpClient.put<UpdateEmailResponse>(`${this.apiUrl}api/email/update`, { id, email });
  }

  public confirmEmail(id: string, token: string): Observable<LoginResponse> {
    return this.httpClient.put<LoginResponse>(`${this.apiUrl}api/email/confirm`, { id, token });
  }
}
