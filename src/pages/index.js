import "./index.css"; // Importing the CSS file
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js"; // Importing validation functions
import Api from "../utils/Api.js"; // Importing the API class

// Importing images and other assets
import logoPath from "../images/logo.svg";
import avatarPath from "../images/avatar.jpg";
import editButtonPath from "../images/editbtn.svg";
import addButtonPath from "../images/addbtn.svg";
import editLightButtonPath from "../images/editbtn-light.svg";

document.querySelector(".header__logo").src = logoPath;
document.querySelector(".profile__avatar").src = avatarPath;
document.querySelector(".profile__edit-button img").src = editButtonPath;
document.querySelector(".profile__add-button img").src = addButtonPath;
document.querySelector(".profile__pencilIcon").src = editLightButtonPath;

// Initial Cards
/* const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant Terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
]; */

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "f1f1dbab-8e17-48d3-a098-d77dfd6ea3c5",
    "Content-Type": "application/json",
  },
});

api
  .getInitialCards()
  .then((cards) => {
    // Render Initial Cards
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch(console.error);

// Profile Selectors
const editModalButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Modal Selectors
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal__close-button");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal.querySelector("#delete-form");
const cancelDeleteButton = deleteModal.querySelector(".modal__cancel-button");

// Modal - Edit Profile
const editModal = document.querySelector("#edit-modal");
const editForm = editModal.querySelector(".modal__form");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

// Modal - Add Card
const cardModal = document.querySelector("#new-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitButton = cardModal.querySelector(".modal__submit-button");
const cardLinkInput = cardModal.querySelector("#new-card-link-input");
const cardCaptionInput = cardModal.querySelector("#new-card-caption-input");

// Modal Preview
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal.querySelector(".modal__image");
const previewCaption = previewModal.querySelector(".modal__caption");

// Cards
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  cardTitle.textContent = data.name;
  cardImage.alt = data.name;
  cardImage.src = data.link;

  cardLikeButton.addEventListener("click", () => {
    cardLikeButton.classList.toggle("card__like-button_liked");
  });

  cardDeleteButton.addEventListener("click", () => {
    openModal(deleteModal);
    // Store the card element to be deleted
    deleteForm._cardToDelete = cardElement;
  });

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    previewCaption.textContent = data.name;
    previewImage.alt = data.name;
    previewImage.src = data.link;
  });

  return cardElement;
}

function openModal(modal) {
  modal.classList.add("modal_opened");

  document.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKeyPress);

  modal._handleOverlayClick = handleOverlayClick;
  modal._handleEscapeKeyPress = handleEscapeKeyPress;

  function handleOverlayClick(event) {
    if (event.target.classList.contains("modal_opened")) {
      closeModal(modal);
    }
  }

  function handleEscapeKeyPress(event) {
    if (event.key === "Escape") {
      closeModal(modal);
    }
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  document.removeEventListener("click", modal._handleOverlayClick);
  document.removeEventListener("keydown", modal._handleEscapeKeyPress);
}

// Universal Close Button Handler
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

// Handlers
function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDescription.textContent = editModalDescriptionInput.value;
  closeModal(editModal);
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();

  // Validate image URL before adding
  const imageURL = cardLinkInput.value;
  const inputValues = {
    name: cardCaptionInput.value,
    link: imageURL,
  };

  function disableButton(buttonElement, settings) {
    buttonElement.disabled = true; // or any custom logic based on settings
  }

  const img = new Image();
  img.src = imageURL;
  img.onload = () => {
    const cardElement = getCardElement(inputValues);
    cardsList.prepend(cardElement);
    evt.target.reset(); // Clear the form inputs after submission
    disableButton(cardSubmitButton, settings);
    closeModal(cardModal);
  };
  img.onerror = () => alert("Invalid image URL. Please check your input.");
}

// Edit Modal Listeners
editModalButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editForm,
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

// Card Modal Listeners
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

// Form Listeners
editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  deleteForm._cardToDelete.remove();
  closeModal(deleteModal);
});
cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

enableValidation(settings);
