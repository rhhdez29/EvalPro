import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { StudentData, StudentErrors } from '../shared/interfaces/student.interface';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  constructor() { }

  private validator = inject(ValidatorService);

  validateStudent(data: StudentData): StudentErrors {

    console.log('Validando datos alumno...', data);

    //validaciones
    return {
      nombre: this.validator.required(data.nombre),
      apellido: this.validator.required(data.apellido),
      correo: this.validator.email(data.correo) || this.validator.required(data.correo),
      password: this.validator.minLength(data.password, 8) || this.validator.required(data.password),
      matricula: this.validator.required(data.matricula) || this.validator.justLength(data.matricula, 9),
      carrera: null, // La carrera es opcional, no necesita validación adicional
      semestre: null, // El semestre es un opcional, no necesita validación adicional
      kardex: this.validator.requiredFile(data.kardex)
    };

  }

  isValidForm(errors: StudentErrors): boolean { // Verifica si el formulario es válido
    return Object.values(errors).every(error => !error);
  }
}
