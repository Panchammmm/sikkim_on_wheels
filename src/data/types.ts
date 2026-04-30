export interface DayItinerary {
  day: number;
  from: string;
  to: string;
  distance: number;
  travelTime: string;
  elevation: number;
  elevationGain: string;
  difficulty: "easy" | "moderate" | "challenging";
  route: string;
  accommodation: string;
  accommodationAddress: string;
  highlights: string[];
  foodSpots: string[];
  tips: string[];

  // Weather now comes ONLY from API
  weather?: {
    high: number;
    condition: string;
    icon: string;
    windSpeed: number;
    feelsLike: number;
  };
}

export type WeatherData = {
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

export type DayStop = {
  lat: number;
  lng: number;
  label: string;
};

export type DayMeta = {
  color: string;
  stops: DayStop[];
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type RouteCache = Record<number, LatLng[] | "fallback">;

export type SidebarTab = "highlights" | "food" | "tips";

export type Spot = {
  id: string;
  name: string;
  rating: number;
  time: string;
  description: string;
  hidden: boolean;
  image: string;
};
