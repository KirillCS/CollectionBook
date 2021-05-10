import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

export class ItemChangeEvent {
  private _index: number;
  private _item: string;

  public constructor(index: number, item: string) {
    this._index = index;
    this._item = item;
  }

  public get index(): number {
    return this._index;
  }

  public get item(): string {
    return this._item;
  }
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input('title') private _title: string;
  @Input('items') private _items: string[];
  @Input('selectedIndex') private _selectedIndex = -1;

  @Output() private change = new EventEmitter<ItemChangeEvent>()

  public ngOnInit(): void {
    this._items ??= new Array<string>();
  }

  public get title(): string {
    return this._title;
  }

  public get items(): string[] {
    return this._items;
  }

  public get selectedIndex(): number {
    return this._selectedIndex;
  }

  public itemWasClicked(item: string): void {
    let index = this.items.indexOf(item);
    if (index == this.selectedIndex) {
      return;
    }

    this._selectedIndex = index;
    this.change.emit(new ItemChangeEvent(index, item));
  }
}
