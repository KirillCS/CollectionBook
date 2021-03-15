import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { UserDto } from 'src/app/models/dtos/user.dto';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private userSource = new Subject<UserDto>();

  public user$ = this.userSource.asObservable();

  public update(user: UserDto): void {
    this.userSource.next(user);
  }
}
