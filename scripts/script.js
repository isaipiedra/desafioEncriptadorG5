//Declaración de variables

//Elementos del documento -----------------------------------------------

//1. CAJA DE TEXTO
var cajaDeTexto = document.querySelector("#texto");
//2. IDENTIFICADOR DE TRANSCRIPCIÓN, EQUIVALENTE AL CONTENEDOR DE LOS RESULTADOS
var transcripcion = document.querySelector("#transcripcion");
//3. TEXTO ENCRIPTADO O DESENCRIPTADO RESULTANTE
var textoEncriptado = document.querySelector("#encriptado");
//4. CONTENEDOR DE LOS RESULTADOS
var textosResultantes = document.querySelector("#resultados");

//-----------------------------------------------------------------------


//Variables de uso ------------------------------------------------------
//1. ARREGLO DE ACENTOS POSIBLES
var acentos = ['á', 'é', 'í', 'ó', 'ú', 'ä', 'ë', 'ï', 'ö', 'ü', 'à', 'è', 'ì', 'ò', 'ù'];
//2. ARREGLO DE LETRAS VOCALES
var vocales = ['a', 'e', 'i', 'o', 'u'];
//3. ARREGLO DE CÓDIGOS DE ENCRIPTADO
var codigos = ['ai', 'enter', 'imes', 'ober', 'ufat'];

//-----------------------------------------------------------------------

//Funciones de encriptado y desencriptado -------------------------------

//1. FUNCIÓN PARA NORMALIZAR EL TEXTO CON MAYÚSCULAS O ACENTOS
function normalizar(texto) {
   //Eliminar espacios en blanco
   texto = texto.toLowerCase().trim();

   //Declaración de variables para reacomodar el texto
   let caracter = '';
   let nuevoTexto = '';

   //Iteración sobre el texto para la creación del nuevo texto normalizado
   for (let letra = 0; letra < texto.length; letra++) {

      //Iteración sobre el arreglo de acentos para determinar la existencia de acentos en el texto escrito por el usuario
      for (let acento = 0; acento < acentos.length; acento++) {
         //Determina si existe un acento
         let ocurrencia = texto[letra] == acentos[acento] || texto[letra] == acentos[acento].toUpperCase();

         //Si existe un acento...
         if (ocurrencia) {
            //Si el acento se encuentra entre 0 y 5...
            if (acento < vocales.length) {
               //Asigna al caracter la letra vocal correspondiente
               caracter = vocales[acento];
               break;
               //Si el acento no se encuentra entre 0 y 5...
            } else {
               //Realiza un cálculo para determinar la vocal y asigna al caracter la vocal correspondiente
               caracter = vocales[acento - 5];
               break;
            }
            //Si no encuentra un acento...
         } else {
            //Asigna al caracter la letra que ingreso el usuario
            caracter = texto[letra];
         }
      }

      //Añade el caracter al nuevo texto normalizado
      nuevoTexto += caracter;
   }

   //Retorna el nuevo texto normalizado
   return nuevoTexto;
}

//2. FUNCIÓN PARA ENCRIPTAR TEXTO
function encriptar(texto) {
   //Declaración de variables para reacomodar el texto encriptado
   let caracter = '';
   let nuevoTexto = '';

   //Iteración sobre el texto para la creación del nuevo texto encriptado
   for (let letra = 0; letra < texto.length; letra++) {
      //Iteración sobre el arreglo de vocales para determinar si la letra es una vocal y cambiarla por su respectivo código
      for (let vocal = 0; vocal < vocales.length; vocal++) {
         //Determina si existe una vocal
         let ocurrencia = texto[letra] == vocales[vocal];

         //Si existe una vocal...
         if (ocurrencia) {
            //Asigna al caracter el código correspondiente a la vocal
            caracter = codigos[vocal];
            break;
            //Si no existe una vocal...
         } else {
            //Asigna al caracter la letra ingresada en el texto
            caracter = texto[letra];
         }
      }
      //Añade el caracter al nuevo texto encriptado
      nuevoTexto += caracter;
   }

   //Retorna el texto encriptado
   return nuevoTexto;
}

