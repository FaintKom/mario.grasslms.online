// Хранилище данных тренажера
let explorerData = null;

// Слушатель сообщений от iframe
window.addEventListener('message', function(event) {
    if (event.data.type === 'explorerSave') {
        explorerData = event.data.data;
        // Опционально: сохранить на сервер
    } else if (event.data.type === 'explorerLoad') {
        event.source.postMessage({
            type: 'explorerData',
            data: explorerData
        }, '*');
    }
});
