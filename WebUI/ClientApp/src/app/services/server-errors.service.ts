import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ServerErrorsService {

  public setFormErrors(form: FormGroup, errorResponse: HttpErrorResponse): void {
    let errors = errorResponse.error.errors;
    Object.keys(errors).forEach(errorKey => {
      let control = form.get(errorKey.toCamelCase());
      if (control) {
        control.setErrors({ serverErrors: errors[errorKey] });
      }
    });
  }
}
