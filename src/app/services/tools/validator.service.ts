import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  // Reglas (Regex)
  private readonly EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@alumno\.buap\.mx$/;

  required(value: string): string | null {
    return value ? null : 'Este campo es obligatorio';
  }

  email(email: string): string | null {
    if (!email) return null; // Dejamos que 'required' maneje el vacío
    return this.EMAIL_REGEX.test(email) ? null : 'Debe ser correo @alumno.buap.mx';
  }

  minLength(value: string, min: number): string | null {
    if (!value) return null;
    return value.length >= min ? null : `Mínimo ${min} caracteres`;
  }

  justLength(value: string, len: number): string | null {
    if (!value) return null;
    return value.length === len ? null : `Deben ser exactamente ${len} digitos`;
  }

  requiredFile(value: File|null): string | null{
    return value ? null : 'Archivo obligatorio'
  }
}
