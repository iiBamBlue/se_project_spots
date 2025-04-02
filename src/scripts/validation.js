export const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error",
};

// Utility for logging errors
const logError = (message) => {
  console.error(`Validation Error: ${message}`);
};

// Show input error message
const showInputError = (formElement, inputElement, errorMessage, config) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );

  if (!errorMessageElement) {
    logError(`Error message element for input ${inputElement.id} not found.`);
    return;
  }

  errorMessageElement.textContent = errorMessage;
  errorMessageElement.setAttribute("role", "alert"); // Accessibility enhancement
  inputElement.classList.add(config.inputErrorClass);
};

// Hide input error message
const hideInputError = (formElement, inputElement, config) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );

  if (!errorMessageElement) {
    logError(`Error message element for input ${inputElement.id} not found.`);
    return;
  }

  errorMessageElement.textContent = "";
  errorMessageElement.removeAttribute("role");
  inputElement.classList.remove(config.inputErrorClass);
};

// Check input validity
const checkInputValidity = (formElement, inputElement, config) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      config
    );
  } else {
    hideInputError(formElement, inputElement, config);
  }
};

// Check if form has invalid input
const hasInvalidInput = (inputList) => {
  return inputList.some((input) => !input.validity.valid);
};

// Toggle button state
const toggleButtonState = (inputList, buttonElement, config) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement, config);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(config.inactiveButtonClass);
  }
};

// Disable button
const disableButton = (buttonElement, config) => {
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
};

// Reset validation
export const resetValidation = (formElement, inputList, config) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input, config);
  });

  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  disableButton(buttonElement, config); // Disable the button during reset
};

// Add event listeners to the form
const setEventListeners = (formElement, config) => {
  const inputList = Array.from(
    formElement.querySelectorAll(config.inputSelector)
  );
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config); // Initial button state check

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config); // Update button state on input
    });
  });
};

// Enable validation for all forms
export const enableValidation = (config) => {
  const formList = document.querySelectorAll(config.formSelector);

  formList.forEach((formElement) => {
    const inputList = Array.from(
      formElement.querySelectorAll(config.inputSelector)
    );
    setEventListeners(formElement, config);

    // Clear validation on form reset
    formElement.addEventListener("reset", () => {
      resetValidation(formElement, inputList, config);
    });
  });
};
