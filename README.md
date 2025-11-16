# Frontend — instrukcja uruchomienia (Windows / PowerShell)

Poniżej znajdziesz krok po kroku instrukcję jak pobrać wymagane narzędzia i uruchomić frontend projektu "AlgoRhythm" na systemie Windows przy użyciu PowerShell.

## Wymagania

- Node.js (zalecane LTS). Pobierz z https://nodejs.org/ i zainstaluj. Podczas instalacji upewnij się, że opcja "Add to PATH" jest zaznaczona.
- npm (instalowany automatycznie z Node.js). Alternatywnie możesz użyć `pnpm` lub `yarn` jeśli wolisz.

## Szybka lista kroków

1. Zainstaluj Node.js (i npm).
2. Otwórz PowerShell i przejdź do folderu projektu frontend (np. `AlgoRhythm`).
3. Uruchom `npm install` aby zainstalować zależności.
4. Uruchom deweloperski serwer: `npm run dev`.

Poniżej szczegółowe instrukcje i diagnostyka.

## Krok 1 — sprawdzenie Node.js i npm

Otwórz PowerShell i uruchom:

```powershell
node --version
npm --version
```

Spodziewane wyjście to wersje, np. `v20.x.x` i `9.x.x`. Jeśli polecenia nie są rozpoznawane:

- Upewnij się, że Node.js jest zainstalowane.
- Zrestartuj VS Code / PowerShell po instalacji, żeby PATH się zaktualizowało.

## Krok 2 — przejdź do katalogu projektu

Przykład (dostosuj ścieżkę jeśli masz projekt w innym miejscu):

```powershell
cd "c:\Users\Wojte\Desktop\studia\semestr 7\INZYNIERKA\Frontend\Frontend\AlgoRhythm"
```

Sprawdź, że w tym katalogu znajdują się pliki takie jak `package.json`, `vite.config.ts`, oraz katalog `src`.

## Krok 3 — instalacja zależności

Jeśli nie masz folderu `node_modules` lub chcesz przywrócić zależności, uruchom:

```powershell
npm install
```

Uwaga o błędach:
- Jeśli instalacja się nie powiedzie, sprawdź komunikat błędu. Często brakuje kompilatora natywnego (np. windows-build-tools) jedynie przy pakietach z natywnymi rozszerzeniami — zwykle nie dotyczy typowego projektu React + Vite.
- Jeśli pojawi się błąd o braku uprawnień, spróbuj uruchomić PowerShell jako administrator.

## Krok 4 — uruchomienie aplikacji (development)

Gdy zależności będą zainstalowane, uruchom:

```powershell
npm run dev
```

Powinieneś zobaczyć informacje o serwerze Vite i adres (domyślnie http://localhost:5173). Otwórz przeglądarkę i przejdź pod ten adres.

## Krok 5 — konfiguracja komunikacji z backendem

Frontend używa plików w `src/api/` (np. `apiClient.ts`) — upewnij się, że `baseURL` wskazuje na Twój backend (np. `http://localhost:5000`). Jeśli backend jest uruchomiony na innym porcie lub hoście, zmień tam wartość.

## Typowe problemy i jak je rozwiązać

- "JSX/TSX nie rozpoznawane" / brak typów React: upewnij się, że `npm install` wykonał się poprawnie. Jeśli nadal brakuje typów, uruchom:

```powershell
npm install --save-dev @types/react @types/react-dom
```

- "Port 5173 zajęty": albo zamknij proces zajmujący port, albo uruchom Vite na innym porcie poprzez `npm run dev -- --port 5174`.

- "npm: command not found" — zainstaluj Node.js i sprawdź PATH.
