import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService2 {

  getTextError(errors: ValidationErrors){
    console.log(errors);
    for(const key of Object.keys(errors)){
      switch(key){
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Minimo de ${errors['minlength'].requiredLength} caracteres.`;
        case 'min':
          return `Minimo minimo de ${errors['min'].min} caracteres.`;
        case 'email':
          return 'Ingrese un correo valido.'
        case 'invalidFormat':
          return 'Ingrese un correo valido.'
      }
    }
    return null;
  }

}
