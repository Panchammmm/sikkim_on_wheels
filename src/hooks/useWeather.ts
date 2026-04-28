import { useQuery } from "@tanstack/react-query";
import { WeatherData } from "@/data/tripData";

/* 🌐 API TYPES */
type OpenMeteoResponse = {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
  };
};

/* 🌦️ WMO WEATHER DECODER */
const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  61: { label: "Rain", icon: "🌧️" },
  80: { label: "Showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

function decodeWMO(code: number) {
  if (WMO_CODES[code]) return WMO_CODES[code];

  if (code >= 51 && code < 70) return { label: "Drizzle", icon: "🌦️" };
  if (code >= 71 && code < 80) return { label: "Snow", icon: "❄️" };

  return { label: "Unknown", icon: "❓" };
}

const LOCATIONS = [
  { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
  { name: "Rinchenpong", lat: 27.1833, lon: 88.2667 },
  { name: "Pelling", lat: 27.299, lon: 88.234 },
  { name: "Ravangla", lat: 27.307, lon: 88.363 },
  { name: "Namchi", lat: 27.303, lon: 88.378 },
];

/* ⏱️ FETCH WITH TIMEOUT */
async function fetchWithTimeout(url: string, ms = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), ms);

  try {
    return await fetch(url, { signal: controller.signal });
  } finally {
    clearTimeout(id);
  }
}

/* 🔗 URL BUILDER */
function buildWeatherUrl(lat: number, lon: number) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=5`;
}

/* 🔄 TRANSFORM FUNCTION */
function transformWeather(
  json: OpenMeteoResponse,
  loc: (typeof LOCATIONS)[number]
): WeatherData {
  const wmo = decodeWMO(json.current.weather_code);

  const days = Math.min(
    json.daily.time.length,
    json.daily.temperature_2m_max.length,
    json.daily.temperature_2m_min.length,
    json.daily.weather_code.length
  );

  return {
    location: loc.name,
    lat: loc.lat,
    lon: loc.lon,
    current: {
      temp: Math.round(json.current.temperature_2m),
      humidity: json.current.relative_humidity_2m,
      windSpeed: Math.round(json.current.wind_speed_10m),
      condition: wmo.label,
      icon: wmo.icon,
    },
    daily: Array.from({ length: days }).map((_, i) => {
      const dw = decodeWMO(json.daily.weather_code[i]);

      return {
        date: json.daily.time[i],
        high: Math.round(json.daily.temperature_2m_max[i]),
        low: Math.round(json.daily.temperature_2m_min[i]),
        condition: dw.label,
        rain: json.daily.precipitation_probability_max[i] ?? 0,
        icon: dw.icon,
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
        const res = await fetchWithTimeout(url);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json: OpenMeteoResponse = await res.json();

        return transformWeather(json, loc);
      } catch (err) {
        console.error(`❌ Weather fetch failed for ${loc.name}`, err);
        return null;
      }
    })
  );

  return results.filter((r): r is WeatherData => r !== null);
}

export function useWeather() {
  return useQuery({
    queryKey: ["weather", LOCATIONS],

    queryFn: fetchWeather,

    staleTime: 5 * 60 * 1000, // 5 min = no refetch spam
    refetchInterval: 5 * 60 * 1000, // auto refresh
    refetchOnWindowFocus: true,
    retry: 2,

    // Optional UX improvement
    placeholderData: [],
  });
}