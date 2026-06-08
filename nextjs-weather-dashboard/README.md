# Next.js Weather Dashboard

Modern React-based weather dashboard dengan Next.js framework

## Features

- 🌡️ Real-time weather data
- 📱 Server-side rendering (SSR)
- ⚡ API Routes (Next.js built-in backend)
- 🎨 Tailwind CSS styling
- 🌙 Dark mode support
- 📊 Weather analytics
- 🔍 Search functionality
- 📍 Geolocation support

## Setup

```bash
# Create Next.js project
npx create-next-app@latest weather-dashboard-nextjs --typescript

# Install dependencies
cd weather-dashboard-nextjs
npm install

# Setup environment
cp .env.example .env.local

# Run development server
npm run dev
```

Access at: `http://localhost:3000`

## Project Structure

```
weather-dashboard-nextjs/
├── pages/
│   ├── index.tsx              # Home page
│   ├── api/
│   │   ├── weather.ts         # Weather API
│   │   └── forecast.ts        # Forecast API
│   └── _app.tsx               # App wrapper
├── components/
│   ├── Header.tsx
│   ├── CurrentWeather.tsx
│   ├── Forecast.tsx
│   └── SearchBar.tsx
├── styles/
│   └── globals.css
├── lib/
│   ├── openWeatherAPI.ts
│   └── weatherProcessor.ts
├── public/
├── .env.example
└── package.json
```

## API Endpoints

- `GET /api/weather?city=Jakarta` - Get current weather
- `GET /api/forecast?city=Jakarta` - Get 5-day forecast
- `GET /api/weather?lat=X&lon=Y` - Get weather by coordinates

## Environment Variables

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

## Running

```bash
npm run dev       # Development
npm run build     # Production build
npm run start     # Production server
npm run lint      # Linting
```

## Deployment

Ready for deployment on Vercel, Netlify, or any Node.js hosting.
