export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn("Greška pri spremanju u localStorage:", error);
  }
}

export function loadFromStorage(key, fallback = null) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (error) {
    console.warn("Greška pri čitanju iz localStorage:", error);
    return fallback;
  }
}