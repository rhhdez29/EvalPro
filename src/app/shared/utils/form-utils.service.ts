import { inject, Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ValidatorService2 } from './validator.service';

@Injectable({
  providedIn: 'root'
})
export class FormUtilsService {

  private validator = inject(ValidatorService2);

  constructor() { }

  strictEmailValidator(): ValidatorFn{

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if(!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@alumno\.buap\.mx$/;

      const isValid = emailRegex.test(value);

      return isValid ? null: {invalidFormat: true}
    }

  }

  minValue(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if(value === null || value === undefined || value === '') return null;

      const numValue = Number(value);

      const isValid = numValue >= min;

      return isValid ? null: {minValue: {min: min}}
    }
  }

  maxValue(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if(!value) return null;

      const isValid = value <= max;

      return isValid ? null: {maxValue: {max: max}}
    }
  }

  //Valida que al menos una opcion sea correcta
  hasAtLeastOneCorrectAnswer(formArray: FormArray): boolean {
    return formArray.controls.some(
      (control) => control.get('isCorrect')?.value === true
    );
  }

  isValidField(myForm: FormGroup, fieldName: string): boolean {
    return !!(myForm.controls[fieldName].errors && myForm.controls[fieldName].touched); //Doble negacion para saber si tiene algo esa variable
  }

  isValidFieldInArray(formArray: FormArray, index: number){
    return (formArray.controls[index].errors && formArray.controls[index].touched)
  }

  isValidFieldInArrayGroup(formArray: FormArray, index: number, fieldName: string): boolean {
    const group = formArray.at(index);
    const control = group.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }
  getFieldError(myForm: FormGroup, fieldName: string): string | null {
    if (!myForm.controls[fieldName]) return null;

    const errors = myForm.controls[fieldName].errors ?? {};

    return this.validator.getTextError(errors);
  }

}
