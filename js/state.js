import { renderSmjestaj, renderStatus, renderView } from "./ui.js";

const state = {
  smjestaj: [],
  filter: "all",
  searchQuery: "",
  favorites: [],
  loading: false,
  error: null,
  view: "list",
  selectedSmjestajId: null
};

export function setState(newState) {
  if (!newState || typeof newState !== "object") return;

  try {
    Object.assign(state, newState);

    renderStatus();
    renderSmjestaj();
    renderView();
  } catch (error) {
    console.warn("setState greška:", error);
  }
}

export function getState() {
  return state;
}