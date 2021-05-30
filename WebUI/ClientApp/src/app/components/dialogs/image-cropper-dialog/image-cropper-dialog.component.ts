import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { base64ToFile, ImageCroppedEvent } from 'ngx-image-cropper';

export class ImageCropperDialogData {
  
  constructor(
    public file: File,
    public maintainAspectRatio: boolean,
    public aspectRatio: number,
    public resizeToWidth: number,
    public roundCropper: boolean,
    public message: string,
    public submitButton: string,
  ) { }
}

@Component({
  selector: 'app-image-cropper-dialog',
  templateUrl: './image-cropper-dialog.component.html'
})
export class ImageCropperDialogComponent {

  public constructor(
    private dialogRef: MatDialogRef<ImageCropperDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ImageCropperDialogData
  ) { }
  
  public imageCropped(event: ImageCroppedEvent): void {
    this.dialogRef.close(base64ToFile(event.base64));
  }
}
