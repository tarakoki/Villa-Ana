import { fetchSmjestaj } from "./data.js";
import { setState, getState } from "./state.js";
import { setupEventListeners } from "./events.js";
import { loadFromStorage } from "./storage.js";

const MAX_RETRIES = 2;

export async function loadSmjestaj(attempt = 1) {
  if (attempt === 1 && getState().loading) return;

  setState({
    loading: true,
    error: null
  });

  try {
    const smjestaj = await fetchSmjestaj();

    setState({
      smjestaj,
      loading: false
    });
  } catch (error) {
    console.error(`Greška pri dohvaćanju smještaja, pokušaj ${attempt}:`, error);

    if (attempt < MAX_RETRIES) {
      const backoff = 400 * attempt;

      setTimeout(() => {
        loadSmjestaj(attempt + 1);
      }, backoff);

      return;
    }

    setState({
      loading: false,
      error: "Smještaj trenutno nije dostupan. Pokušajte ponovno."
    });
  }
}

async function init() {
  const favorites = loadFromStorage("villaAnaFavorites", []);
  const lastFilter = loadFromStorage("villaAnaLastFilter", "all");

  setState({
    favorites,
    filter: lastFilter
  });

  setupEventListeners({
    onRetry: () => loadSmjestaj()
  });

  const hasSmjestajGrid = document.querySelector("#smjestaj-grid");

  if (hasSmjestajGrid) {
    await loadSmjestaj();
  }
}

document.addEventListener("DOMContentLoaded", init);