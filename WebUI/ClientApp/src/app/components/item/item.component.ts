import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';
import { ItemDto } from 'src/app/models/dtos/item/item.dto';

import { UserCoverDto } from 'src/app/models/dtos/user/user-cover.dto';
import { ItemService } from 'src/app/services/item.service';
import { PathNode } from '../ui/path/path-node';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  private _item: ItemDto;
  private _pathNodes: Array<PathNode>;

  public constructor(
    @Inject(API_URL) private apiUrl: string,
    @Inject(DEFAULT_COLLECTION_COVER) private defaul: string,
    private itemService: ItemService,
    private route: ActivatedRoute
  ) { }

  public get pathNodes() : Array<PathNode> {
    return this._pathNodes;
  }
  
  public get item() : ItemDto {
    return this._item;
  }

  public get defaultImagePath() : string {
    return this.defaul;
  }
  
  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      let id = parseInt(params.get('id'));
      this.itemService.get(id).subscribe(item => {
        this._item = item;
        this._pathNodes = [
          new PathNode(item.user.login, `/profile/${item.user.login}`),
          new PathNode(item.collection.name, `/collection/${item.collection.id}`),
          new PathNode(item.name)
        ]
      });
    });
  }

  public getFullImagePath(imagePath: string): string {
    return `${this.apiUrl}${imagePath}`
  }
}
