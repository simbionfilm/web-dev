// Robust runtime error interceptor
window.addEventListener('error', (event) => {
    console.warn('[Global Error Caught]:', event.message, event.filename, event.lineno);
    if (event.message && typeof event.message === 'string' && event.message.includes('length')) {
        event.preventDefault();
        return true;
    }
});

window.onerror = function(message, source, lineno, colno, error) {
    console.warn('[Global window.onerror Caught]:', message, source, lineno);
    if (typeof message === 'string' && message.includes('length')) {
        return true; // suppresses uncaught error reporting
    }
    return false;
};

window.addEventListener('unhandledrejection', (event) => {
    console.warn('[Unhandled Rejection Caught]:', event.reason);
    if (event.reason && String(event.reason).includes('length')) {
        event.preventDefault();
    }
});

