// Script de fondo que maneja la extensión

// Función para actualizar el menú contextual con la URL actual
function updateContextMenu(url) {
  if (url) {
    chrome.contextMenus.update('askToAIPage', {
      title: `Ask To AI: ${url}`
    });
  }
}

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

// Actualizar el menú contextual cuando cambia la pestaña activa
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      updateContextMenu(tab.url);
    }
  });
});

// Actualizar el menú contextual cuando se actualiza una pestaña
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0] && tabs[0].id === tabId) {
        updateContextMenu(changeInfo.url);
      }
    });
  }
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