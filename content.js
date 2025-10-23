// Content script universal para insertar texto en múltiples sitios web
console.log('🔌 Content script cargado en:', window.location.href);

// OJU
// Función para detectar el tipo de sitio web
function detectarSitio() {
  const hostname = window.location.hostname.toLowerCase();
  
  if (hostname.includes('chatgpt.com') || hostname.includes('openai.com')) {
    return 'chatgpt';
  } else if (hostname.includes('gemini.google.com')) {
    return 'gemini';
  } else if (hostname.includes('google.com') && !hostname.includes('mail.google.com')) {
    return 'google';
  } else if (hostname.includes('facebook.com') || hostname.includes('meta.ai')) {
    return 'meta';
  } else if (hostname.includes('wikipedia.org')) {
    return 'wikipedia';
  } else if (hostname.includes('claude.ai') || hostname.includes('anthropic.com')) {
    return 'claude';
  } else if (hostname.includes('copilot.microsoft.com') || hostname.includes('github.com/features/copilot')) {
    return 'copilot';
  } else if (hostname.includes('deepseek.com') || hostname.includes('chat.deepseek.com')) {
    return 'deepseek';
  } else if (hostname.includes('grok.com') || hostname.includes('x.ai')) {
    return 'grok';
  } else if (hostname.includes('mistral.ai') || hostname.includes('chat.mistral.ai')) {
    return 'mistral';
  } else if (hostname.includes('mail.google.com') || hostname.includes('gmail.com')) {
    return 'gmail';
  } else if (hostname.includes('perplexity.ai')) {
    return 'perplexity';
  } else {
    return 'generico';
  }
}

