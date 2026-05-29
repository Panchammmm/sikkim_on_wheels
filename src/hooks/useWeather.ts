import { useQuery } from "@tanstack/react-query";
import type { WeatherData } from "@/data/types";

/* 🌐 API TYPES */
type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };

  hourly: {
    time: string[];
    temperature_2m: number[];
    precipitation_probability: number[];
    weather_code: number[];
  };

  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
};

/* 🌦️ WEATHER TYPES */
type WeatherCondition = {
  label: string;
  icon: string;
};

/* 🌦️ COMPLETE WMO WEATHER DECODER */
const WMO_CODES: Record<number, WeatherCondition> = {
  // Clear / Clouds
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },

  // Fog
  45: { label: "Fog", icon: "🌫️" },
  48: { label: "Freezing Fog", icon: "🌫️" },

  // Drizzle
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Moderate Drizzle", icon: "🌦️" },
  55: { label: "Dense Drizzle", icon: "🌧️" },

  // Freezing drizzle
  56: { label: "Freezing Drizzle", icon: "🌧️" },
  57: { label: "Heavy Freezing Drizzle", icon: "🌧️" },

  // Rain
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Moderate Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },

  // Freezing rain
  66: { label: "Freezing Rain", icon: "🌧️" },
  67: { label: "Heavy Freezing Rain", icon: "🌧️" },

  // Snow
  71: { label: "Light Snow", icon: "❄️" },
  73: { label: "Moderate Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },

  // Snow grains
  77: { label: "Snow Grains", icon: "❄️" },

  // Rain showers
  80: { label: "Light Showers", icon: "🌦️" },
  81: { label: "Moderate Showers", icon: "🌦️" },
  82: { label: "Violent Showers", icon: "⛈️" },

  // Snow showers
  85: { label: "Snow Showers", icon: "❄️" },
  86: { label: "Heavy Snow Showers", icon: "❄️" },

  // Thunderstorm
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm with Hail", icon: "⛈️" },
  99: { label: "Severe Thunderstorm", icon: "⛈️" },
};

function decodeWMO(code: number): WeatherCondition {
  return (
    WMO_CODES[code] ?? {
      label: "Unknown",
      icon: "❓",
    }
  );
}

/* 📍 LOCATIONS */
const LOCATIONS = [
  { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
  { name: "Rinchenpong", lat: 27.1833, lon: 88.2667 },
  { name: "Pelling", lat: 27.299, lon: 88.234 },
  { name: "Ravangla", lat: 27.307, lon: 88.363 },
  { name: "Namchi", lat: 27.303, lon: 88.378 },
];

/* ⏱️ FETCH WITH TIMEOUT */
async function fetchWithTimeout(url: string, ms = 10000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, ms);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

/* 🔗 URL BUILDER */
function buildWeatherUrl(lat: number, lon: number) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),

    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
    ].join(","),

    hourly: [
      "temperature_2m",
      "precipitation_probability",
      "weather_code",
    ].join(","),

    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "precipitation_probability_max",
    ].join(","),

    temperature_unit: "celsius",
    wind_speed_unit: "kmh",

    timezone: "Asia/Kolkata",

    forecast_days: "5",

    models: "best_match",
  });

  return `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
}

/* 🔄 TRANSFORM FUNCTION */
function transformWeather(
  json: OpenMeteoResponse,
  loc: (typeof LOCATIONS)[number]
): WeatherData {
  const currentWeather = decodeWMO(json.current.weather_code);

  const dailyLength = Math.min(
    json.daily.time.length,
    json.daily.temperature_2m_max.length,
    json.daily.temperature_2m_min.length,
    json.daily.weather_code.length,
    json.daily.precipitation_probability_max.length
  );

  return {
    location: loc.name,

    lat: loc.lat,
    lon: loc.lon,

    current: {
      temp: Math.round(json.current.temperature_2m),

      feelsLike: Math.round(json.current.apparent_temperature),

      humidity: json.current.relative_humidity_2m,

      windSpeed: Math.round(json.current.wind_speed_10m),

      condition: currentWeather.label,

      icon: currentWeather.icon,
    },

    hourly: json.hourly.time.slice(0, 24).map((time, i) => {
      const weather = decodeWMO(json.hourly.weather_code[i]);

      return {
        time,

        temp: Math.round(json.hourly.temperature_2m[i]),

        rain: json.hourly.precipitation_probability[i] ?? 0,

        condition: weather.label,

        icon: weather.icon,
      };
    }),

    daily: Array.from({ length: dailyLength }).map((_, i) => {
      const weather = decodeWMO(json.daily.weather_code[i]);

      return {
        date: json.daily.time[i],

        high: Math.round(json.daily.temperature_2m_max[i]),

        low: Math.round(json.daily.temperature_2m_min[i]),

        rain: json.daily.precipitation_probability_max[i] ?? 0,

        condition: weather.label,

        icon: weather.icon,
      };
    }),
  };
}

/* 🌦️ FETCH WEATHER */
async function fetchWeather(): Promise<WeatherData[]> {
  const results = await Promise.all(
    LOCATIONS.map(async (loc) => {
      try {
        const url = buildWeatherUrl(loc.lat, loc.lon);

        const response = await fetchWithTimeout(url);

        if (!response.ok) {
          throw new Error(
            `Weather API Error (${loc.name}): ${response.status}`
          );
        }

        const json: OpenMeteoResponse = await response.json();

        return transformWeather(json, loc);
      } catch (error) {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          console.error(`⏱️ Request timeout for ${loc.name}`);
        } else {
          console.error(`❌ Weather fetch failed for ${loc.name}`, error);
        }

        return null;
      }
    })
  );

  return results.filter(
    (result): result is WeatherData => result !== null
  );
}

/* 🎣 WEATHER HOOK */
export function useWeather() {
  return useQuery({
    queryKey: ["weather"],

    queryFn: fetchWeather,

    staleTime: 5 * 60 * 1000,

    gcTime: 30 * 60 * 1000,

    refetchInterval: 5 * 60 * 1000,

    refetchOnWindowFocus: true,

    retry: 2,

    retryDelay: (attempt) =>
      Math.min(1000 * 2 ** attempt, 10000),

    placeholderData: [],

    networkMode: "online",
  });
}