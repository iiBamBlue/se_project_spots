import "./index.css"; // Importing the CSS file
import {
  enableValidation,
  settings,
  resetValidation,
} from "../scripts/validation.js"; // Importing validation functions
import Api from "../utils/Api.js"; // Importing the API class
import { handleSubmit, renderLoading } from "../utils/utils.js"; // Importing utility functions
import { handleApiError } from "../utils/errorHandler.js"; // Importing error handler
import { config } from "../utils/config.js"; // Importing configuration

// Importing images and other assets
import logoPath from "../images/logo.svg";
import avatarPath from "../images/avatar.jpg";
import editButtonPath from "../images/editbtn.svg";
import addButtonPath from "../images/addbtn.svg";
import editLightButtonPath from "../images/editbtn-light.svg";

// Set image sources with null checks
const headerLogo = document.querySelector(".header__logo");
const profileAvatar = document.querySelector(".profile__avatar");
const editButtonImg = document.querySelector(".profile__edit-button img");
const addButtonImg = document.querySelector(".profile__add-button img");
const pencilIcon = document.querySelector(".profile__pencilIcon");

if (headerLogo) headerLogo.src = logoPath;
if (profileAvatar) profileAvatar.src = avatarPath;
if (editButtonImg) editButtonImg.src = editButtonPath;
if (addButtonImg) addButtonImg.src = addButtonPath;
if (pencilIcon) pencilIcon.src = editLightButtonPath;

const api = new Api({
  baseUrl: config.apiBaseUrl,
  headers: {
    authorization: config.apiToken,
    "Content-Type": "application/json",
  },
});

let userId;

api
  .getUserInfo()
  .then((userData) => {
    userId = userData._id;
    if (profileName) profileName.textContent = userData.name;
    if (profileDescription) profileDescription.textContent = userData.about;
    if (profileAvatarElement) profileAvatarElement.src = userData.avatar;
    return api.getInitialCards();
  })
  .then((cards) => {
    cards.forEach((card) => {
      const cardElement = getCardElement(card);
      cardsList.append(cardElement);
    });
  })
  .catch(handleApiError);

// Profile Selectors with null checks
const editModalButton = document.querySelector(".profile__edit-button");
const cardModalButton = document.querySelector(".profile__add-button");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Modal Selectors with null checks
const closeButtons = document.querySelectorAll(".modal__close-button");
const deleteModal = document.querySelector("#delete-modal");
const deleteForm = deleteModal?.querySelector("#delete-form");
const cancelDeleteButton = deleteModal?.querySelector(".modal__cancel-button");
const avatarEditButton = document.querySelector(".profile__avatar-button");
const avatarModal = document.querySelector("#new-avatar-modal");
const avatarForm = avatarModal?.querySelector(".modal__form");
const avatarLinkInput = avatarModal?.querySelector("#new-avatar-link-input");
const profileAvatarElement = document.querySelector(".profile__avatar");

// Modal - Edit Profile
const editModal = document.querySelector("#edit-modal");
const editForm = editModal?.querySelector(".modal__form");
const editModalNameInput = editModal?.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal?.querySelector(
  "#profile-description-input"
);

// Modal - Add Card
const cardModal = document.querySelector("#new-card-modal");
const cardForm = cardModal?.querySelector(".modal__form");
const cardLinkInput = cardModal?.querySelector("#new-card-link-input");
const cardCaptionInput = cardModal?.querySelector("#new-card-caption-input");

// Modal Preview
const previewModal = document.querySelector("#preview-modal");
const previewImage = previewModal?.querySelector(".modal__image");
const previewCaption = previewModal?.querySelector(".modal__caption");

