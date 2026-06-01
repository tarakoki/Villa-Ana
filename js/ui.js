import { getState } from "./state.js";

const IMG_BASE = "images/";

function imagePath(filename) {
  return IMG_BASE + (filename ?? "placeholder.jpg");
}

function filterSmjestaj(smjestaj, filter, searchQuery) {
  let result = smjestaj ?? [];

  if (filter !== "all") {
    result = result.filter((item) => item.category === filter);
  }

  if (searchQuery) {
    const q = searchQuery.toLowerCase();

    result = result.filter((item) => {
      return (
        item.name?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.details?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q)
      );
    });
  }

  return result;
}

function createCardElement(item) {
  if (!item?.id) return null;

  const { favorites } = getState();
  const isFavorite = favorites.includes(item.id);

  const article = document.createElement("article");
  article.className = "card";
  article.dataset.id = item.id;
  article.tabIndex = 0;
  article.setAttribute("role", "button");
  article.setAttribute("aria-label", `Prikaži detalje za ${item.name}`);

  const title = document.createElement("h2");
  title.textContent = item.name;

  const description = document.createElement("p");
  description.textContent = item.description;

  const imagesWrapper = document.createElement("div");
  imagesWrapper.className = "card-images";

  item.images?.forEach((imageName) => {
    const img = document.createElement("img");
    img.src = imagePath(imageName);
    img.alt = item.name;
    imagesWrapper.append(img);
  });

  const meta = document.createElement("p");
  meta.className = "card-meta";
  meta.textContent = `Kategorija: ${item.category}`;

  const favoriteButton = document.createElement("button");
  favoriteButton.className = "btn btn--ghost fav-btn";
  favoriteButton.dataset.favId = item.id;
  favoriteButton.type = "button";
  favoriteButton.textContent = isFavorite ? "Ukloni iz favorita" : "Dodaj u favorite";

  article.append(title, description, imagesWrapper, meta, favoriteButton);

  return article;
}

function buildDetailNodes(item) {
  const heading = document.createElement("h1");
  heading.id = "smjestaj-detail-heading";
  heading.tabIndex = -1;
  heading.textContent = item.name;

  const description = document.createElement("p");
  description.className = "detail-description";
  description.textContent = item.details ?? item.description;

  const imagesWrapper = document.createElement("div");
  imagesWrapper.className = "detail-images";

  item.images?.forEach((imageName) => {
    const img = document.createElement("img");
    img.src = imagePath(imageName);
    img.alt = item.name;
    imagesWrapper.append(img);
  });

  const meta = document.createElement("ul");
  meta.className = "detail-meta";

  const metaItems = [
    ["Kategorija", item.category],
    ["Kapacitet", item.capacity],
    ["Dostupnost", item.availability]
  ];

  metaItems.forEach(([label, value]) => {
    const li = document.createElement("li");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    li.append(strong, document.createTextNode(value ?? ""));

    meta.append(li);
  });

  return { heading, description, imagesWrapper, meta };
}

let lastView = "list";
let lastFocusedCardId = null;

function focusCard(id) {
  const card = document.querySelector(`.card[data-id="${id}"]`);

  if (card) {
    card.focus();
  }
}

export function renderStatus() {
  const loadingEl = document.querySelector("#status-loading");
  const errorEl = document.querySelector("#status-error");
  const gridEl = document.querySelector("#smjestaj-grid");

  if (!loadingEl || !errorEl) return;

  const { loading, error } = getState();

  loadingEl.hidden = !loading;
  errorEl.hidden = !error;

  if (error) {
    const errorText = errorEl.querySelector("p");
    if (errorText) {
      errorText.textContent = error;
    }
  }

  if (gridEl) {
    gridEl.setAttribute("aria-busy", loading ? "true" : "false");
  }
}

export function renderSmjestaj() {
  const gridEl = document.querySelector("#smjestaj-grid");
  if (!gridEl) return;

  try {
    const { smjestaj, filter, searchQuery, loading, error } = getState();
    const emptyEl = document.querySelector("#status-empty");

    if (loading || error) {
      gridEl.replaceChildren();

      if (emptyEl) {
        emptyEl.hidden = true;
      }

      return;
    }

    const result = filterSmjestaj(smjestaj, filter, searchQuery);

    gridEl.replaceChildren();

    result.forEach((item) => {
      const card = createCardElement(item);

      if (card) {
        gridEl.append(card);
      }
    });

    if (emptyEl) {
      emptyEl.hidden = result.length > 0;
    }
  } catch (error) {
    console.warn("Greška pri renderiranju smještaja:", error);
  }
}

export function renderView() {
  const listEl = document.querySelector("#view-list");
  const detailEl = document.querySelector("#view-detail");

  if (!listEl || !detailEl) return;

  const { view, selectedSmjestajId, smjestaj } = getState();

  const isDetail = view === "detail";
  const viewChanged = view !== lastView;

  listEl.hidden = isDetail;
  detailEl.hidden = !isDetail;

  document.querySelectorAll('[data-view="list"]').forEach((el) => {
    el.hidden = isDetail;
  });

  if (viewChanged && !isDetail) {
    focusCard(lastFocusedCardId);
  }

  if (isDetail && viewChanged) {
    lastFocusedCardId = selectedSmjestajId;
  }

  lastView = view;

  if (!isDetail) return;

  const contentEl = document.querySelector("#smjestaj-detail-content");

  if (!contentEl) return;

  const selectedItem = smjestaj.find((item) => item.id === selectedSmjestajId);

  if (!selectedItem) {
    const message = document.createElement("p");
    message.textContent = "Smještaj nije pronađen.";
    contentEl.replaceChildren(message);
    return;
  }

  const { heading, description, imagesWrapper, meta } = buildDetailNodes(selectedItem);

  contentEl.replaceChildren(heading, description, imagesWrapper, meta);

  if (viewChanged) {
    heading.focus();
  }
}