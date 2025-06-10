## 📲 PROMPT DEFINITIVO – App LEARNLAB basada NextJS y Supabase

Actúa como un equipo experto en desarrollo de **apps educativas gamificadas**. Diseña y desarrolla **LEARNLAB**, una app móvil educativa para aprender **Fundamentos de cualquier Tema**, orientada a estudiantes de secundaria y primeros semestres universitarios.

La app debe construirse con **arquitectura Supabase First**, contener una **estructura modular por materias, modulos, lecciones**, evaluación detallada, juegos interactivos, glosario y un panel de administrador.

---

### 🔐 AUTENTICACIÓN Y USUARIOS

* Inicio de sesión obligatorio con **correo electrónico y contraseña** usando Supabase Authentication.
* Cada usuario tendrá un perfil único que guarde:

  * Progreso por módulo y por lección
  * Historial de calificaciones
  * Juegos completados
  * Lecciones y módulos desbloqueados
* Roles definidos:

  * **Estudiante**
  * **Administrador** (con acceso seguro mediante credenciales especiales)

---
ejemplo de un curso:

### MATERIA: FUNDAMENTOS DE ECONOMÍA

### 📚 ÍNDICE DEL CURSO – FUNDAMENTOS DE ECONOMÍA

#### Módulo 1: Introducción a la Economía y Principios Fundamentales

Objetivo: Comprender qué es la economía, por qué es relevante y cuáles son los principios básicos que guían el pensamiento económico.

* Lección 1.1: ¿Qué es la Economía? Escasez, Elección y Costo de Oportunidad
* Lección 1.2: Los Diez Principios de la Economía
* Lección 1.3: Pensar como un Economista: Modelos y Gráficos

---

#### Módulo 2: Microeconomía – El Funcionamiento de los Mercados

Objetivo: Analizar cómo se comportan los consumidores y las empresas, y cómo sus interacciones determinan precios y cantidades.

* Lección 2.1: Oferta y Demanda: Las Fuerzas del Mercado
* Lección 2.2: Elasticidad: La Sensibilidad de la Oferta y la Demanda
* Lección 2.3: El Consumidor y la Utilidad
* Lección 2.4: La Empresa: Producción y Costos
* Lección 2.5: Estructuras de Mercado

---

#### Módulo 3: Macroeconomía – La Economía en su Conjunto

Objetivo: Entender los grandes agregados económicos y los principales desafíos de la política económica.

* Lección 3.1: Midiendo la Riqueza de una Nación: El Producto Interno Bruto (PIB)
* Lección 3.2: Inflación y Desempleo: Los Grandes Desafíos Macroeconómicos
* Lección 3.3: Crecimiento Económico y Productividad
* Lección 3.4: El Dinero y el Sistema Financiero
* Lección 3.5: Política Fiscal y Política Monetaria

---

#### Módulo 4: La Economía Global *(Opcional o de Ampliación)*

Objetivo: Introducir conceptos básicos de comercio internacional y finanzas globales.

* Lección 4.1: Comercio Internacional: Ventaja Comparativa y Balanza Comercial

---

### 🔁 DESBLOQUEO PROGRESIVO DE MÓDULOS Y LECCIONES

* Las **lecciones se desbloquean secuencialmente** dentro de cada módulo.
* Una lección se habilita **solo si la anterior se aprueba con mínimo 3.0**, incluyendo quiz y juegos.
* El examen del módulo se activa cuando se completan todas las lecciones.
* Al aprobar el examen del módulo (≥ 3.0), se desbloquea el siguiente módulo.

---

### 🧠 CONTENIDO INTERACTIVO POR LECCIÓN

Cada lección debe incluir:

* Definiciones visuales e ilustradas
* Glosario interactivo de términos
* Juegos (mínimo 2): crucigrama, sopa de letras, ahorcado o completar frases
* Quiz de práctica (mínimo 5 preguntas)

---

### 🧩 QUIZ Y EXAMEN POR MÓDULO

* Cada **lección** tiene un quiz.
* Cada **módulo** finaliza con un **examen de mínimo 10 preguntas**.
* Tipos de preguntas:

  * Selección múltiple
  * Falso / Verdadero
  * Completar con palabra

---

### 🎮 JUEGOS INTERACTIVOS

Cada lección incluye juegos vinculados al glosario:

* Crucigrama
* Sopa de letras
* Ahorcado
* Completar frases

Generados automáticamente a partir del glosario cargado por el administrador.

---

### 📈 RÚBRICA DE EVALUACIÓN Y PROGRESO

**Escala de notas:**

* Mínimo: **0.0**
* Máximo: **5.0**
* Nota mínima para aprobar: **3.0**

#### COMPONENTES DE LA NOTA FINAL DE CADA MÓDULO

| Elemento            | Peso sobre la nota final del módulo |
| ------------------- | ----------------------------------- |
| Examen final        | 50%                                 |
| Quizzes por lección | 25% (promedio de quizzes)           |
| Juegos por lección  | 25% (promedio de juegos)            |

> **Fórmula final:**
> Nota módulo = (Examen \* 0.5) + (Promedio quizzes \* 0.25) + (Promedio juegos \* 0.25)

Los porcentajes los define el profesor al momento de crear el curso.

---

### 🛠️ PANEL DE ADMINISTRADOR/PROFESOR (desde la app)

Permite al usuario tipo admin:

* Crear, editar y eliminar módulos y lecciones
* Subir preguntas de quiz y examen
* Crear glosarios por lección
* Generar juegos por lección
* Visualizar estadísticas de usuarios

---

### 🧱  ESTRUCTURA DE BASE DE DATOS

ejemplo: (podemos definir las que requiramos)
```plaintext
/users/{userId}
/users/{userId}/progress/{moduleId}/lessons/{lessonId}
/modules/{moduleId}
/modules/{moduleId}/lessons/{lessonId}
/modules/{moduleId}/lessons/{lessonId}/quiz/{questionId}
/modules/{moduleId}/lessons/{lessonId}/games/{gameId}
/modules/{moduleId}/lessons/{lessonId}/glossary/{termId}
/modules/{moduleId}/exam/{questionId}
/admins/{adminId}
```

---

### 💻 TECNOLOGÍAS SUGERIDAS

* **Frontend**: Next.Js REACT
* **Backend**: Supabase (Auth, db, Edge Functions) Next.js
* **Almacenamiento**: Supabase Storage

---

### 🎨 USABILIDAD Y DISEÑO

* Interfaz sencilla e intuitiva
* Estilo juvenil, amigable y colorido
* Barra de progreso visual por lección y módulo
* Pantalla de inicio con “Continuar donde ibas”
* Compatible con modo claro/oscuro y responsive

---
