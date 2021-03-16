import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';
import { LoginResponse } from 'src/app/models/responses/auth/login.response';
import { UpdateEmailResponse } from 'src/app/models/responses/update-email.response';
import { UpdateEmailRequest } from 'src/app/models/requests/email/update-email.request';
import { ConfirmEmailRequest } from 'src/app/models/requests/email/confirm-email.request';

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

  public updateEmail(request: UpdateEmailRequest): Observable<UpdateEmailResponse> {
    return this.httpClient.put<UpdateEmailResponse>(`${this.apiUrl}api/email/update`, request);
  }

  public confirmEmail(request: ConfirmEmailRequest): Observable<LoginResponse> {
    return this.httpClient.put<LoginResponse>(`${this.apiUrl}api/email/confirm`, request);
  }
}