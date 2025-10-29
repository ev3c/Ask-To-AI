// URLs de los servicios de IA
const AI_URLS = {
    chatgpt: 'https://chat.openai.com',
    claude: 'https://claude.ai',
    deepseek: 'https://chat.deepseek.com',
    copilot: 'https://copilot.microsoft.com',
    gemini: 'https://gemini.google.com',
    grok: 'https://x.ai/grok',
    meta: 'https://meta.ai',
    mistral: 'https://chat.mistral.ai',
    google: 'https://www.google.com',
    perplexity: 'https://www.perplexity.ai'
};

// Verificar si la URL actual coincide con el servicio seleccionado
function isCorrectAIWebsite(currentUrl, selectedAI) {
    if (selectedAI === 'google') return true;
    const aiUrl = AI_URLS[selectedAI];
    if (!aiUrl) return false;
    const aiDomain = new URL(aiUrl).hostname.replace('www.', '');
    const currentDomain = new URL(currentUrl).hostname.replace('www.', '');
    return currentDomain.includes(aiDomain.split('.')[0]) || aiDomain.includes(currentDomain.split('.')[0]);
}

// Abrir nueva pestaña con el servicio de IA correcto
async function openCorrectAITab(selectedAI) {
    const url = AI_URLS[selectedAI];
    if (!url) throw new Error(`No hay URL definida para ${selectedAI}`);
    
    const newTab = await chrome.tabs.create({ url: url, active: true });
    
    return new Promise((resolve) => {
        const checkTabLoaded = () => {
            chrome.tabs.get(newTab.id, (tab) => {
                if (tab.status === 'complete') {
                    resolve(tab);
                } else {
                    setTimeout(checkTabLoaded, 500);
                }
            });
        };
        checkTabLoaded();
    });
}

// Cargar preferencia guardada
async function loadUserPreference() {
    try {
        const result = await chrome.storage.sync.get(['selectedAI']);
        const value = result.selectedAI || 'chatgpt';
        const radioButton = document.querySelector(`input[name="aiService"][value="${value}"]`);
        if (radioButton) radioButton.checked = true;
    } catch (error) {
        // Error silencioso - usará chatgpt por defecto
    }
}

// Guardar preferencia
async function saveUserPreference(selectedAI) {
    try {
        await chrome.storage.sync.set({ selectedAI: selectedAI });
    } catch (error) {
        // Error silencioso - no crítico
    }
}

// Guardar prompt usado
async function savePromptUsage(prompt) {
    try {
        // Obtener el historial actual
        const result = await chrome.storage.local.get(['promptHistory']);
        let promptHistory = result.promptHistory || {};
        
        // Actualizar contador del prompt
        if (promptHistory[prompt]) {
            promptHistory[prompt]++;
        } else {
            promptHistory[prompt] = 1;
        }
        
        // Guardar de vuelta
        await chrome.storage.local.set({ promptHistory: promptHistory });
        
        // Actualizar la visualización
        await displayFrequentPrompts();
    } catch (error) {
        console.error('Error guardando prompt:', error);
    }
}

