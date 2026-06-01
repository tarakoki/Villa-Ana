# Villa Ana

**Villa Ana** je web stranica za prikaz privatnog smještaja namijenjenog odmoru, opuštanju i boravku većeg broja gostiju. Projekt je izrađen u sklopu kolegija **Uvod u web tehnologije**.

Stranica je prvo bila izrađena pomoću HTML-a i CSS-a, a zatim je nadograđena JavaScriptom. JavaScript se koristi tamo gdje ima najviše smisla: na stranici **Smještaj** za dinamički prikaz sadržaja te na stranici **Kontakt** za obradu i validaciju forme.

## Stranice projekta

Projekt se sastoji od četiri povezane stranice:

```txt
index.html
├── početna stranica
├── hero sekcija
├── kratak uvod o smještaju
└── izdvojene slike ville

smjestaj.html
├── prikaz smještaja i prostora ville
├── pretraga sadržaja
├── filteri Interijer i Eksterijer
├── detaljni prikaz odabranog prostora
└── tablica s pregledom sadržaja

o-nama.html
├── priča o Villi Ana
├── opis onoga što villa nudi
└── lokacija prikazana pomoću Google karte

kontakt.html
├── galerija slika
├── kontakt forma za upit
└── osnovne informacije o smještaju
```

## Struktura projekta

```txt
/
├── index.html
├── smjestaj.html
├── o-nama.html
├── kontakt.html
├── style.css
├── README.md
│
├── js/
│   ├── main.js
│   ├── data.js
│   ├── state.js
│   ├── ui.js
│   ├── events.js
│   ├── storage.js
│   └── utils.js
│
├── data/
│   └── smjestaj.json
│
└── images/
    ├── slike početne stranice
    ├── slike smještaja
    ├── slike kontakt stranice
    └── ostale slike
```

## Korištene tehnologije

* **HTML5** za strukturu stranica
* **CSS3** za dizajn, raspored elemenata i responzivnost
* **JavaScript** za interaktivnost
* **ES modules** za organizaciju JavaScript koda u više datoteka
* **Fetch API** za dohvat podataka iz JSON datoteke
* **localStorage** za spremanje korisnikovog odabira i zadnjeg upita

## JavaScript funkcionalnosti

Na stranici **Smještaj** kartice se više ne pišu ručno u HTML-u, nego se podaci učitavaju iz datoteke `data/smjestaj.json`.

Dodane su sljedeće funkcionalnosti:

* dinamičko prikazivanje kartica smještaja
* pretraga smještaja po nazivu i opisu
* filtriranje po kategorijama **Interijer** i **Eksterijer**
* klik na karticu otvara detaljni prikaz
* gumb za povratak vraća korisnika na listu
* tipka `ESC` zatvara detaljni prikaz
* mogućnost spremanja odabira
* spremanje odabira u `localStorage`
* prikaz loading, error i empty stanja

Podaci u `smjestaj.json` uključuju prostore koji su već postojali u originalnom HTML/CSS projektu:

* Spavaće sobe
* Bazen i dvorište
* Dnevna soba i blagovanje

Za svaki prostor koriste se iste slike koje su bile u početnom kodu projekta.

## Kontakt forma

Na stranici **Kontakt** forma je nadograđena JavaScriptom.

Forma se šalje bez osvježavanja stranice. Prije slanja provjerava se jesu li uneseni potrebni podaci:

* ime i prezime
* ispravna email adresa
* broj gostiju
* poruka od najmanje 10 znakova

Ako neki podatak nije ispravan, korisniku se prikazuje poruka o grešci. Ako je forma ispravno ispunjena, prikazuje se poruka o uspješnom slanju, a zadnji upit sprema se u `localStorage`.

## Organizacija JavaScript datoteka

JavaScript kod podijeljen je u više datoteka kako bi bio pregledniji:

| Datoteka     | Uloga                                                  |
| ------------ | ------------------------------------------------------ |
| `main.js`    | Pokreće aplikaciju i učitava početne podatke           |
| `data.js`    | Dohvaća podatke iz `smjestaj.json`                     |
| `state.js`   | Čuva trenutno stanje aplikacije                        |
| `ui.js`      | Stvara i prikazuje HTML elemente preko JavaScripta     |
| `events.js`  | Postavlja event listenere za klikove, pretragu i formu |
| `storage.js` | Sprema i čita podatke iz `localStorage`                |
| `utils.js`   | Sadrži pomoćne funkcije, npr. `debounce` za pretragu   |

Osnovni tok rada aplikacije:

```txt
korisnik napravi akciju → event listener → promjena state-a → ponovno renderiranje prikaza
```

## Dizajn i responzivnost

Stranica koristi jednostavan i čist dizajn s naglaskom na slike smještaja. Korištene su neutralne boje, kartice, galerije i zaobljeni elementi kako bi stranica izgledala ugodno i pregledno.

Projekt je responzivan i prilagođen različitim veličinama ekrana:

* na većim ekranima sadržaj se prikazuje u grid rasporedu
* na manjim ekranima kartice i slike prikazuju se jedna ispod druge
* navigacija se na mobilnim uređajima prikazuje kao hamburger meni
* forma i slike prilagođavaju se širini ekrana

## Pokretanje projekta

Zbog korištenja `fetch()` metode za dohvat lokalne JSON datoteke, projekt je potrebno pokrenuti preko lokalnog servera.

Najjednostavnije je koristiti **Live Server** u Visual Studio Codeu.

Moguće je koristiti i Python server:

```bash
python -m http.server 8000
```

Nakon toga stranica se otvara u pregledniku na:

```txt
http://localhost:8000
```

## Što je nadodano u JavaScript dijelu projekta

U odnosu na početnu HTML/CSS verziju, nadodano je:

* mapa `js/` s modularnim JavaScript datotekama
* mapa `data/` s datotekom `smjestaj.json`
* dinamički prikaz smještaja
* pretraga
* filteri
* detaljni prikaz kartice
* spremanje odabira u `localStorage`
* validacija kontakt forme
* spremanje zadnjeg kontakt upita
* loading, error i empty poruke

## Provjera prije predaje

* [x] Sve HTML stranice su povezane
* [x] Navigacija radi na svim stranicama
* [x] Početna stranica se pravilno prikazuje
* [x] Stranica O nama se pravilno prikazuje
* [x] Smještaj se učitava iz JSON datoteke
* [x] Filteri Interijer i Eksterijer rade
* [x] Pretraga radi
* [x] Klik na karticu otvara detalje
* [x] Gumb za povratak radi
* [x] Kontakt forma se šalje bez reloada
* [x] Validacija forme radi
* [x] Podaci se spremaju u `localStorage`
* [x] Stranica je responzivna
* [x] JavaScript je podijeljen u module
* [x] Nema duple kontakt forme
* [x] Uklonjena je nepotrebna kategorija Pogodnosti iz filtera

```

## Napomena

Početna stranica i stranica O nama ostale su većinom statične jer imaju informativnu ulogu. JavaScript funkcionalnosti dodane su na stranice gdje imaju praktičnu svrhu: Smještaj i Kontakt.
```
