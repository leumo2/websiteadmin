# Weather Dashboard

Real-time weather dashboard yang fetches data dari OpenWeatherMap API dengan interface modern dan responsif.

## Fitur Utama

- 🌡️ Current weather dengan detail lengkap
- 📍 Search lokasi / Geolocation
- 📅 Forecast 5 hari
- 🌅 Sunrise & Sunset
- 💨 Wind speed, Humidity, Pressure
- 👁️ Visibility & UV Index
- 🗺️ Multiple locations
- 🌙 Dark mode
- 📱 Fully responsive
- ⚡ Real-time updates

## Teknologi

- Frontend: HTML5, CSS3, JavaScript (Vanilla)
- API: OpenWeatherMap API
- Storage: LocalStorage
- Build: Webpack (optional)

## Setup

### 1. Get API Key
- Kunjungi: https://openweathermap.org/api
- Sign up untuk akun gratis
- Copy API Key dari settings

### 2. Install
```bash
npm install
```

### 3. Setup Environment
```bash
cp .env.example .env
```

### 4. Run
```bash
npm run dev
```

Akses di: `http://localhost:3000`

## Struktur Folder

```
weather-dashboard/
├── public/
│   ├── index.html
│   ├── styles/
│   │   ├── main.css
│   │   └── responsive.css
│   └── js/
│       ├── api.js
│       ├── ui.js
│       └── app.js
├── server.js
├── .env.example
└── package.json
```
