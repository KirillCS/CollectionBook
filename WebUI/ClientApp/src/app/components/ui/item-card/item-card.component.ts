import { Component, Inject, Input } from '@angular/core';
import { API_URL, DEFAULT_COLLECTION_COVER } from 'src/app/app-injection-tokens';

import { ItemCoverDto } from 'src/app/models/dtos/item/item-cover.dto';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.component.html',
  styleUrls: ['./item-card.component.scss']
})
export class ItemCardComponent {

  @Input('item') private _item: ItemCoverDto = {
    id: 6,
    name: 'Some item',
    info: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Repudiandae dolorum nulla ipsa. Vero amet hic consequuntur, delectus, ad, voluptas culpa magnam tempora quo nostrum pariatur magni nihil rerum libero id.',
    creationTime: new Date(),
    imagePath: 'collectionscovers/a71ffa36-3262-469c-a7a3-1004f5f4afd8.jpg',
  };

  public constructor(@Inject(API_URL) private apiUrl: string, @Inject(DEFAULT_COLLECTION_COVER) private defaultImagePath: string) { }

  public get item(): ItemCoverDto {
    return this._item;
  }

  public get imagePath(): string {
    return this.item.imagePath ? this.apiUrl + this.item.imagePath : this.defaultImagePath;
  }
}
