import { Component, Inject, Input } from '@angular/core';
import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';

import { ItemCoverDto } from 'src/app/models/dtos/item/item-cover.dto';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {

  @Input('item') private _item: ItemCoverDto;

  public constructor(@Inject(API_URL) private apiUrl: string, @Inject(DEFAULT_COLLECTION_COVER) private defaultImagePath: string) { }

  public get item(): ItemCoverDto {
    return this._item;
  }

  public get imagePath(): string {
    return this.item.imagePath ? this.apiUrl + this.item.imagePath : this.defaultImagePath;
  }
}
