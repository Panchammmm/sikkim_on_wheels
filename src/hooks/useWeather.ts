import { useState, useEffect } from "react";

interface WeatherData {
  location: string;
  lat: number;
  lon: number;
  current?: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    icon: string;
  };
  daily: {
    date: string;
    high: number;
    low: number;
    condition: string;
    rain: number;
    icon: string;
  }[];
}

const WMO_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Rime Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy Drizzle", icon: "🌧️" },
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Light Snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  80: { label: "Rain Showers", icon: "🌦️" },
  81: { label: "Moderate Showers", icon: "🌧️" },
  82: { label: "Heavy Showers", icon: "⛈️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  96: { label: "Thunderstorm + Hail", icon: "⛈️" },
  99: { label: "Severe Thunderstorm", icon: "⛈️" },
};

function decodeWMO(code: number) {
  return WMO_CODES[code] ?? { label: "Unknown", icon: "❓" };
}

export interface LocationWeather {
  name: string;
  lat: number;
  lon: number;
}

const LOCATIONS: LocationWeather[] = [
  { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
  { name: "Rinchenpong", lat: 27.1833, lon: 88.2667 },
  { name: "Pelling", lat: 27.2990, lon: 88.2340 },
  { name: "Yuksom", lat: 27.3690, lon: 88.2210 },
  { name: "Ravangla", lat: 27.3070, lon: 88.3630 },
];

export function useWeather() {
  const [data, setData] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const results = await Promise.all(
          LOCATIONS.map(async (loc) => {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=5`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`Weather fetch failed for ${loc.name}`);
            const json = await res.json();
            const wmo = decodeWMO(json.current.weather_code);
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
              daily: json.daily.time.map((d: string, i: number) => {
                const dw = decodeWMO(json.daily.weather_code[i]);
                return {
                  date: d,
                  high: Math.round(json.daily.temperature_2m_max[i]),
                  low: Math.round(json.daily.temperature_2m_min[i]),
                  condition: dw.label,
                  rain: json.daily.precipitation_probability_max[i] ?? 0,
                  icon: dw.icon,
                };
              }),
            } as WeatherData;
          })
        );
        setData(results);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load weather");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return { data, loading, error };
}

export { LOCATIONS };
export type { WeatherData };
