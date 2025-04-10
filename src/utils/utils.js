export function renderLoading(
  isLoading,
  button,
  buttonText = "Save",
  loadingText = "Saving..."
) {
  if (isLoading) {
    button.textContent = loadingText;
  } else {
    button.textContent = buttonText;
  }
}

export function handleSubmit(request, evt, loadingText = "Saving...") {
  evt.preventDefault();
  const submitButton = evt.submitter;
  const initialText = submitButton.textContent;

  renderLoading(true, submitButton, initialText, loadingText);

  return request()
    .catch(console.error)
    .finally(() => {
      renderLoading(false, submitButton, initialText);
    });
}
