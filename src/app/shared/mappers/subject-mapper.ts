// import { RESTSubject, Result } from "../../features/dashboard/models/RestSubject.interface";
// import { Subject } from "../../features/dashboard/models/subject.interface";

// export class SubjectMapper {

//   //static RestSubject => Subject
//   static mapRestSubjectToSubject(item: Result): Subject{  // este método recibe un objeto de tipo RESTCountry y devuelve un objeto de tipo Country, esto nos permite tener una mejor estructura de datos en nuestra aplicación y evitar errores de tipo
//     return{
//       id: item.id.toString(),
//       name: item.name,
//       code: item.code,
//       department: item.department,
//       color: item.color,
//       teacher_name: item.teacher_name,
//       students_count: item.students_count.toString(),
//       exams_count: item.exams_count.toString()
//     }
//   }

//   //static RestSubject[] => Subject[]

//   static mapRestSubjectsItemsToSubjectsArray(items: RESTSubject): Subject[]{ // este método recibe un array de objetos de tipo RESTCountry y devuelve un array de objetos de tipo Country, esto nos permite tener una mejor estructura de datos en nuestra aplicación y evitar errores de tipo

//     return (items.results || []).map(item => this.mapRestSubjectToSubject(item));

//   }

// }
