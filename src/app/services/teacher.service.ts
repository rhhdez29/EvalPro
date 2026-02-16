import { inject, Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { TeacherData, TeacherErrors } from '../shared/interfaces/teacher.inteface';

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  validator = inject(ValidatorService);

  validateTeacher(data: TeacherData): TeacherErrors {

      console.log('Validando datos maestro...', data);

      //validaciones
      return {
        nombre: this.validator.required(data.nombre),
        apellido: this.validator.required(data.apellido),
        correo: this.validator.email(data.correo) || this.validator.required(data.correo),
        password: this.validator.minLength(data.password, 8) || this.validator.required(data.password),
        numeroEmpleado: this.validator.required(data.numeroEmpleado) || this.validator.justLength(data.numeroEmpleado, 9),
        facultad: this.validator.required(data.Facultad)
      };

    }

    isValidForm(errors: TeacherErrors): boolean { // Verifica si el formulario es válido
      return Object.values(errors).every(error => !error);
    }
}
