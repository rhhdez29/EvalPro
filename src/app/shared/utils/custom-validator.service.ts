import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export function strictEmailValidator(): ValidatorFn{

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if(!value) return null;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@alumno\.buap\.mx$/;

    const isValid = emailRegex.test(value);

    return isValid ? null: {invalidFormat: true}
    }

  }