//3. FUNCIÓN PARA DESENCRIPTAR TEXTO
function desencriptar(texto) {
   //Declaración de variables para reacomodar el texto desencriptado
   let nuevoTexto = '';
   let letra = 0;

   //Iteración sobre el texto para la creación del nuevo texto desencriptado
   do {
      //Añade la letra al nuevo texto desencriptado
      nuevoTexto += texto[letra];

      //Iteración sobre el arreglo de códigos para determinar si existe un código a desencriptar
      for (let codigo = 0; codigo < codigos.length; codigo++) {
         //Si en el nuevo texto existe una secuencia de código encriptado...
         if (nuevoTexto.includes(codigos[codigo])) {
            // ...la remplaza por la letra vocal correspondiente
            nuevoTexto = nuevoTexto.replace(codigos[codigo], vocales[codigo]);
         }
      }

      //Aumenta en uno el valor del contador de letras
      letra++;

      //La iteración se repite mientras el contador de letras no supere el tamaño del texto original
   } while (letra < texto.length);

   //Iteración final sobre el arreglo de códigos para determinar que no exista la combinación de letras "ames" en el texto desencriptado
   for (let ames = 0; ames < nuevoTexto.length; ames++) {
      //Si existe la combinación de letras...
      if (nuevoTexto.includes('ames')) {
         // ...la remplaza por la combinación "ai"
         nuevoTexto = nuevoTexto.replace('ames', 'ai');
      }
   }

   //Retorna el texto desencriptado
   return nuevoTexto;
}

//-----------------------------------------------------------------------

//Funciones de evento click ---------------------------------------------

//1. EVENTO CLICK PARA ENCRIPTAR EL TEXTO
function encriptarClick() {
   /* Captura el texto contenido en el textbox */
   let texto = cajaDeTexto.value;
   /* Normaliza el texto encontrado */
   let textoNormalizado = normalizar(texto);
   /* Variable bandera para determinar que el texto no esté vacío */
   let confirmacion = textoNormalizado != "";

   /* Iteración sobre el arreglo de códigos para determinar si el texto ingresado está, posiblemente, ya encriptado */
   for (let codigo = 0; codigo < codigos.length; codigo++) {
      /* Si el texto incluye alguna código y la confirmación de que el texto no está vacío es verdadera... */
      if (textoNormalizado.includes(codigos[codigo]) && confirmacion) {
         /* Si el código es "ai", lo omite (porque la combinación de letras es posible en el idioma español) */
         if (codigos[codigo] == 'ai'){
            continue;
         /* De otra forma, */
         } else {
            /* pregunta al usuario si desea re-encriptar el código, con una advertencia */
            confirmacion = confirm("Este texto puede estar ya encriptado, si lo vuelve a encriptar puede que su resultado al desencriptarlo no sea el deseado. ¿Desea continuar?...");
            break;
         }
      }
   }

   /* Procede con el proceso de desencriptación si el texto no está vacío y si el usuario está de acuerdo con continuar en el caso de que el texto ya esté encriptado*/
   if (confirmacion) {
      /* Llamado a la función para encriptar el texto */
      let nuevoTexto = encriptar(textoNormalizado);

      //Ocultar el mensaje predeterminado de la transcripción
      transcripcion.classList = 'ocultar';
      //Mostrar el contendor de las respuestas
      textoEncriptado.classList = 'mostrar';

      //Crear un elemento con la respuesta
      let div = document.createElement('div');
      //Asigna la clase respectiva al elemento con la respuesta
      div.className = 'resultadoEncriptacion';

      //Crear un párrafo con la respuesta
      let parrafo = document.createElement('p');
      //Añade al párrafo el contenido encriptado entre comillas
      parrafo.innerHTML = '"' + nuevoTexto + '"';

      //Crea un elemeto "i" para funcionar como botón
      let botonCopiar = document.createElement('i');
      //Asigna las clases respectivas para el ícono de copiar
      botonCopiar.classList = 'bx bx-copy';
      //Añade el evento de click al botón de copiado
      botonCopiar.setAttribute("onclick", "copiar(this)");

      //Ingresa el párrafo en el elemento con la respuesta
      div.append(parrafo);
      //Añade el botón en el elemento con la respuesta
      div.append(botonCopiar);
      //Añade el elemento con la respuesta en el contenedor de resultados
      textosResultantes.append(div);
   }

   //Reinicia el valor original de la caja de texto
   cajaDeTexto.value = 'Ingrese el texto aquí';
}

