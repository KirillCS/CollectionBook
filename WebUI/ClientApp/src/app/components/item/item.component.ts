import { Component, OnInit } from '@angular/core';

import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { PathNode } from '../ui/path/path-node';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  public user: UserCoverDto = {
    id: null,
    login: 'login',
    firstName: 'Kirill',
    lastName: 'Potapov',
    avatarPath: null
  }

  public pathNodes: Array<PathNode> = [
    new PathNode('login', '/profile/login'),
    new PathNode('Books', '/collection/22'),
    new PathNode('Some item')
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
