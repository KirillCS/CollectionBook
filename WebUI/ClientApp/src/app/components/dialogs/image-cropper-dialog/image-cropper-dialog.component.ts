import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';

export class ImageCropperDialogData {
  
  constructor(
    public file: File,
    public maintainAspectRatio: boolean,
    public aspectRatio: number,
    public resizeToWidth: number,
    public roundCropper: boolean,
    public submitButton: string,
  ) { }
}

@Component({
  selector: 'app-image-cropper-dialog',
  templateUrl: './image-cropper-dialog.component.html',
  styleUrls: ['./image-cropper-dialog.component.css']
})
export class ImageCropperDialogComponent {

  private croppedImageInBase64: string;

  public constructor(@Inject(MAT_DIALOG_DATA) public data: ImageCropperDialogData ) { }

  
  public get croppedImage() : Blob {
    return this.croppedImageInBase64 ? base64ToFile(this.croppedImageInBase64) : null;
  }
  

  public imageCropped(event: ImageCroppedEvent): void {
    this.croppedImageInBase64 = event.base64;
  }
}
