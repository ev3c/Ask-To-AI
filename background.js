// Script de fondo que maneja la sidebar de la extensión

// Función que se ejecuta cuando se instala la extensión
chrome.runtime.onInstalled.addListener(() => {
  console.log('🚀 Extensión de envío de texto instalada correctamente');
  console.log('📱 Usa la sidebar para enviar texto haciendo clic en el icono de la extensión');
  
  // Configurar la sidebar para que se abra automáticamente al hacer clic en el icono
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error('Error configurando sidebar:', error));
}); 