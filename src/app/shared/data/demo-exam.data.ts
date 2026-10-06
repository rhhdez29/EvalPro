import { ExamDetail } from '../../features/dashboard/models/RESTExamResponse.interface';

export const DEMO_EXAM_DATA: ExamDetail = {
  id: 0,
  subject: 1,
  title: 'Examen Demo de Programación y Desarrollo Web',
  description: 'Examen interactivo de prueba para evaluar conocimientos fundamentales en desarrollo web moderno, TypeScript, Angular y algoritmos con la plataforma EvalPro.',
  start_date: new Date().toISOString(),
  end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  status: 'published',
  duration_minutes: 60,
  total_score: 100,
  questions: [
    // 1. MCQ (Opción Múltiple) - 10 pts
    {
      id: 1,
      exam: 0,
      question_type: 'MCQ',
      prompt: '¿Cuál de las siguientes afirmaciones describe con mayor precisión el funcionamiento de las Signals en Angular?',
      points: 10,
      order: 1,
      metadata: {},
      options: [
        {
          id: 101,
          question: 1,
          text: 'Son una primitiva reactiva síncrona con seguimiento automático de dependencias (fine-grained reactivity).',
          partial_score: 10,
          is_correct: true
        },
        {
          id: 102,
          question: 1,
          text: 'Son observables asíncronos que requieren obligatoriamente suscribirse con .subscribe() para obtener su valor.',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 103,
          question: 1,
          text: 'Solo pueden ser utilizadas dentro de servicios inyectables y nunca directamente en componentes o plantillas.',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 104,
          question: 1,
          text: 'Reemplazan de manera forzosa el Virtual DOM en todas las versiones existentes de Angular.',
          partial_score: 0,
          is_correct: false
        }
      ]
    },

    // 2. MCQ (Opción Múltiple) - 10 pts
    {
      id: 2,
      exam: 0,
      question_type: 'MCQ',
      prompt: 'En TypeScript, ¿cuál es una diferencia clave entre un `type` alias y una `interface` en cuanto a su extensibilidad?',
      points: 10,
      order: 2,
      metadata: {},
      options: [
        {
          id: 201,
          question: 2,
          text: 'Las interfaces admiten "declaration merging" (declaraciones múltiples con el mismo nombre se fusionan automáticamente), mientras que los types no.',
          partial_score: 10,
          is_correct: true
        },
        {
          id: 202,
          question: 2,
          text: 'Los types solo admiten tipos primitivos y no pueden modelar la forma de objetos o funciones.',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 203,
          question: 2,
          text: 'Las interfaces no admiten extenderse de otras interfaces usando la palabra clave extends.',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 204,
          question: 2,
          text: 'No existe ninguna diferencia técnica entre ambos constructos.',
          partial_score: 0,
          is_correct: false
        }
      ]
    },

    // 3. MCQ (Opción Múltiple) - 10 pts
    {
      id: 3,
      exam: 0,
      question_type: 'MCQ',
      prompt: '¿Cuáles de los siguientes métodos HTTP se consideran idempotentes según la especificación HTTP/1.1 y REST?',
      points: 10,
      order: 3,
      metadata: {},
      options: [
        {
          id: 301,
          question: 3,
          text: 'GET, PUT y DELETE',
          partial_score: 10,
          is_correct: true
        },
        {
          id: 302,
          question: 3,
          text: 'POST, PATCH y CONNECT',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 303,
          question: 3,
          text: 'Únicamente el método GET',
          partial_score: 0,
          is_correct: false
        },
        {
          id: 304,
          question: 3,
          text: 'POST y PUT únicamente',
          partial_score: 0,
          is_correct: false
        }
      ]
    },

    // 4. TF (Verdadero / Falso) - 10 pts
    {
      id: 4,
      exam: 0,
      question_type: 'TF',
      prompt: 'En Angular, un `computed()` signal produce un valor derivado de solo lectura que se evalúa perezosamente (lazy) únicamente cuando alguna de sus señales dependientes cambia.',
      points: 10,
      order: 4,
      metadata: {
        correctAnswer: true
      },
      options: []
    },

    // 5. TF (Verdadero / Falso) - 10 pts
    {
      id: 5,
      exam: 0,
      question_type: 'TF',
      prompt: 'En JavaScript moderno (ES6+), el operador de igualdad abstracta (`==`) compara tanto el valor como el tipo de dato sin realizar coerción implícita de tipos.',
      points: 10,
      order: 5,
      metadata: {
        correctAnswer: false
      },
      options: []
    },

    // 6. MATCH (Emparejamiento) - 10 pts
    {
      id: 6,
      exam: 0,
      question_type: 'MATCH',
      prompt: 'Relaciona cada código de estado HTTP con su definición oficial según la RFC 7231:',
      points: 10,
      order: 6,
      metadata: {
        pairs: [
          { left: '200 OK', right: 'Petición exitosa y respuesta estándar' },
          { left: '201 Created', right: 'Petición completada y recurso creado exitosamente en el servidor' },
          { left: '400 Bad Request', right: 'El servidor no puede procesar la petición debido a sintaxis inválida' },
          { left: '401 Unauthorized', right: 'La solicitud carece de credenciales de autenticación válidas' },
          { left: '404 Not Found', right: 'El recurso solicitado no fue encontrado en el servidor' }
        ]
      },
      options: []
    },

    // 7. MATCH (Emparejamiento) - 10 pts
    {
      id: 7,
      exam: 0,
      question_type: 'MATCH',
      prompt: 'Empareja cada concepto clave del desarrollo Frontend con su descripción correspondiente:',
      points: 10,
      order: 7,
      metadata: {
        pairs: [
          { left: 'Virtual DOM', right: 'Representación ligera en memoria del DOM real para calcular diferencias' },
          { left: 'Tree Shaking', right: 'Proceso de empaquetado que elimina código muerto no utilizado' },
          { left: 'Hydration', right: 'Adjunta interactividad y event listeners al HTML renderizado en servidor' },
          { left: 'CSSOM', right: 'Árbol que representa las reglas y estilos calculados para cada nodo' },
          { left: 'Polyfill', right: 'Código que emula APIs modernas en navegadores antiguos' }
        ]
      },
      options: []
    },

    // 8. CODE (Editor de Código) - 10 pts
    {
      id: 8,
      exam: 0,
      question_type: 'CODE',
      prompt: 'Implementa una función en TypeScript llamada `invertirCadena(texto: string): string` que tome una cadena de texto y la retorne en orden invertido.',
      points: 10,
      order: 8,
      metadata: {
        language: 'typescript',
        framework: 'none',
        starterCode: `/**\n * Invierte los caracteres de la cadena proporcionada.\n * @param texto Cadena original\n * @returns Cadena invertida\n */\nfunction invertirCadena(texto: string): string {\n  // Escribe tu solución aquí\n  return texto.split('').reverse().join('');\n}`
      },
      options: []
    },

    // 9. CODE (Editor de Código) - 10 pts
    {
      id: 9,
      exam: 0,
      question_type: 'CODE',
      prompt: 'Escribe una función en TypeScript llamada `filtrarPares(numeros: number[]): number[]` que reciba un arreglo de números enteros y devuelva un nuevo arreglo que contenga únicamente los números pares.',
      points: 10,
      order: 9,
      metadata: {
        language: 'typescript',
        framework: 'none',
        starterCode: `/**\n * Filtra los números pares de un arreglo.\n * @param numeros Arreglo de números enteros\n * @returns Arreglo filtrado con solo números pares\n */\nfunction filtrarPares(numeros: number[]): number[] {\n  // Escribe tu solución aquí\n  return numeros.filter(num => num % 2 === 0);\n}`
      },
      options: []
    },

    // 10. CODE (Editor de Código) - 10 pts
    {
      id: 10,
      exam: 0,
      question_type: 'CODE',
      prompt: 'Crea una función llamada `esPalindromo(cadena: string): boolean` que determine si una palabra es un palíndromo (se lee igual al derecho y al revés), ignorando mayúsculas y espacios.',
      points: 10,
      order: 10,
      metadata: {
        language: 'javascript',
        framework: 'none',
        starterCode: `/**\n * Verifica si una palabra o frase es un palíndromo.\n * @param cadena Texto a comprobar\n * @returns true si es palíndromo, false si no lo es\n */\nfunction esPalindromo(cadena) {\n  // Escribe tu solución aquí\n  const textoLimpio = cadena.toLowerCase().replace(/\\s+/g, '');\n  return textoLimpio === textoLimpio.split('').reverse().join('');\n}`
      },
      options: []
    }
  ]
};