//2. EVENTO CLICK PARA DESENCRIPTAR EL TEXTO
function desencriptarClick() {
   /* Captura el texto contenido en el textbox */
   let texto = cajaDeTexto.value;
   /* Normaliza el texto encontrado */
   let textoNormalizado = normalizar(texto);

   /* Procede con el proceso de desencriptación si el texto no está vacío */
   if (textoNormalizado != "") {
      /* Llamado a la función para desencriptar el texto */
      let nuevoTexto = desencriptar(textoNormalizado);

      //Ocultar el mensaje predeterminado de la transcripción
      transcripcion.classList = 'ocultar';
      //Mostrar el contendor de las respuestas
      textoEncriptado.classList = 'mostrar';

      //Crear un elemento con la respuesta
      let div = document.createElement('div');
      //Asigna la clase respectiva al elemento con la respuesta
      div.className = 'resultadoEncriptacion';

      //Crear un párrafo con la respuesta
      let parrafo = document.createElement('p');
      //Añade al párrafo el contenido encriptado entre comillas
      parrafo.innerHTML = '"' + nuevoTexto + '"';

      //Crea un elemeto "i" para funcionar como botón
      let botonCopiar = document.createElement('i');
      //Asigna las clases respectivas para el ícono de copiar
      botonCopiar.classList = 'bx bx-copy';
      //Añade el evento de click al botón de copiado
      botonCopiar.setAttribute("onclick", "copiar(this)");

      //Ingresa el párrafo en el elemento con la respuesta
      div.append(parrafo);
      //Añade el botón en el elemento con la respuesta
      div.append(botonCopiar);
      //Añade el elemento con la respuesta en el contenedor de resultados
      textosResultantes.append(div);
   }

   //Reinicia el valor original de la caja de texto
   cajaDeTexto.value = 'Ingrese el texto aquí';
}

//3. EVENTO CLICK PARA COPIAR EL TEXTO
function copiar(boton) {
   /* Captura el padre del botón copiar */
   let contenedor = boton.parentNode;
   /* Tomando el contendor, captura el parrafo con el resultado */
   let parrafo = contenedor.querySelector('p');
   /* Captura el texto contenido en el párrafo */
   let texto = parrafo.innerHTML;

   /* Iteración sobre el texto para eliminar las comillas */
   for (const letra in texto) {
      if (texto[letra] == '"') {
         /* Remplaza las comillas por un espacio */
         texto = texto.replace('"', '');
      }
   }

   //Intenta copiar el texto, con ayuda de la función de copiado seguro del archivo "copiar.js"
   try {
      copiado_seguro(texto);
   }
   //Captura los posibles errores
   catch (e) {
      console.error(e);
   }
}

//4. EVENTO CLICK PARA LIMPIAR EL ÁREA DE RESULTADOS
function limpiar() {
   //Captura, en un arreglo, todas los resultados en la caja de resultados
   let divs = textosResultantes.getElementsByClassName('resultadoEncriptacion');
   //Variable de contador para la remoción de los resultados
   let i = divs.length - 1;

   //Iteración sobre el arreglo de resultados
   do {
      //Remoción del elemento hijo que corresponde a la posición del contador
      textosResultantes.removeChild(divs[i]);
      //Disminuye en uno el valor del contador de resultados
      i--;
   //El ciclo se repite mientras el contador sea mayor o igual a 0
   } while (i >= 0);

   //Muestra la pantalla predeterminada
   transcripcion.classList = 'mostrar';
   //Oculta el panel de respuestas
   textoEncriptado.classList = 'ocultar';
}

//-----------------------------------------------------------------------
