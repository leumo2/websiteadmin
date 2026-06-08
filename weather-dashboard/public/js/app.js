/**
 * Weather Dashboard App - Main Application Logic
 */

class WeatherApp {
    constructor() {
        this.apiKey = null;
        this.api = null;
        this.ui = new UIManager();
        this.currentWeather = null;
        this.savedLocations = [];
        this.defaultCity = 'Jakarta';
        
        this.init();
    }

    /**
     * Initialize app
     */
    async init() {
        this.apiKey = await this.getApiKey();
        
        if (!this.apiKey) {
            this.ui.showError('API Key not found. Please configure .env file.');
            return;
        }

        this.api = new WeatherAPI(this.apiKey);
        
        this.loadSavedLocations();
        this.setupEventListeners();
        this.loadWeather(this.defaultCity);
        
        console.log('✅ Weather App initialized');
    }

    /**
     * Get API key from server
     */
    async getApiKey() {
        try {
            const response = await fetch('/api/config');
            const data = await response.json();
            return data.apiKey;
        } catch (error) {
            console.error('Error getting API key:', error);
            return null;
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const locationBtn = document.getElementById('locationBtn');
        const themeBtn = document.getElementById('themeBtn');

        searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchCity(searchInput.value);
            }
        });
        searchBtn.addEventListener('click', () => this.searchCity(searchInput.value));
        locationBtn.addEventListener('click', () => this.getUserLocation());
        themeBtn.addEventListener('click', () => this.toggleTheme());
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.ui.hideSearchSuggestions();
            }
        });
    }

    /**
     * Handle search input
     */
    handleSearch(query) {
        if (query.length < 2) {
            this.ui.hideSearchSuggestions();
            return;
        }

        const commonCities = [
            'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
            'Makassar', 'Yogyakarta', 'Bali', 'Tangerang', 'Depok',
            'London', 'Paris', 'Tokyo', 'New York', 'Sydney',
            'Singapore', 'Bangkok', 'Manila', 'Seoul', 'Dubai'
        ];

        const suggestions = commonCities.filter(city => 
            city.toLowerCase().includes(query.toLowerCase())
        );
        
        this.ui.showSearchSuggestions(suggestions);
    }

    /**
     * Search weather by city
     */
    async searchCity(city) {
        if (!city.trim()) return;
        
        document.getElementById('searchInput').value = '';
        this.ui.hideSearchSuggestions();
        await this.loadWeather(city);
    }

    /**
     * Load weather data
     */
    async loadWeather(city) {
        try {
            this.ui.showLoading();
            
            const weatherData = await this.api.getWeatherByCity(city);
            this.currentWeather = WeatherProcessor.formatWeather(weatherData);
            
            const forecastData = await this.api.getForecast(city);
            const forecast = WeatherProcessor.formatForecast(forecastData);
            
            const isSaved = this.savedLocations.some(loc => loc.city === this.currentWeather.city);
            
            this.ui.renderCurrentWeather(this.currentWeather, isSaved);
            this.ui.renderForecast(forecast);
            this.ui.renderDetails(this.currentWeather);
            
            document.getElementById('saveBtn').addEventListener('click', () => {
                this.toggleSaveLocation(this.currentWeather);
            });
            
        } catch (error) {
            this.ui.showError(error.message);
        }
    }

    /**
     * Get user's location
     */
    async getUserLocation() {
        try {
            const location = await this.api.getCurrentLocation();
            const weatherData = await this.api.getWeatherByCoordinates(
                location.latitude,
                location.longitude
            );
            const city = weatherData.name;
            await this.loadWeather(city);
        } catch (error) {
            this.ui.showError('Could not get your location');
        }
    }

    /**
     * Toggle save location
     */
    toggleSaveLocation(weather) {
        const index = this.savedLocations.findIndex(loc => loc.city === weather.city);
        
        if (index > -1) {
            this.savedLocations.splice(index, 1);
        } else {
            this.savedLocations.push({
                city: weather.city,
                country: weather.country,
                temperature: weather.temperature,
                description: weather.description,
                icon: weather.icon
            });
        }
        
        this.saveSavedLocations();
        this.ui.renderSavedLocations(this.savedLocations);
        
        const isSaved = this.savedLocations.some(loc => loc.city === weather.city);
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn) {
            saveBtn.classList.toggle('saved');
            saveBtn.textContent = isSaved ? '⭐ Saved' : '☆ Save';
        }
    }

    /**
     * Remove location
     */
    removeLocation(city) {
        this.savedLocations = this.savedLocations.filter(loc => loc.city !== city);
        this.saveSavedLocations();
        this.ui.renderSavedLocations(this.savedLocations);
    }

    /**
     * Save locations to localStorage
     */
    saveSavedLocations() {
        localStorage.setItem('savedLocations', JSON.stringify(this.savedLocations));
    }

    /**
     * Load locations from localStorage
     */
    loadSavedLocations() {
        const saved = localStorage.getItem('savedLocations');
        if (saved) {
            this.savedLocations = JSON.parse(saved);
            this.ui.renderSavedLocations(this.savedLocations);
        }
    }

    /**
     * Toggle dark mode
     */
    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
    }

    /**
     * Load theme preference
     */
    loadTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new WeatherApp();
    app.loadTheme();
});
