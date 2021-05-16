import { Component, Input, OnInit } from '@angular/core';
import { UserCardDto } from 'src/app/models/dtos/user/user-card.dto';
import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Input('user') private _user: UserCardDto;

  constructor() { }

  ngOnInit(): void {
  }

  public get userCover(): UserCoverDto {
    return this._user;
  }

  public get collectionsCount(): number {
    return this._user.collectionsCount
  }
}