// Cards
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  cardElement._id = data._id;

  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardLikeCount = cardElement.querySelector(".card__like-count");
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");

  // Set card data
  cardTitle.textContent = data.name;
  cardImage.src = data.link; // Make sure this line is present
  cardImage.alt = data.name;

  // Set initial like state and count
  if (data.isLiked) {
    cardLikeButton.classList.add("card__like-button_liked");
    cardLikeCount.textContent = "1"; // Set to 1 if the card is liked
  } else {
    cardLikeCount.textContent = "0"; // Set to 0 if the card is not liked
  }

  cardLikeButton.addEventListener("click", () => {
    const isCurrentlyLiked = cardLikeButton.classList.contains(
      "card__like-button_liked"
    );

    const likeCardPromise = isCurrentlyLiked
      ? api.dislikeCard(data._id)
      : api.likeCard(data._id);

    likeCardPromise
      .then((updatedCard) => {
        cardLikeButton.classList.toggle(
          "card__like-button_liked",
          updatedCard.isLiked
        );
        cardLikeCount.textContent = updatedCard.isLiked ? "1" : "0";
      })
      .catch((error) => {
        handleApiError(error);
      });
  });

  // delete and preview event listeners
  cardDeleteButton.addEventListener("click", () => {
    openModal(deleteModal);
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

  // Remove existing listeners to prevent duplicates
  if (modal._handleOverlayClick) {
    document.removeEventListener("click", modal._handleOverlayClick);
  }
  if (modal._handleEscapeKeyPress) {
    document.removeEventListener("keydown", modal._handleEscapeKeyPress);
  }

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

  // Store references and add new listeners
  modal._handleOverlayClick = handleOverlayClick;
  modal._handleEscapeKeyPress = handleEscapeKeyPress;
  
  document.addEventListener("click", handleOverlayClick);
  document.addEventListener("keydown", handleEscapeKeyPress);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");

  document.removeEventListener("click", modal._handleOverlayClick);
  document.removeEventListener("keydown", modal._handleEscapeKeyPress);
}

// function renderLoading(
// isLoading,
// button,
// buttonText = "Save",
// loadingText = "Saving..."
// ) {
// button.textContent = isLoading ? loadingText : buttonText;
// }

// Universal Close Button Handler
closeButtons.forEach((button) => {
  const modal = button.closest(".modal");
  button.addEventListener("click", () => closeModal(modal));
});

// Handlers
function makeEditProfileRequest() {
  // Get form values
  const name = editModalNameInput.value;
  const about = editModalDescriptionInput.value;

  // Make API call to edit user info
  return api.editUserInfo({ name, about }).then((userData) => {
    // Update the DOM with the new user data
    profileName.textContent = userData.name;
    profileDescription.textContent = userData.about;
    // Close the modal
    closeModal(editModal);
  });
}

function handleEditFormSubmit(evt) {
  handleSubmit(makeEditProfileRequest, evt, "Saving...");
}

function handleCardFormSubmit(evt) {
  evt.preventDefault();
  const submitButton = cardForm.querySelector(".modal__submit-button");
  renderLoading(true, submitButton);

  api
    .addCard({
      name: cardCaptionInput.value,
      link: cardLinkInput.value,
    })
    .then((cardData) => {
      const cardElement = getCardElement(cardData);
      cardsList.prepend(cardElement);
      evt.target.reset();
      closeModal(cardModal);
    })
    .catch(handleApiError)
    .finally(() => {
      renderLoading(false, submitButton);
    });
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

// Avatar Modal Listener
avatarEditButton.addEventListener("click", () => {
  openModal(avatarModal);
});

// Card Modal Listeners
cardModalButton.addEventListener("click", () => {
  openModal(cardModal);
});

cancelDeleteButton.addEventListener("click", () => {
  closeModal(deleteModal);
});

// Form Listeners
editForm.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);

deleteForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = deleteForm.querySelector(".modal__submit-button");
  renderLoading(true, submitButton, "Delete", "Deleting...");

  api
    .removeCard(deleteForm._cardToDelete._id)
    .then(() => {
      deleteForm._cardToDelete.remove();
      closeModal(deleteModal);
    })
    .catch(handleApiError)
    .finally(() => {
      renderLoading(false, submitButton, "Delete");
    });
});

// Avatar Form Submit Handler
avatarForm.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector(".modal__submit-button");
  renderLoading(true, submitButton);

  api
    .updateAvatar({
      avatar: avatarLinkInput.value,
    })
    .then((userData) => {
      profileAvatar.src = userData.avatar;
      evt.target.reset();
      closeModal(avatarModal);
    })
    .catch(handleApiError)
    .finally(() => {
      renderLoading(false, submitButton);
    });
});

enableValidation(settings);
