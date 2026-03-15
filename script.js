// Get DOM elements
const sourceText = document.getElementById('sourceText');
const targetText = document.getElementById('targetText');
const sourceLanguage = document.getElementById('sourceLanguage');
const targetLanguage = document.getElementById('targetLanguage');
const translateBtn = document.getElementById('translateBtn');
const charCount = document.getElementById('charCount');
const swapBtn = document.getElementById('swapLanguages');
const speakSource = document.getElementById('speakSource');
const speakTarget = document.getElementById('speakTarget');
const copySource = document.getElementById('copySource');
const copyTarget = document.getElementById('copyTarget');

// Character counter
sourceText.addEventListener('input', function() {
    const length = sourceText.value.length;
    charCount.textContent = length;
});

// Translate function
async function translateText() {
    const text = sourceText.value.trim();
    
    if (!text) {
        return;
    }
    
    translateBtn.textContent = 'Translating...';
    translateBtn.disabled = true;
    
    const source = sourceLanguage.value;
    const target = targetLanguage.value;
    
    // Handle detect language
    const langpair = source === 'auto' ? `en|${target}` : `${source}|${target}`;
    
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${encodeURIComponent(langpair)}`
        );
        const data = await response.json();
        
        if (data.responseData?.translatedText) {
            targetText.value = data.responseData.translatedText;
        }
    } catch (error) {
        console.error('Translation error:', error);
    } finally {
        translateBtn.textContent = 'Translate';
        translateBtn.disabled = false;
    }
}

// Swap languages
swapBtn.addEventListener('click', function() {
    const sourceLang = sourceLanguage.value;
    const targetLang = targetLanguage.value;
    
    sourceLanguage.value = targetLang;
    targetLanguage.value = sourceLang;
    
    const sourceVal = sourceText.value;
    const targetVal = targetText.value;
    
    sourceText.value = targetVal;
    targetText.value = sourceVal;
    
    charCount.textContent = sourceText.value.length;
});

// Copy functions
copySource.addEventListener('click', function() {
    sourceText.select();
    document.execCommand('copy');
});

copyTarget.addEventListener('click', function() {
    targetText.select();
    document.execCommand('copy');
});

// Text to speech
speakSource.addEventListener('click', function() {
    if (sourceText.value) {
        const utterance = new SpeechSynthesisUtterance(sourceText.value);
        utterance.lang = sourceLanguage.value === 'fr' ? 'fr-FR' : 'en-US';
        window.speechSynthesis.speak(utterance);
    }
});

speakTarget.addEventListener('click', function() {
    if (targetText.value) {
        const utterance = new SpeechSynthesisUtterance(targetText.value);
        utterance.lang = targetLanguage.value === 'fr' ? 'fr-FR' : 'en-US';
        window.speechSynthesis.speak(utterance);
    }
});

// Translate button click
translateBtn.addEventListener('click', translateText);

// Auto translate on typing (debounced)
let debounceTimer;
sourceText.addEventListener('input', function() {
    charCount.textContent = sourceText.value.length;
    
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        if (sourceText.value.trim()) {
            translateText();
        }
    }, 800);
});

// Initialize on load
window.addEventListener('load', function() {
    sourceText.value = 'Hello, how are you';
    targetText.value = 'Bonjour, comment allez-vous';
    charCount.textContent = sourceText.value.length;
});