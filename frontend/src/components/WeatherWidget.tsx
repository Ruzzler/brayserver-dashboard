import { useEffect, useState } from 'react';
import { Cloud, Sun, CloudRain, Snowflake, CloudLightning, FileWarning } from 'lucide-react';

interface WeatherWidgetProps {
    location?: string;
    unit?: string;
}

export function WeatherWidget({ location, unit = 'F' }: WeatherWidgetProps) {
    const [weatherData, setWeatherData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!location) return;

        const fetchWeather = async () => {
            setLoading(true);
            setError('');
            try {
                // 1. Geocode location string
                const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`);
                const geoData = await geoRes.json();

                if (!geoData.results || geoData.results.length === 0) {
                    setError('Location not found');
                    setLoading(false);
                    return;
                }

                const { latitude, longitude, name, admin1 } = geoData.results[0];
                const locName = `${name}${admin1 ? `, ${admin1}` : ''}`;
                const tempUnit = unit === 'F' ? 'fahrenheit' : 'celsius';

                // 2. Fetch weather
                const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&temperature_unit=${tempUnit}`);
                const weatherInfo = await weatherRes.json();

                if (weatherInfo.current) {
                    setWeatherData({
                        temp: Math.round(weatherInfo.current.temperature_2m),
                        code: weatherInfo.current.weather_code,
                        name: locName
                    });
                }
            } catch (err) {
                console.error("Failed to fetch weather", err);
                setError('Failed to load');
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const interval = setInterval(fetchWeather, 15 * 60 * 1000); // 15 mins
        return () => clearInterval(interval);
    }, [location, unit]);

    if (!location) return null;

    // Open-Meteo WMO codes mapping
    const getWeatherIcon = (code: number) => {
        if (code === 0 || code === 1) return <Sun className="text-yellow-500 w-6 h-6" />;
        if (code >= 2 && code <= 4) return <Cloud className="text-gray-400 w-6 h-6" />;
        if (code >= 51 && code <= 67) return <CloudRain className="text-blue-400 w-6 h-6" />;
        if (code >= 71 && code <= 77) return <Snowflake className="text-cyan-300 w-6 h-6" />;
        if (code >= 95 && code <= 99) return <CloudLightning className="text-purple-400 w-6 h-6" />;
        return <Cloud className="text-gray-400 w-6 h-6" />;
    };

    const getWeatherDescription = (code: number) => {
        if (code === 0) return 'Clear';
        if (code === 1 || code === 2) return 'Partly Cloudy';
        if (code === 3) return 'Overcast';
        if (code === 45 || code === 48) return 'Foggy';
        if (code >= 51 && code <= 67) return 'Rain';
        if (code >= 71 && code <= 77) return 'Snow';
        if (code >= 95 && code <= 99) return 'Thunderstorm';
        return 'Unknown';
    };

    if (loading && !weatherData) {
        return <div className="text-sm text-muted-foreground animate-pulse mb-8 text-center flex justify-center">Loading weather...</div>;
    }

    if (error) {
        return <div className="text-sm text-destructive flex items-center justify-center gap-1 mb-8"><FileWarning className="w-4 h-4" /> {error}</div>;
    }

    if (!weatherData) return null;

    return (
        <div className="flex items-center gap-4 bg-card/60 border border-border/50 backdrop-blur-md px-5 py-3 rounded-2xl shadow-sm w-max mx-auto mb-10 transition-transform duration-300 hover:scale-105 hover:bg-card/80">
            {getWeatherIcon(weatherData.code)}
            <div className="flex flex-col">
                <span className="text-lg font-bold leading-none">{weatherData.temp}°{unit}</span>
                <span className="text-[11px] text-muted-foreground uppercase tracking-widest mt-1">{getWeatherDescription(weatherData.code)} &bull; {weatherData.name}</span>
            </div>
        </div>
    );
}
