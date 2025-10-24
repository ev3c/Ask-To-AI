// Script de fondo que maneja la extensión

// Función que se ejecuta cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 Extensión Ask to AI instalada correctamente');
  
  // Menú contextual en el icono de la extensión
  chrome.contextMenus.create({
    id: 'Share',
    title: '🚀 Share',
    contexts: ['action']
  });
  
  chrome.contextMenus.create({
    id: 'Rate',
    title: '⭐ Rate',
    contexts: ['action']
  });
  
  // Menú contextual en las páginas web cuando hay texto seleccionado
  chrome.contextMenus.create({
    id: 'askToAISelection',
    title: 'Ask To AI: "%s"',
    contexts: ['selection']
  });
  
  // Menú contextual en las páginas web cuando NO hay texto seleccionado
  chrome.contextMenus.create({
    id: 'askToAIPage',
    title: 'Ask To AI: (Current page URL)',
    contexts: ['page']
  });
});

// Manejar clicks en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'share') {
    // Abrir página para compartir la extensión
    chrome.tabs.create({
      url: 'https://github.com/yourusername/ask-to-ai'  // Cambia esto por tu URL
    });
  } else if (info.menuItemId === 'rate') {
    // Abrir página de Chrome Web Store para calificar
    chrome.tabs.create({
      url: 'https://chrome.google.com/webstore/detail/your-extension-id'  // Cambia esto por tu URL
    });
  } else if (info.menuItemId === 'askToAISelection') {
    // Guardar el texto seleccionado y la URL para usarlo en el popup
    chrome.storage.local.set({
      contextSelection: info.selectionText,
      contextUrl: tab.url,
      contextTimestamp: Date.now()
    }, () => {
      // Abrir el popup (esto abrirá la extensión)
      chrome.action.openPopup();
    });
  } else if (info.menuItemId === 'askToAIPage') {
    // Guardar la URL para usarla en el popup
    chrome.storage.local.set({
      contextSelection: null,
      contextUrl: tab.url,
      contextTimestamp: Date.now()
    }, () => {
      // Abrir el popup
      chrome.action.openPopup();
    });
  }
}); 