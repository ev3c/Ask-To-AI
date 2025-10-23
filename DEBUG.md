# 🔧 Guía de Depuración

## Para solucionar problemas con ChatGPT

### 1. **Abrir herramientas de desarrollador**
- Presiona `F12` en tu navegador
- Ve a la pestaña "Console" (Consola)

### 2. **Probar la extensión**
- Ve a ChatGPT
- Haz clic en el icono de la extensión
- Intenta enviar texto
- Observa los mensajes en la consola

### 3. **Mensajes que deberías ver**
```
Content script cargado
Recibido mensaje para insertar texto: [tu texto]
URL actual: chatgpt.com
Detectada página de ChatGPT
Intentando insertar en ChatGPT...
Elemento encontrado con selector: [selector usado]
Texto insertado en ChatGPT con éxito
```

### 4. **Si no funciona, verifica:**

#### A) **Recargar la página**
- Presiona `Ctrl + F5` en ChatGPT
- Vuelve a intentar

#### B) **Buscar el selector correcto**
En la consola del navegador, ejecuta:
```javascript
// Encontrar el textarea de ChatGPT
document.querySelector('textarea')
```

#### C) **Probar manualmente**
En la consola, ejecuta:
```javascript
// Insertar texto manualmente
const textarea = document.querySelector('textarea');
if (textarea) {
  textarea.value = 'Texto de prueba';
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
  console.log('Texto insertado manualmente');
} else {
  console.log('No se encontró textarea');
}
```

### 5. **Selectores alternativos**
Si el selector actual no funciona, puedes probar estos en la consola:
```javascript
// Probar diferentes selectores
document.querySelector('textarea[data-id]')
document.querySelector('#prompt-textarea')  
document.querySelector('textarea[placeholder*="Message"]')
document.querySelector('div[contenteditable="true"]')
document.querySelector('main textarea')
```

### 6. **Información útil para reportar problemas**
Si sigues teniendo problemas, incluye esta información:
- Navegador y versión
- URL exacta de ChatGPT
- Mensajes de la consola
- Resultado de: `document.querySelector('textarea')`

### 7. **Solución rápida temporal**
Si nada funciona, puedes usar este código directamente en la consola:
```javascript
const texto = 'Tu texto personalizado aquí';
const textarea = document.querySelector('textarea') || 
                document.querySelector('[contenteditable="true"]');
if (textarea) {
  textarea.focus();
  if (textarea.tagName === 'TEXTAREA') {
    textarea.value = texto;
  } else {
    textarea.textContent = texto;
  }
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}
``` 