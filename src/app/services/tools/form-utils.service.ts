import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ValidatorService } from './validator.service';
import { ValidatorService2 } from './validator.service copy';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  private validator = inject(ValidatorService2);

  constructor() { }

  isValidField(myForm: FormGroup, fieldName: string): boolean {
    return !!(myForm.controls[fieldName].errors && myForm.controls[fieldName].touched); //Doble negacion para saber si tiene algo esa variable
  }

  getFieldError(myForm: FormGroup, fieldName: string): string | null {
    if (!myForm.controls[fieldName]) return null;

    const errors = myForm.controls[fieldName].errors ?? {};

    return this.validator.getTextError(errors);
  }

}
