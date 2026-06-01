import { setState, getState } from "./state.js";
import { saveToStorage, loadFromStorage } from "./storage.js";
import { debounce } from "./utils.js";

function goToDetail(id) {
  setState({
    view: "detail",
    selectedSmjestajId: id
  });
}

function goToList() {
  setState({
    view: "list",
    selectedSmjestajId: null
  });
}

function toggleFavorite(id) {
  const { favorites } = getState();

  const updatedFavorites = favorites.includes(id)
    ? favorites.filter((favoriteId) => favoriteId !== id)
    : [...favorites, id];

  setState({
    favorites: updatedFavorites
  });

  saveToStorage("villaAnaFavorites", updatedFavorites);
}

function initFilterButtons() {
  const filterButtons = document.querySelectorAll(".filter-bar button");

  if (!filterButtons.length) return;

  const savedFilter = getState().filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === savedFilter;

    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");

    button.addEventListener("click", () => {
      filterButtons.forEach((btn) => {
        btn.classList.remove("active");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");

      const filter = button.dataset.filter;

      setState({
        filter,
        view: "list",
        selectedSmjestajId: null
      });

      saveToStorage("villaAnaLastFilter", filter);
    });
  });
}

function initCardDelegation() {
  const gridEl = document.querySelector("#smjestaj-grid");

  if (!gridEl) return;

  gridEl.addEventListener("click", (event) => {
    if (event.target.matches("button[data-fav-id]")) {
      const id = Number(event.target.dataset.favId);

      if (id) {
        toggleFavorite(id);
      }

      return;
    }

    const card = event.target.closest(".card");

    if (!card) return;

    const id = Number(card.dataset.id);

    if (id) {
      goToDetail(id);
    }
  });

  gridEl.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    if (event.target.matches("button")) return;

    const card = event.target.closest(".card");

    if (!card) return;

    event.preventDefault();

    const id = Number(card.dataset.id);

    if (id) {
      goToDetail(id);
    }
  });
}

function initBackButton() {
  const backButton = document.querySelector("#back-btn");

  if (!backButton) return;

  backButton.addEventListener("click", goToList);
}

function initEscapeHandler() {
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;

    if (getState().view !== "detail") return;

    goToList();
  });
}

function initSearchInput() {
  const searchInput = document.querySelector("#search-input");

  if (!searchInput) return;

  const handler = debounce((value) => {
    setState({
      searchQuery: value.trim(),
      view: "list",
      selectedSmjestajId: null
    });
  }, 250);

  searchInput.addEventListener("input", (event) => {
    handler(event.target.value);
  });
}

function showFormError(form, msgError, text, focusSelector) {
  const paragraph = msgError.querySelector("p");

  if (paragraph) {
    paragraph.textContent = text;
  }

  msgError.hidden = false;

  const field = form.querySelector(focusSelector);

  if (field) {
    field.focus();
  }
}

function initContactForm() {
  const form = document.querySelector("#contact-form");

  if (!form) return;

  const msgSuccess = form.querySelector(".form-message--success");
  const msgError = form.querySelector(".form-message--error");
  const submitButton = form.querySelector('button[type="submit"]');

  const savedInquiry = loadFromStorage("villaAnaLastInquiry", null);

  if (savedInquiry) {
    const nameEl = form.querySelector("#name");
    const emailEl = form.querySelector("#email");
    const phoneEl = form.querySelector("#phone");

    if (nameEl) nameEl.value = savedInquiry.name ?? "";
    if (emailEl) emailEl.value = savedInquiry.email ?? "";
    if (phoneEl) phoneEl.value = savedInquiry.phone ?? "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const phone = form.querySelector("#phone").value.trim();
    const checkin = form.querySelector("#checkin").value;
    const guests = form.querySelector("#guests").value;
    const message = form.querySelector("#message").value.trim();

    msgSuccess.hidden = true;
    msgError.hidden = true;

    if (!name) {
      showFormError(form, msgError, "Molimo unesite ime i prezime.", "#name");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      showFormError(form, msgError, "Unesite valjanu email adresu.", "#email");
      return;
    }

    if (!guests || Number(guests) < 1) {
      showFormError(form, msgError, "Unesite broj gostiju.", "#guests");
      return;
    }

    if (message.length < 10) {
      showFormError(form, msgError, "Poruka mora sadržavati najmanje 10 znakova.", "#message");
      return;
    }

    const inquiry = {
      name,
      email,
      phone,
      checkin,
      guests,
      message,
      createdAt: new Date().toISOString()
    };

    saveToStorage("villaAnaLastInquiry", inquiry);

    submitButton.disabled = true;
    submitButton.textContent = "Slanje...";

    setTimeout(() => {
      msgSuccess.hidden = false;
      form.reset();

      submitButton.disabled = false;
      submitButton.textContent = "Pošalji upit";
    }, 700);
  });
}

function initRetryButton(onRetry) {
  const retryButton = document.querySelector("#retry-btn");

  if (!retryButton || typeof onRetry !== "function") return;

  retryButton.addEventListener("click", () => {
    onRetry();
  });
}

export function setupEventListeners({ onRetry } = {}) {
  initFilterButtons();
  initCardDelegation();
  initBackButton();
  initEscapeHandler();
  initSearchInput();
  initContactForm();
  initRetryButton(onRetry);
}