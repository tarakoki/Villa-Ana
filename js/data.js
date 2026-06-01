const dataBase = "data/";

export async function fetchSmjestaj() {
  const response = await fetch(dataBase + "smjestaj.json");

  if (!response.ok) {
    throw new Error(`HTTP greška: ${response.status}`);
  }

  return await response.json();
}

export const categories = [
  { value: "all", label: "Sve" },
  { value: "interijer", label: "Interijer" },
  { value: "eksterijer", label: "Eksterijer" }
];