// Obtener los 5 prompts más usados
async function getTopPrompts() {
    try {
        const result = await chrome.storage.local.get(['promptHistory']);
        const promptHistory = result.promptHistory || {};
        
        // Convertir a array y ordenar por uso
        const promptArray = Object.entries(promptHistory)
            .map(([prompt, count]) => ({ prompt, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
        
        return promptArray;
    } catch (error) {
        console.error('Error obteniendo prompts frecuentes:', error);
        return [];
    }
}

// Mostrar prompts frecuentes en la interfaz
async function displayFrequentPrompts() {
    const topPrompts = await getTopPrompts();
    const container = document.getElementById('frequentPromptsContainer');
    const list = document.getElementById('frequentPromptsList');
    
    // Si no hay prompts, ocultar el contenedor
    if (topPrompts.length === 0) {
        container.classList.add('hidden');
        return;
    }
    
    // Mostrar el contenedor y limpiar la lista
    container.classList.remove('hidden');
    list.innerHTML = '';
    
    // Crear elementos para cada prompt
    topPrompts.forEach(item => {
        const promptElement = document.createElement('div');
        promptElement.className = 'frequent-prompt-item';
        promptElement.title = item.prompt; // Mostrar completo en tooltip
        
        const promptText = document.createElement('span');
        promptText.className = 'prompt-text';
        promptText.textContent = item.prompt;
        
        const promptCount = document.createElement('span');
        promptCount.className = 'prompt-count';
        promptCount.textContent = `×${item.count}`;
        
        promptElement.appendChild(promptText);
        promptElement.appendChild(promptCount);
        
        // Añadir evento de clic para rellenar el campo
        promptElement.addEventListener('click', () => {
            document.getElementById('askInput').value = item.prompt;
            document.getElementById('askInput').focus();
        });
        
        list.appendChild(promptElement);
    });
}

// Obtener servicio seleccionado
function getSelectedAI() {
    const selectedRadio = document.querySelector('input[name="aiService"]:checked');
    return selectedRadio ? selectedRadio.value : null;
}

// Enviar texto
async function textToAI(textPrompt, targetTab = null) {
    const tab = targetTab || (await chrome.tabs.query({ active: true, currentWindow: true }))[0];
    
    if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        throw new Error('No se puede ejecutar en esta página');
    }

    console.log('🔄 Preparando pestaña:', tab.url);
    
    // Si es una pestaña nueva (targetTab != null), no recargar
    // Si es la pestaña actual (targetTab == null), recargar
    if (!targetTab) {
        console.log('📄 Pestaña existente detectada, recargando...');
        // 1. Pasar el foco a la pestaña
        await chrome.tabs.update(tab.id, { active: true });
        console.log('👁️ Foco pasado a la pestaña');
        
        // 2. Actualizar/refrescar la pestaña existente
        await chrome.tabs.reload(tab.id);
        console.log('🔄 Pestaña actualizada');
    } else {
        console.log('🆕 Pestaña nueva detectada, esperando carga inicial...');
        // Solo pasar el foco, NO recargar
        await chrome.tabs.update(tab.id, { active: true });
        console.log('👁️ Foco pasado a la pestaña');
    }
    
    // 3. Esperar a que la pestaña esté completamente cargada
    await new Promise((resolve) => {
        const checkTabLoaded = () => {
            chrome.tabs.get(tab.id, (updatedTab) => {
                if (updatedTab.status === 'complete') {
                    console.log('✅ Pestaña cargada completamente');
                    resolve();
                } else {
                    console.log('⏳ Esperando carga... status:', updatedTab.status);
                    setTimeout(checkTabLoaded, 500);
                }
            });
        };
        checkTabLoaded();
    });
    
    // 4. Detectar si es un sitio especial y esperar más tiempo
    const isSpecialSite = tab.url.includes('facebook.com') || tab.url.includes('instagram.com') || 
                         tab.url.includes('meta.ai') || tab.url.includes('messenger.com') ||
                         tab.url.includes('copilot.microsoft.com') || tab.url.includes('github.com/features/copilot') ||
                         tab.url.includes('grok.com') || tab.url.includes('x.ai') || tab.url.includes('deepseek.com') ||
                         tab.url.includes('mistral.ai') || tab.url.includes('mail.google.com') || tab.url.includes('gmail.com') ||
                         tab.url.includes('claude.ai') || tab.url.includes('openai.com') || tab.url.includes('gemini.google.com') ||
                         tab.url.includes('perplexity.ai');
    
    // Esperar más tiempo para sitios especiales
    const waitTime = isSpecialSite ? 4000 : 2500;
    console.log(`⏱️ Esperando ${waitTime}ms para que el sitio se inicialice...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // 5. Enviar el texto
    console.log('📤 Enviando texto:', textPrompt.substring(0, 50) + '...');
    try {
        // Intentar enviar el mensaje al content script
        const result = await chrome.tabs.sendMessage(tab.id, {
            action: 'insertarTexto',
            texto: textPrompt
        });
        console.log('✅ Texto enviado exitosamente');
        return result;
    } catch (error) {
        console.error('❌ Error enviando mensaje:', error);
        // Si falla, intentar inyectar el content script y reintentar
        try {
            console.log('🔧 Intentando inyectar content script...');
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['content.js']
            });
            // Esperar un momento y reintentar
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('🔄 Reintentando envío...');
            const result = await chrome.tabs.sendMessage(tab.id, {
                action: 'insertarTexto',
                texto: textPrompt
            });
            console.log('✅ Texto enviado exitosamente (segundo intento)');
            return result;
        } catch (retryError) {
            console.error('❌ Error reintentando:', retryError);
            throw retryError;
        }
    }
}

// Obtener texto seleccionado usando executeScript
async function getSelectedText(tabId) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: () => window.getSelection().toString()
        });
        
        if (results && results[0] && results[0].result) {
            return results[0].result;
        }
        return '';
    } catch (error) {
        console.log('⚠️ Error ejecutando script:', error);
        return '';
    }
}

// Actualizar preview del contexto
async function updateContextPreview() {
    try {
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const contextPreview = document.getElementById('contextPreview');
        
        if (!currentTab.url || currentTab.url.startsWith('chrome://') || currentTab.url.startsWith('chrome-extension://')) {
            contextPreview.textContent = '';
            return;
        }

        // Primero mostrar la URL mientras se obtiene la selección
        contextPreview.textContent = currentTab.url;

        try {
            // Intentar obtener el texto seleccionado usando executeScript
            const selection = await getSelectedText(currentTab.id);
            
            console.log('Selección recibida:', selection);
            console.log('Tipo de selección:', typeof selection);
            console.log('Longitud de selección:', selection.length);
            console.log('Selección limpia:', selection ? selection.trim() : 'vacío');
            
            if (selection && typeof selection === 'string' && selection.trim() !== "") {
                // Mostrar texto seleccionado (truncado a 200 caracteres para 2 líneas)
                const cleanSelection = selection.trim();
                const truncated = cleanSelection.length > 200 ? cleanSelection.substring(0, 200) + '...' : cleanSelection;
                contextPreview.textContent = truncated;
                console.log('✅ Mostrando texto seleccionado:', truncated);
            } else {
                // Mantener la URL ya mostrada
                console.log('ℹ️ No hay selección, mostrando URL');
            }
        } catch (error) {
            // Si no se puede obtener la selección, mantener la URL ya mostrada
            console.log('⚠️ Error obteniendo selección:', error);
        }
    } catch (error) {
        console.error('❌ Error actualizando preview:', error);
    }
}

// Verificar si se abrió desde el menú contextual
async function checkContextMenuData() {
    try {
        const data = await chrome.storage.local.get(['contextSelection', 'contextUrl', 'contextTimestamp']);
        
        // Verificar si los datos son recientes (menos de 2 segundos)
        if (data.contextTimestamp && (Date.now() - data.contextTimestamp) < 2000) {
            console.log('📋 Datos del menú contextual detectados');
            
            // Marcar el checkbox automáticamente
            document.getElementById('addContext').checked = true;
            
            // Actualizar el preview con los datos del contexto
            const contextPreview = document.getElementById('contextPreview');
            if (data.contextSelection) {
                const truncated = data.contextSelection.length > 200 ? 
                    data.contextSelection.substring(0, 200) + '...' : data.contextSelection;
                contextPreview.textContent = truncated;
                console.log('✅ Texto seleccionado cargado desde menú contextual');
            } else if (data.contextUrl) {
                contextPreview.textContent = data.contextUrl;
                console.log('✅ URL cargada desde menú contextual');
            }
            
            // Limpiar los datos para que no se usen de nuevo
            chrome.storage.local.remove(['contextSelection', 'contextUrl', 'contextTimestamp']);
            
            return true;
        }
    } catch (error) {
        console.error('Error verificando datos del menú contextual:', error);
    }
    return false;
}

// Inicializar
document.addEventListener('DOMContentLoaded', async function() {
    await loadUserPreference();
    
    // Verificar si se abrió desde el menú contextual
    const fromContextMenu = await checkContextMenuData();
    
    // Si no es del menú contextual, actualizar el preview normalmente
    if (!fromContextMenu) {
        await updateContextPreview();
    }
    
    // Mostrar prompts frecuentes
    await displayFrequentPrompts();
    
    // Poner el foco en el campo de pregunta
    const askInput = document.getElementById('askInput');
    askInput.focus();
    
    document.querySelectorAll('input[name="aiService"]').forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) saveUserPreference(this.value);
        });
    });

    // Permitir enviar con Ctrl+Enter o Cmd+Enter
    askInput.addEventListener('keydown', function(event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            document.getElementById('yesButton').click();
        }
    });
});

// Botón ASK
document.getElementById('yesButton').addEventListener('click', async function() {
    this.disabled = true;
    
    try {
        const selectedAI = getSelectedAI();
        if (!selectedAI) throw new Error('No hay servicio seleccionado');
        
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        let textPrompt = document.getElementById('askInput').value.trim();
    
        if (textPrompt === "") {
            alert("You have to write a question");
            this.disabled = false;
            return;
        }
        
        // Guardar el prompt original (sin contexto) en el historial
        await savePromptUsage(textPrompt);

        // Agregar contexto si el checkbox está marcado
        const addContext = document.getElementById('addContext').checked;
        if (addContext) {
            try {
                // Primero verificar si hay datos del menú contextual
                const contextData = await chrome.storage.local.get(['contextSelection', 'contextUrl']);
                
                if (contextData.contextSelection) {
                    // Usar el texto seleccionado del menú contextual
                    textPrompt += '\n\n' + contextData.contextSelection;
                    console.log('📋 Usando texto del menú contextual');
                } else if (contextData.contextUrl) {
                    // Usar la URL del menú contextual
                    textPrompt += '\n\n' + contextData.contextUrl;
                    console.log('📋 Usando URL del menú contextual');
                } else {
                    // Si no hay datos del menú contextual, obtener de la página actual
                    const selection = await getSelectedText(currentTab.id);
                    
                    if (selection && selection.trim() !== "") {
                        textPrompt += '\n\n' + selection.trim();
                    } else {
                        // Si no hay texto seleccionado, agregar la URL
                        textPrompt += '\n\n' + currentTab.url;
                    }
                }
            } catch (error) {
                // Si no se puede obtener la selección, solo agregar la URL
                textPrompt += '\n\n' + currentTab.url;
            }
        }

        
        // OJU OSCAR

        //textPrompt = textPrompt + '\n\n';

        if (selectedAI === 'allAI') {
            console.log('📤 Enviando a todas las AI:', textPrompt);
            
            console.log('🔵 Abriendo ChatGPT...');
            const newTabChatgpt = await openCorrectAITab('chatgpt');
            await textToAI(textPrompt, newTabChatgpt);

            console.log('🔵 Abriendo Claude...');
            const newTabClaude = await openCorrectAITab('claude');
            await textToAI(textPrompt, newTabClaude);

            console.log('🔵 Abriendo DeepSeek...');
            const newTabDeepseek = await openCorrectAITab('deepseek');
            await textToAI(textPrompt, newTabDeepseek);

            console.log('🔵 Abriendo Copilot...');
            const newTabCopilot = await openCorrectAITab('copilot');
            await textToAI(textPrompt, newTabCopilot);

            console.log('🔵 Abriendo Gemini...');
            const newTabGemini = await openCorrectAITab('gemini');
            await textToAI(textPrompt, newTabGemini);

            console.log('🔵 Abriendo Grok...');
            const newTabGrok = await openCorrectAITab('grok');
            await textToAI(textPrompt, newTabGrok);

            console.log('🔵 Abriendo Meta...');
            const newTabMeta = await openCorrectAITab('meta');
            await textToAI(textPrompt, newTabMeta);

            console.log('🔵 Abriendo Mistral...');
            const newTabMistral = await openCorrectAITab('mistral');
            await textToAI(textPrompt, newTabMistral);

            console.log('🔵 Abriendo Google...');
            const newTabGoogle = await openCorrectAITab('google');
            await textToAI(textPrompt, newTabGoogle);

            console.log('🔵 Abriendo Perplexity...');
            const newTabPerplexity = await openCorrectAITab('perplexity');
            await textToAI(textPrompt, newTabPerplexity);

            console.log('✅ Completado envío a todas las AI');

        } else {
            if (selectedAI !== 'google' && !isCorrectAIWebsite(currentTab.url, selectedAI)) {
                const newTab = await openCorrectAITab(selectedAI);
                //alert('sidebar newtab')
                await textToAI(textPrompt, newTab);

            } else {
                //alert('sidebar currenttab')
                await textToAI(textPrompt);
            }
        }

        // Limpiar el cuadro de texto después de enviar
        document.getElementById('askInput').value = '';
        
        // Limpiar datos del menú contextual después de usar
        chrome.storage.local.remove(['contextSelection', 'contextUrl', 'contextTimestamp']);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        this.disabled = false;
    }
}); 