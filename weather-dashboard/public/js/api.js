/**
 * Weather API Handler
 * Mengelola semua API calls ke OpenWeatherMap
 */

class WeatherAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.openweathermap.org/data/2.5';
        this.units = 'metric';
    }

    /**
     * Get current weather by city name
     */
    async getWeatherByCity(city) {
        const url = `${this.baseUrl}/weather?q=${city}&appid=${this.apiKey}&units=${this.units}`;
        return this.fetchData(url);
    }

    /**
     * Get weather by coordinates
     */
    async getWeatherByCoordinates(lat, lon) {
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=${this.units}`;
        return this.fetchData(url);
    }

    /**
     * Get 5-day forecast
     */
    async getForecast(city) {
        const url = `${this.baseUrl}/forecast?q=${city}&appid=${this.apiKey}&units=${this.units}`;
        return this.fetchData(url);
    }

    /**
     * Fetch data with error handling
     */
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('City not found');
                } else if (response.status === 401) {
                    throw new Error('Invalid API key');
                } else {
                    throw new Error(`API Error: ${response.status}`);
                }
            }
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * Get user's current location
     */
    async getCurrentLocation() {
        return new Promise((resolve, reject) => {
            if ('geolocation' in navigator) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        console.error('Geolocation error:', error);
                        reject(error);
                    }
                );
            } else {
                reject(new Error('Geolocation not supported'));
            }
        });
    }
}

/**
 * Weather Data Processor
 * Mengolah dan memformat data cuaca
 */
class WeatherProcessor {
    /**
     * Format weather data
     */
    static formatWeather(data) {
        return {
            city: data.name,
            country: data.sys.country,
            coordinates: {
                lat: data.coord.lat,
                lon: data.coord.lon
            },
            temperature: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            description: data.weather[0].main,
            icon: this.getWeatherIcon(data.weather[0].main),
            humidity: data.main.humidity,
            pressure: data.main.pressure,
            windSpeed: data.wind.speed,
            cloudiness: data.clouds.all,
            visibility: (data.visibility / 1000).toFixed(1),
            sunrise: new Date(data.sys.sunrise * 1000),
            sunset: new Date(data.sys.sunset * 1000),
            timezone: data.timezone
        };
    }

    /**
     * Format forecast data
     */
    static formatForecast(data) {
        const forecastList = data.list;
        const groupedForecast = {};

        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
            if (!groupedForecast[date]) {
                groupedForecast[date] = [];
            }
            groupedForecast[date].push(item);
        });

        const dailyForecast = [];
        Object.values(groupedForecast).forEach(dayData => {
            const noonEntry = dayData.reduce((prev, curr) => {
                const prevHour = new Date(prev.dt * 1000).getHours();
                const currHour = new Date(curr.dt * 1000).getHours();
                return Math.abs(currHour - 12) < Math.abs(prevHour - 12) ? curr : prev;
            });

            dailyForecast.push({
                date: new Date(noonEntry.dt * 1000),
                tempMax: Math.round(noonEntry.main.temp_max),
                tempMin: Math.round(noonEntry.main.temp_min),
                description: noonEntry.weather[0].main,
                icon: this.getWeatherIcon(noonEntry.weather[0].main),
                humidity: noonEntry.main.humidity,
                windSpeed: noonEntry.wind.speed
            });
        });

        return dailyForecast.slice(0, 5);
    }

    /**
     * Get weather icon emoji
     */
    static getWeatherIcon(description) {
        const desc = description.toLowerCase();
        const icons = {
            'clear': '☀️',
            'sunny': '☀️',
            'clouds': '☁️',
            'rain': '🌧️',
            'drizzle': '🌦️',
            'thunderstorm': '⛈️',
            'mist': '🌫️',
            'snow': '❄️'
        };

        for (let key in icons) {
            if (desc.includes(key)) {
                return icons[key];
            }
        }
        return '🌤️';
    }

    /**
     * Format time
     */
    static formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    /**
     * Format date
     */
    static formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    }
}
