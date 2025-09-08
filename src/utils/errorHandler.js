// Error handler utility for user-facing error messages

export function showErrorMessage(message, duration = 5000) {
  // Create error notification element
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-notification';
  errorDiv.textContent = message;
  errorDiv.setAttribute('role', 'alert');
  errorDiv.setAttribute('aria-live', 'polite');
  
  // Add to DOM
  document.body.appendChild(errorDiv);
  
  // Auto-remove after duration
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, duration);
  
  return errorDiv;
}

export function handleApiError(error) {
  let userMessage = 'Something went wrong. Please try again.';
  
  // Parse different error types
  if (typeof error === 'string' && error.includes('Error: ')) {
    const statusCode = error.match(/Error: (\d+)/)?.[1];
    
    switch (statusCode) {
      case '400':
        userMessage = 'Invalid request. Please check your input.';
        break;
      case '401':
        userMessage = 'Authentication failed. Please refresh and try again.';
        break;
      case '403':
        userMessage = 'You do not have permission to perform this action.';
        break;
      case '404':
        userMessage = 'The requested resource was not found.';
        break;
      case '500':
        userMessage = 'Server error. Please try again later.';
        break;
      default:
        userMessage = `Request failed (${statusCode}). Please try again.`;
    }
  } else if (error instanceof TypeError) {
    userMessage = 'Network error. Please check your connection.';
  }
  
  // Log technical error for debugging
  console.error('API Error:', error);
  
  // Show user-friendly message
  showErrorMessage(userMessage);
  
  return userMessage;
}