// Selectores específicos por sitio web
function obtenerSelectores(sitio) {
  const selectores = {
    chatgpt: [
      'textarea[data-id]',
      'textarea[id*="prompt"]',
      '#prompt-textarea',
      'textarea[placeholder*="Message"]',
      'textarea[placeholder*="mensaje"]',
      'div[contenteditable="true"][role="textbox"]',
      'main textarea',
      'form textarea'
    ],
    
    gemini: [
      'div[contenteditable="true"][data-placeholder*="Enter a prompt"]',
      'div[contenteditable="true"][data-placeholder*="Introduce un mensaje"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][aria-label*="Message"]',
      'div[contenteditable="true"][aria-label*="Prompt"]',
      'textarea[placeholder*="Enter a prompt"]',
      'textarea[placeholder*="Introduce un mensaje"]',
      'rich-textarea div[contenteditable="true"]',
      '.ql-editor[contenteditable="true"]',
      'div[contenteditable="true"]',
      'textarea[aria-label*="Message"]',
      'main textarea',
      'form textarea'
    ],
    
    google: [
      'input[name="q"]',
      'textarea[name="q"]',
      'input[title*="Buscar"]',
      'input[title*="Search"]',
      'input[role="combobox"]',
      'input[type="search"]',
      '#searchboxinput',
      '.gLFyf'
    ],
    
    meta: [
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-text*="thinking"]',
      'div[contenteditable="true"][data-text*="pensando"]',
      'textarea[placeholder*="What\'s on your mind"]',
      'textarea[placeholder*="¿Qué estás pensando"]',
      'div[data-testid="status-attachment-mentions-input"]',
      '[role="textbox"]',
      'textarea'
    ],
    
    wikipedia: [
      'input[name="search"]',
      'input#searchInput',
      'input.searchboxInput',
      'textarea[name="wpTextbox1"]',  // Editor de Wikipedia
      'input[placeholder*="Search"]',
      'input[placeholder*="Buscar"]',
      'textarea',
      'input[type="search"]'
    ],
    
    claude: [
      'textarea[placeholder*="Talk to Claude"]',
      'textarea[placeholder*="Habla con Claude"]',
      'div[contenteditable="true"]',
      'textarea[data-id]',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    copilot: [
      'textarea[placeholder*="Ask Copilot"]',
      'textarea[placeholder*="Ask me anything"]',
      'textarea[placeholder*="Message Copilot"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-placeholder*="Ask"]',
      'textarea[aria-label*="Message"]',
      'textarea[aria-label*="Chat"]',
      'cib-text-input textarea',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    deepseek: [
      'textarea[placeholder*="Send a message"]',
      'textarea[placeholder*="Type your message"]',
      'textarea[placeholder*="Ask DeepSeek"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-placeholder*="message"]',
      'textarea[data-testid*="chat-input"]',
      'textarea[id*="chat"]',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    grok: [
      'textarea[placeholder*="Ask Grok"]',
      'textarea[placeholder*="Message Grok"]',
      'textarea[placeholder*="Type a message"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-testid*="grok"]',
      'textarea[data-testid*="compose"]',
      'textarea[aria-label*="Message"]',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    mistral: [
      'textarea[placeholder*="Send a message"]',
      'textarea[placeholder*="Type your message"]',
      'textarea[placeholder*="Ask Mistral"]',
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][data-placeholder*="message"]',
      'textarea[data-testid*="chat-input"]',
      'textarea[id*="input"]',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    gmail: [
      'div[contenteditable="true"][role="textbox"]',
      'div[contenteditable="true"][aria-label*="Message Body"]',
      'div[contenteditable="true"][aria-label*="Cuerpo del mensaje"]',
      'div[contenteditable="true"][data-message-id]',
      'div[g_editable="true"]',
      'div[contenteditable="true"][dir="ltr"]',
      'textarea[name="body"]',
      'textarea[aria-label*="Message"]',
      'div.Am.Al.editable',
      'div[role="textbox"]',
      'textarea'
    ],
    
    perplexity: [
      'textarea[placeholder*="Ask anything"]',
      'textarea[placeholder*="Ask"]',
      'textarea[placeholder*="Follow up"]',
      'textarea[data-testid*="search"]',
      'textarea[class*="TextareaAutosize"]',
      'div[contenteditable="true"][role="textbox"]',
      'textarea[aria-label*="Search"]',
      'main textarea',
      'form textarea',
      '[role="textbox"]',
      'textarea'
    ],
    
    generico: [
      'textarea:not([disabled])',
      'input[type="text"]:not([disabled])',
      'input[type="search"]:not([disabled])',
      'div[contenteditable="true"]',
      '[role="textbox"]',
      'input:not([type="hidden"]):not([type="submit"]):not([type="button"])',
      'textarea'
    ]
  };
  
  return selectores[sitio] || selectores.generico;
}

// Función principal para insertar texto
function enviarTextoUniversal(texto) {
  const sitio = detectarSitio();
  console.log('🌐 Sitio detectado:', sitio);
  console.log('🎯 Intentando insertar texto:', texto);
  
  const selectores = obtenerSelectores(sitio);
  console.log('🔍 Selectores a usar:', selectores);

  for (let i = 0; i < selectores.length; i++) {
    const selector = selectores[i];
    console.log(`🔍 Probando selector ${i + 1}/${selectores.length}: ${selector}`);
    
    try {
      const elemento = document.querySelector(selector);
      
      if (elemento) {
        console.log('🎯 Elemento encontrado:', elemento);
        console.log('👁️ ¿Es visible?', elemento.offsetParent !== null);
        console.log('🚫 ¿Está deshabilitado?', elemento.disabled);
        console.log('📝 Tipo de elemento:', elemento.tagName);
        console.log('✏️ ¿Es contenteditable?', elemento.contentEditable);
        
        if (elemento.offsetParent !== null && !elemento.disabled) {
          console.log(`✅ Elemento válido encontrado con selector: ${selector}`);
          
          try {
            // Enfocar el elemento
            console.log('🎯 Enfocando elemento...');
            elemento.focus();
            elemento.click();
            
            // Limpiar contenido existente
            if (elemento.tagName === 'TEXTAREA' || elemento.tagName === 'INPUT') {
              elemento.value = '';
            } else if (elemento.contentEditable === 'true') {
              elemento.textContent = '';
              elemento.innerHTML = '';
            }
            
            // Pequeña pausa para que el sitio se prepare
            setTimeout(() => {
              // Insertar el texto
              if (elemento.tagName === 'TEXTAREA' || elemento.tagName === 'INPUT') {
                console.log('📝 Insertando en TEXTAREA/INPUT...');
                elemento.value = texto;
                elemento.dispatchEvent(new Event('input', { bubbles: true }));
                elemento.dispatchEvent(new Event('change', { bubbles: true }));
                elemento.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true }));
              } else if (elemento.contentEditable === 'true') {
                console.log('📝 Insertando en elemento contentEditable...');
                
                // Para Gemini y otros editores rich text
                if (sitio === 'gemini') {
                  // Método específico para Gemini
                  elemento.innerHTML = texto;
                  elemento.textContent = texto;
                  
                  // Eventos específicos para Gemini
                  elemento.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                  elemento.dispatchEvent(new Event('keyup', { bubbles: true }));
                  elemento.dispatchEvent(new Event('paste', { bubbles: true }));
                  
                  // Simular typing para Gemini
                  const inputEvent = new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: texto
                  });
                  elemento.dispatchEvent(inputEvent);
                } else {
                  // Método estándar para otros sitios
                  elemento.textContent = texto;
                  elemento.innerHTML = texto;
                  elemento.dispatchEvent(new Event('input', { bubbles: true }));
                  elemento.dispatchEvent(new Event('keyup', { bubbles: true }));
                  elemento.dispatchEvent(new InputEvent('input', {
                    bubbles: true,
                    cancelable: true,
                    inputType: 'insertText',
                    data: texto
                  }));
                }
              }
              
              // Eventos adicionales que algunos sitios necesitan
              elemento.dispatchEvent(new Event('focus', { bubbles: true }));
              elemento.dispatchEvent(new Event('blur', { bubbles: true }));
              elemento.focus(); // Volver a enfocar
              
              console.log('✅ Texto insertado correctamente');
            }, 100);
            
            return true;
            
          } catch (error) {
            console.log(`❌ Error insertando con selector ${selector}:`, error);
          }
        } else {
          console.log(`⚠️ Elemento encontrado pero no es válido (oculto o deshabilitado)`);
        }
      } else {
        console.log(`❌ No se encontró elemento con selector: ${selector}`);
      }
    } catch (error) {
      console.log(`💥 Error con selector ${selector}:`, error);
    }
  }
  
  console.log('❌ No se encontró ningún campo de texto válido');
  
  // Información de depuración adicional
  console.log('🔍 Información de depuración:');
  console.log('- Sitio detectado:', sitio);
  console.log('- Todos los textareas:', document.querySelectorAll('textarea'));
  console.log('- Todos los inputs de texto:', document.querySelectorAll('input[type="text"], input[type="search"]'));
  console.log('- Elementos contenteditable:', document.querySelectorAll('[contenteditable="true"]'));
  console.log('- URL actual:', window.location.href);
  
  return false;
}

// Escuchar mensajes del background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Mensaje recibido:', request);
  
  if (request.action === 'insertarTexto') {
    const exito = enviarTextoUniversal(request.texto);
    console.log('📤 Enviando respuesta:', { success: exito });
    sendResponse({ success: exito });
    return true;
  }
  
  if (request.action === 'getSelection') {
    const selectedText = window.getSelection().toString();
    console.log('📤 Enviando texto seleccionado:', selectedText);
    console.log('📤 Longitud del texto:', selectedText.length);
    console.log('📤 Texto limpio:', selectedText.trim());
    sendResponse(selectedText);
    return true;
  }
  
  return false;
}); 