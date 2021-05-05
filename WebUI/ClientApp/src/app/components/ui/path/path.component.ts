import { Component, Input, OnInit } from '@angular/core';

import { PathNode } from './path-node';

@Component({
  selector: 'app-path',
  templateUrl: './path.component.html',
  styleUrls: ['./path.component.scss']
})
export class PathComponent implements OnInit {

  @Input('nodes') private _nodes: Array<PathNode>;
  @Input('highlight') private _highlight: boolean;
  @Input('icon') private _icon: string;

  public constructor() { }

  public ngOnInit(): void {
    if (!this._nodes) {
      this._nodes = new Array<PathNode>();
    }
  }

  public get nodes() : Array<PathNode> {
    return this._nodes;
  }
  
  public get highlight() : boolean {
    return this._highlight
  }

  public get icon() : string {
    return this._icon
  }
}
