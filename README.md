# 📝 Extensión Universal de Envío de Texto

Una extensión de Chrome que envía texto personalizado a múltiples sitios web con un solo clic en el icono.

## ✨ Características

- 🚀 **Un clic**: Solo haz clic en el icono de la extensión
- 📤 **Envío automático**: Envía texto predefinido directamente
- 🌐 **Multi-sitio**: Funciona en ChatGPT, Gemini, Google, Meta, Wikipedia, Claude y más
- 🎯 **Detección inteligente**: Detecta automáticamente el sitio web y usa los selectores apropiados
- 🔧 **Sin interfaz**: Sin popups ni configuraciones complicadas

## 🌐 Sitios web compatibles

### ✅ **Sitios específicamente optimizados:**
- **🤖 ChatGPT** (chatgpt.com, openai.com)
- **💎 Gemini** (gemini.google.com) - Chat de Google Gemini
- **🔍 Google** (google.com) - Campo de búsqueda
- **📘 Meta/Facebook** (facebook.com, meta.com) - Posts y comentarios
- **📚 Wikipedia** (wikipedia.org) - Búsqueda y editor
- **🧠 Claude** (claude.ai, anthropic.com)

### ✅ **Funcionamiento genérico:**
- Cualquier sitio con campos de texto
- Elementos `textarea`
- Campos `input[type="text"]`
- Elementos `contenteditable`

## 🚀 Instalación

1. **Descargar o clonar** este repositorio
2. **Abrir Chrome** y navegar a `chrome://extensions/`
3. **Activar el modo desarrollador** (toggle en la esquina superior derecha)
4. **Hacer clic en "Cargar extensión sin empaquetar"**
5. **Seleccionar** la carpeta que contiene los archivos de la extensión
6. **¡Listo!** Verás el icono de la extensión en la barra de herramientas

## 📖 Cómo usar

1. **Ir a cualquier sitio web** compatible
2. **Hacer clic** en el icono de la extensión en la barra de herramientas
3. **¡Automático!** El texto se insertará en el campo apropiado

### 🎯 **Ejemplos de uso:**
- **ChatGPT**: Se inserta en el campo de chat
- **Gemini**: Se inserta en el campo de conversación con Google Gemini
- **Google**: Se inserta en el campo de búsqueda
- **Facebook**: Se inserta en el campo de "¿Qué estás pensando?"
- **Wikipedia**: Se inserta en la búsqueda o editor
- **Claude**: Se inserta en el campo de conversación

## ⚙️ Personalización

Para cambiar el texto que se envía, edita el archivo `background.js`:

```javascript
const textPrompt = "Tu texto personalizado aquí";
```

## 🔧 Funcionamiento técnico

1. **Detección de sitio**: Identifica automáticamente el sitio web
2. **Selectores específicos**: Usa selectores optimizados para cada sitio
3. **Fallback genérico**: Si no reconoce el sitio, usa selectores universales
4. **Inserción inteligente**: Maneja diferentes tipos de campos (textarea, input, contenteditable)

## 🛠️ Archivos del proyecto

- `manifest.json` - Configuración de la extensión
- `background.js` - Maneja el clic del icono y contiene el texto
- `content.js` - Se ejecuta en páginas web para insertar el texto
- `icons/` - Iconos de la extensión
- `PRUEBA_RAPIDA.md` - Guía de prueba rápida
- `SOLUCION_PROBLEMAS.md` - Guía de solución de problemas

## 🐛 Solución de problemas

### La extensión no funciona
1. **Asegúrate** de estar en un sitio web compatible
2. **Recarga** la página web (Ctrl + F5)
3. **Recarga** la extensión en chrome://extensions/

### Para depurar
1. **Abre** las herramientas de desarrollador (F12)
2. **Ve** a la pestaña "Console"
3. **Busca** mensajes de la extensión
4. **Consulta** `PRUEBA_RAPIDA.md` para una guía paso a paso

## 📝 Mensajes de consola esperados

```
🔌 Content script cargado en: [URL]
🖱️ Icono de extensión clickeado
🌐 Sitio detectado: [chatgpt|gemini|google|meta|wikipedia|claude|generico]
🎯 Intentando insertar texto: [tu texto personalizado]
🔍 Selectores a usar: [array de selectores]
✅ Elemento válido encontrado con selector: [selector usado]
✅ Texto insertado correctamente
```

## 🆕 Nuevas características

- **🌐 Multi-sitio**: Ahora funciona en múltiples plataformas
- **💎 Soporte para Gemini**: Añadido soporte específico para Google Gemini
- **🎯 Detección automática**: Reconoce el sitio web automáticamente
- **🔍 Selectores específicos**: Cada sitio tiene sus propios selectores optimizados
- **🔄 Fallback inteligente**: Si no reconoce el sitio, usa selectores genéricos
- **📝 Mejor logging**: Mensajes de consola más informativos para depuración

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Siéntete libre de:
- Reportar bugs
- Sugerir nuevos sitios web para soporte
- Mejorar selectores existentes
- Enviar pull requests

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT. 