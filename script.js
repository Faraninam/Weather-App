// Get references to HTML elements
const cityInput = document.getElementById('cityInput');
const getWeatherBtn = document.getElementById('getWeatherBtn');
const weatherDisplay = document.getElementById('weatherDisplay'); // Parent container
const weatherIconContainer = document.getElementById('weatherIcon'); // Element for displaying emoji icon
const temperatureDisplay = document.getElementById('temperatureDisplay'); // Element for temperature
const descriptionDisplay = document.getElementById('descriptionDisplay'); // Element for description
const cityCountryDisplay = document.getElementById('cityCountryDisplay'); // Element for city, country
const initialMessage = document.getElementById('initialMessage'); // Initial message/error message display
const themeToggleBtn = document.getElementById('themeToggleBtn');

// --- Dark Theme Toggle Logic ---
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
}

themeToggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }
});


// Helper function to display messages and clear/show content
function displayMessage(message, isError = false) {
    // Clear all specific weather display elements
    weatherIconContainer.textContent = '';
    temperatureDisplay.textContent = '';
    descriptionDisplay.textContent = '';
    cityCountryDisplay.textContent = '';
    weatherIconContainer.classList.remove('weather-icon-animated'); // Remove animation class if present

    // Show the initial/error message
    initialMessage.textContent = message;
    if (isError) {
        initialMessage.classList.add('error-message');
        initialMessage.classList.remove('text-gray-500'); // Ensure default color is removed
    } else {
        initialMessage.classList.remove('error-message');
        initialMessage.classList.add('text-gray-500'); // Ensure default color is applied
    }
}

// Function to get weather icon/emoji based on description
function getWeatherIcon(description) {
    const lowerCaseDesc = description.toLowerCase();
    if (lowerCaseDesc.includes('sunny') || lowerCaseDesc.includes('clear')) {
        return '☀️'; // Sun emoji
    } else if (lowerCaseDesc.includes('cloudy') || lowerCaseDesc.includes('overcast') || lowerCaseDesc.includes('partly cloudy')) {
        // Added 'partly cloudy' for better matching
        return '☁️'; // Cloud emoji
    } else if (lowerCaseDesc.includes('rain') || lowerCaseDesc.includes('drizzle') || lowerCaseDesc.includes('tropical rain')) {
        // Added 'tropical rain' for better matching
        return '🌧️'; // Cloud with rain emoji
    } else if (lowerCaseDesc.includes('storm')) {
        return '⛈️'; // Cloud with lightning and rain emoji
    } else if (lowerCaseDesc.includes('snow') || lowerCaseDesc.includes('snowy')) {
        // Added 'snowy' for better matching
        return '❄️'; // Snowflake emoji
    } else if (lowerCaseDesc.includes('humid') || lowerCaseDesc.includes('smoggy')) {
        return '🌫️'; // Fog/smog emoji
    } else {
        return '🌡️'; // Thermometer as a default fallback
    }
}

// Function to simulate fetching weather data
async function fetchWeatherData(city) {
    displayMessage('Loading weather data...'); // Display loading message
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network latency

    // Simulated response based on common cities
    const weatherData = {
        'london': {
            temperature: 15,
            description: 'Partly Cloudy',
            city: 'London',
            country: 'UK'
        },
        'new york': {
            temperature: 22,
            description: 'Sunny',
            city: 'New York',
            country: 'USA'
        },
        'tokyo': {
            temperature: 28,
            description: 'Hot and Humid',
            city: 'Tokyo',
            country: 'Japan'
        },
        'paris': {
            temperature: 18,
            description: 'Light Rain',
            city: 'Paris',
            country: 'France'
        },
        'sydney': {
            temperature: 25,
            description: 'Clear Skies',
            city: 'Sydney',
            country: 'Australia'
        },
        'dubai': {
            temperature: 38,
            description: 'Clear Skies',
            city: 'Dubai',
            country: 'UAE'
        },
        'los angeles': {
            temperature: 24,
            description: 'Smoggy',
            city: 'Los Angeles',
            country: 'USA'
        },
        'gujranwala': {
            temperature: 35,
            description: 'Hot',
            city: 'Gujranwala',
            country: 'Pakistan'
        },
        'berlin': {
            temperature: 10,
            description: 'Overcast',
            city: 'Berlin',
            country: 'Germany'
        },
        'mumbai': {
            temperature: 30,
            description: 'Tropical Rain',
            city: 'Mumbai',
            country: 'India'
        },
        'moscow': {
            temperature: -5,
            description: 'Snowy',
            city: 'Moscow',
            country: 'Russia'
        },
        'oslo' : {
            temperature: 20,
            description: 'Cloudy',
            city: 'Oslo',
            country: 'Norway',
        },
    };

    const lowerCaseCity = city.toLowerCase();
    if (weatherData[lowerCaseCity]) {
        return { success: true, data: weatherData[lowerCaseCity] };
    } else {
        return { success: false, message: 'City not found or data unavailable for this city.' };
    }
}

// Event listener for the button click
getWeatherBtn.addEventListener('click', async () => {
    const city = cityInput.value.trim();

    if (city === '') {
        displayMessage('Please enter a city name.', true);
        return;
    }

    try {
        const result = await fetchWeatherData(city);

        // Hide the initial message when displaying actual weather data
        initialMessage.textContent = '';
        initialMessage.classList.remove('error-message', 'text-gray-500'); // Clean up classes

        if (result.success) {
            const data = result.data;
            const weatherEmoji = getWeatherIcon(data.description);

            // Set the emoji and add animation
            weatherIconContainer.textContent = weatherEmoji;
            weatherIconContainer.classList.add('weather-icon-animated');

            // Update the specific text content elements
            temperatureDisplay.textContent = `${data.temperature}°C`;
            descriptionDisplay.textContent = data.description;
            cityCountryDisplay.textContent = `${data.city}, ${data.country}`;

        } else {
            // If there's an error, use displayMessage to show it and clear other fields
            displayMessage(result.message, true);
        }
    } catch (error) {
        console.error('Error fetching weather:', error);
        displayMessage('An error occurred while fetching weather data. Please try again.', true);
    }
});

// Optional: Allow pressing Enter key to trigger search
cityInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        getWeatherBtn.click();
    }
});