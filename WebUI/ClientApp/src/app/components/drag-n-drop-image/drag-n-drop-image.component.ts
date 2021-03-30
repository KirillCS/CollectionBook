import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ImageCropperDialogComponent, ImageCropperDialogData } from '../dialogs/image-cropper-dialog/image-cropper-dialog.component';

@Component({
  selector: 'app-drag-n-drop-image',
  templateUrl: './drag-n-drop-image.component.html',
  styleUrls: ['./drag-n-drop-image.component.scss']
})
export class DragNDropImageComponent {

  private currentImage: File;

  @ViewChild('input')
  private input: ElementRef<HTMLInputElement>;
  
  @Output() public imageChanged = new EventEmitter<File>();

  public isOver = false;
  public isWrongFileType = false;

  public thumbData: string = '';

  public constructor(public dialog: MatDialog) { }
  
  public selectImage(): void {
    this.isWrongFileType = false;
    this.input.nativeElement.click();
  }

  public cropImage(event: MouseEvent): void {
    event.stopPropagation();

    if (!this.currentImage) {
      return;
    }

    let dialogRef = this.dialog.open(ImageCropperDialogComponent, {
      width: '600px',
      data: new ImageCropperDialogData(this.currentImage, false, 1, 0, false, 'Crop')
    });

    dialogRef.afterClosed().subscribe((imageBlob: Blob) => {
      this.setImage(<File>imageBlob);
    });
  }

  public resetImage(event: MouseEvent): void {
    event.stopPropagation();

    this.input.nativeElement.value = '';
    this.thumbData = '';
    this.currentImage = null;
    this.imageChanged.emit(null);
  }

  public filesSelected(event: Event) : void {
    this.isWrongFileType = false;
    let files = (event.target as HTMLInputElement).files;
    if (!files?.length) {
      return;
    }

    this.setImage(files[0]);
  }

  public filesDroped(event: DragEvent): void {
    event.preventDefault();
    this.isOver = false;
    this.isWrongFileType = false;

    if (event.dataTransfer.files?.length) {
      this.input.nativeElement.files = event.dataTransfer.files;
      this.setImage(event.dataTransfer.files[0]);
    }
  }

  public dragged(event: DragEvent): void {
    event.preventDefault();
    this.isOver = true;
  }

  public draggingStoped(event: DragEvent): void {
    event.preventDefault();
    this.isOver = false;
  }

  private setImage(image: File): void {
    if (!image) {
      return;
    }

    if (!image.type.startsWith("image/")) {
      this.isWrongFileType = true;

      return;
    }

    this.currentImage = image;
    this.imageChanged.emit(image);
    this.setThumb(image);
  }

  private setThumb(image: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      this.thumbData = <string>reader.result;
    };
  }
}
