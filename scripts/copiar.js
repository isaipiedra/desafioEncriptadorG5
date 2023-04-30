/* Función de copiado para que el encriptador de texto permita copiar la salidad en todos los contextos dependiendo del navegador */

/* ACLARACIÓN: Este código no es propio, si no rescatado, tras un proceso de investigación, de: https://stackoverflow.com/questions/69438702/why-does-navigator-clipboard-writetext-not-copy-text-to-clipboard-if-it-is-pro, y es necesario para que, al copiar el texto, permita hacerlo en todas las instancias y navegadores */

function copiado_seguro(text) {
   return new Promise((resolve, reject) => {
      if (typeof navigator !== "undefined" && typeof navigator.clipboard !== "undefined" && navigator.permissions !== "undefined") {
         const type = "text/plain";
         const blob = new Blob([text], { type });
         const data = [new ClipboardItem({ [type]: blob })];
         navigator.permissions.query({ name: "clipboard-write" }).then((permission) => {
            if (permission.state === "granted" || permission.state === "prompt") {
               navigator.clipboard.write(data).then(resolve, reject).catch(reject);
            }
            else {
               reject(new Error("Permission not granted!"));
            }
         });
      }
      else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
         var textarea = document.createElement("textarea");
         textarea.textContent = text;
         textarea.style.position = "fixed";
         textarea.style.width = '2em';
         textarea.style.height = '2em';
         textarea.style.padding = 0;
         textarea.style.border = 'none';
         textarea.style.outline = 'none';
         textarea.style.boxShadow = 'none';
         textarea.style.background = 'transparent';
         document.body.appendChild(textarea);
         textarea.focus();
         textarea.select();
         try {
            document.execCommand("copy");
            document.body.removeChild(textarea);
            resolve();
         }
         catch (e) {
            document.body.removeChild(textarea);
            reject(e);
         }
      }
      else {
         reject(new Error("None of copying methods are supported by this browser!"));
      }
   });
}
