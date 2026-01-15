# Setup și Rulare Aplicație Bug Tracker

## Cerințe
- Node.js (v14 sau mai nou)
- npm

## Pasul 1: Instalare dependențe

Din directorul rădăcină `AplicatieWebBug/`, rulați:

```bash
npm run install-all
```

Aceasta va instala dependențele pentru proiectul principal, client și server.

## Pasul 2: Pornirea aplicației

### Opțiunea A: Rulare client și server simultane (Recomandată)

```bash
npm start
```

Aceasta va porni:
- **Server API** pe `http://localhost:3001`
- **React App** pe `http://localhost:3000`

Aplicația se va deschide automat în browser.

### Opțiunea B: Rulare separată

**Terminal 1 - Server:**
```bash
cd server
npm start
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

### Opțiunea C: Development cu nodemon (Auto-reload)

**Terminal 1 - Server cu auto-reload:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm start
```

## Configurare API URL

Clientul este configurat să se conecteze la `http://localhost:3001` implicit.

Pentru a schimba URL-ul API, creați un fișier `.env` în directorul `client/`:

```bash
REACT_APP_API_URL=http://localhost:3001
```

## Build pentru producție

```bash
npm run build
```

Aceasta va crea versiunea optimizată în `client/build/`

## Troubleshooting

### Port-ul 3001 sau 3000 este ocupat
Schimbați portul în `server/server.js` și actualizați `.env` din client accordingly.

### Eroare cu `react-scripts`
```bash
cd client
npm install react-scripts
```

### Database.sqlite nu este creat
Serverul va crea automat baza de date la prima rulare.

---

Gata! Aplicația ar trebui să ruleze pe `http://localhost:3000`
