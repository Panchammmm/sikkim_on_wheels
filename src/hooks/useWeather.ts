import { useQuery } from "@tanstack/react-query";

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
  61: { label: "Rain", icon: "🌧️" },
  80: { label: "Showers", icon: "🌦️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
};

function decodeWMO(code: number) {
  return WMO_CODES[code] ?? { label: "Unknown", icon: "❓" };
}

const LOCATIONS = [
  { name: "Siliguri", lat: 26.7271, lon: 88.3953 },
  { name: "Rinchenpong", lat: 27.1833, lon: 88.2667 },
  { name: "Pelling", lat: 27.299, lon: 88.234 },
  { name: "Yuksom", lat: 27.369, lon: 88.221 },
  { name: "Ravangla", lat: 27.307, lon: 88.363 },
];

async function fetchWeather(): Promise<WeatherData[]> {
  const results = await Promise.all(
    LOCATIONS.map(async (loc) => {
      try {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max&timezone=Asia/Kolkata&forecast_days=5`;

        const res = await fetch(url);
        if (!res.ok) throw new Error();

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
      } catch {
        return null;
      }
    })
  );

  return results.filter(Boolean) as WeatherData[];
}

export function useWeather() {
  return useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,

    // 🔥 POWER FEATURES
    staleTime: 5 * 60 * 1000, // 5 min = no refetch spam
    refetchInterval: 5 * 60 * 1000, // auto refresh
    refetchOnWindowFocus: true, // tab switch = refresh
    retry: 2, // retry on failure
  });
}