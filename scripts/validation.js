const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-button",
  inactiveButtonClass: "modal__submit-button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formElement, inputElement, errorMessage) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMessageElement.textContent = errorMessage;
  inputElement.classList.add("modal__input_type_error");
};

const hideInputError = (formElement, inputElement) => {
  const errorMessageElement = formElement.querySelector(
    `#${inputElement.id}-error`
  );
  errorMessageElement.textContent = "";
  inputElement.classList.remove("modal__input_type_error");
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElement) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonElement);
  } else {
    buttonElement.disabled = false;
    //remove disabled class
  }
};

const disableButton = (buttonElement) => {
  buttonElement.disabled = true;
  //add a modifier class to the buttonElement to make it grey
  //Dont forget CSS
};

const resetValidation = (formElement, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formElement, input);
  });
};

const setEventListeners = (formElement) => {
  const inputList = Array.from(formElement.querySelectorAll(".modal__input"));
  const buttonElement = formElement.querySelector(".modal__submit-button");

  toggleButtonState(inputList, buttonElement); // Check button's status on the first page load

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, buttonElement); // Check button's status upon every input change
    });
  });
};

const enableValidation = () => {
  const formList = document.querySelectorAll(".modal__form");
  formList.forEach((formElement) => {
    setEventListeners(formElement);
  });
};

enableValidation();
