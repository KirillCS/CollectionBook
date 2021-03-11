import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';

import { API_URL } from 'src/app/app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationService {
  constructor(private httpClient: HttpClient, @Inject(API_URL) private apiUrl: string) { }

  public isEmailConfirmed(id: string): Observable<boolean> {
    let params: Params = { id };
    return this.httpClient.get<boolean>(`${this.apiUrl}api/email/confirmed`, params);
  }
}
