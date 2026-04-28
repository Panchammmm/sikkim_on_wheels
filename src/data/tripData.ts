export const TRIP_START_DATE = new Date("2026-06-18T06:00:00");

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

export type DifficultyConfig = Record<
  DayItinerary["difficulty"],
  { label: string; color: string }
>;

export const itinerary: DayItinerary[] = [
  {
    day: 1,
    from: "NJP Station",
    to: "Rinchenpong",
    distance: 125,
    travelTime: "5-6 hours",
    elevation: 1700,
    elevationGain: "+1550m",
    difficulty: "moderate",
    route: "NJP Station → Jorethang → Legship → Rinchenpong",
    accommodation: "Rinchenpong Homestay",
    accommodationAddress: "Upper Rinchenpong, West Sikkim",
    highlights: [
      "Teesta River valley views",
      "Jorethang town market stop",
      "Rangeet River bridge crossing",
      "First views of Kanchenjunga",
    ],
    foodSpots: [
      "Jorethang Market - Local momos & thukpa",
      "Legship Dhaba - Rice & dal combo",
    ],
    tips: [
      "Start early by 6 AM to beat traffic on NH10",
      "Carry rain gear - weather changes quickly after Jorethang",
      "Fill up fuel at Jorethang, no stations after",
    ],
  },

  {
    day: 2,
    from: "Rinchenpong",
    to: "Pelling",
    distance: 35,
    travelTime: "2-3 hours",
    elevation: 2150,
    elevationGain: "+450m",
    difficulty: "easy",
    route: "Rinchenpong → Legship → Pelling City",
    accommodation: "Hotel Mount Pandim",
    accommodationAddress: "Upper Pelling, West Sikkim 737113",
    highlights: [
      "Sunrise over Kanchenjunga from Rinchenpong",
      "Legship town - mahadev temple and river views",
      "Pemayangtse Monastery - oldest in Sikkim",
      "Rabdentse Ruins - ancient capital",
    ],
    foodSpots: [
      "Pelling Main Market - Tibetan eateries",
      "Melting Point - Café with mountain views",
    ],
    tips: [
      "Catch sunrise before leaving Rinchenpong",
      "Roads are well-paved but narrow - ride cautiously",
      "Visit Pemayangtse Monastery before 4 PM",
    ],
  },

  {
    day: 3,
    from: "Pelling",
    to: "Pelling City",
    distance: 40,
    travelTime: "4-5 hours",
    elevation: 2200,
    elevationGain: "+400m",
    difficulty: "easy",
    route: "Pelling → Skywalk → Rimbi → Pelling City",
    accommodation: "Tashigang Resort",
    accommodationAddress: "Pelling, West Sikkim 737113",
    highlights: [
      "Helipad Ground's 360° Kanchenjunga viewpoint",
      "Skywalk at Pelling",
      "Sangachoeling Monastery near Skywalk",
      "Rimbi Waterfall & Orange Garden - riverside gardens, ~12 km from Pelling",
    ],
    foodSpots: [
      "Hotel Garuda Restaurant - local Sikkimese thali",
      "Pelling Bakery - fresh bread and momos in the morning",
      "Raza Rasoi (near Rimbi Road) - good for a mid-day break",
    ],
    tips: [
      "Start at Helipad by 6:30 AM for clearest Kanchenjunga views",
      "Skywalk opens at 8 AM - arrive early, entry fee ₹100",
      "Park bikes at Skywalk, trek 15 min uphill to Sangachoeling",
    ],
  },

  {
    day: 4,
    from: "Pelling",
    to: "Namchi",
    distance: 72,
    travelTime: "5-6 hours",
    elevation: 1675,
    elevationGain: "-475m",
    difficulty: "moderate",
    route: "Pelling → Ravangla → Temi → Namchi",
    accommodation: "Hotel Blue Sapphire",
    accommodationAddress: "Namchi, South Sikkim 737126",
    highlights: [
      "Buddha Park - 137ft sitting Buddha statue",
      "Temi Tea Garden - Sikkim's only tea estate",
      "Char Dham - 87ft Lord Shiva statue + 12 Jyotirlingas",
      "Samdruptse Hill - 135ft golden Guru Padmasambhava statue",
      "Namchi Rock Garden - manicured garden with ropeway to Samdruptse",
    ],
    foodSpots: [
      "Ravangla Bazaar - local Sikkimese dal bhat and momos",
      "Temi Tea Garden - sip fresh organic Sikkim tea on site",
      "Blue Sky Restaurant, Namchi - Tibetan and Indian dishes",
    ],
    tips: [
      "Leave Pelling early - ~49 km to Ravangla takes 2+ hours on hill roads",
      "Char Dham entry via ropeway from Namchi is scenic, small fee applies",
      "Namchi is at 1675m - warmer than Pelling, lighter gear in the evening",
    ],
  },

  {
    day: 5,
    from: "Namchi",
    to: "NJP Station",
    distance: 96,
    travelTime: "4-5 hours",
    elevation: 120,
    elevationGain: "-1555m",
    difficulty: "moderate",
    route: "Namchi → NJP",
    accommodation: "Trip ends at NJP Station",
    accommodationAddress: "New Jalpaiguri Railway Station, West Bengal",
    highlights: [
      "Namchi farewell views of Kanchenjunga before the descent",
      "Jorethang - confluence of Rangeet & Rangbhang rivers",
      "Teesta River valley ride - stunning gorge scenery along NH10",
    ],
    foodSpots: [
      "Namchi Market - early morning momos & chai before departure",
      "Hotel Solophok (Melli Road, Namchi) - good breakfast stop",
      "Teesta Bazaar dhabas - riverside lunch before the flat stretch",
    ],
    tips: [
      "Start by 7 AM - 96 km is manageable but Sikkim hill roads need time",
      "Namchi → Jorethang descent is steep and winding - brake carefully",
      "Melli is the Sikkim border - carry ID, quick checkpost stop",
      "Teesta Bazaar to Siliguri on NH10 gets very heavy traffic after 2 PM",
    ],
  },
];

export const packingList = {
  "Riding Gear": [
    "Full-face helmet (ISI certified)",
    "Riding jacket with armor",
    "Riding gloves (waterproof)",
    "Riding boots (ankle-high)",
    "Knee guards",
    "Rain suit (jacket + pants)",
  ],
  "Clothing": [
    "Thermal innerwear (2 sets)",
    "Fleece jacket",
    "Waterproof windcheater",
    "Quick-dry t-shirts (3-4)",
    "Cargo pants (2)",
    "Warm socks (4 pairs)",
    "Beanie / warm cap",
  ],
  "Essentials": [
    "First aid kit",
    "Altitude sickness medicine (Diamox)",
    "Sunscreen SPF 50+",
    "Lip balm with SPF",
    "Electrolyte sachets",
    "Pain relief spray",
    "Personal medications",
  ],
  "Gear & Electronics": [
    "Action camera / GoPro",
    "Phone mount for bike",
    "Power bank (20000mAh)",
    "Charging cables",
    "Waterproof bags / dry sacks",
    "Bungee cords for luggage",
    "Toolkit for bike",
  ],
};

export const emergencyContacts = [
  { name: "Sikkim Police Helpline", number: "100", type: "police" },
  { name: "Ambulance Service", number: "102", type: "medical" },
  { name: "Pelling Police Station", number: "+91-3595-250733", type: "police" },
  { name: "District Hospital Gyalshing", number: "+91-3595-250285", type: "medical" },
  { name: "Highway Helpline", number: "1033", type: "road" },
  { name: "BSNL Customer Care", number: "1500", type: "general" },
];

export const budgetCategories = [
  { category: "Fuel", estimated: 3500 },
  { category: "Food", estimated: 5000 },
  { category: "Accommodation", estimated: 8000 },
  { category: "Permits", estimated: 500 },
  { category: "Miscellaneous", estimated: 3000 },
];

export const mustVisitSpots = [
  {
    name: "Pemayangtse Monastery",
    rating: 4.8,
    time: "1-2 hours",
    description: "One of the oldest monasteries in Sikkim with stunning Kanchenjunga views",
    hidden: false,
    image: "https://s7ap1.scene7.com/is/image/incredibleindia/spiritual-spots-in-pelling-popular?qlt=82&ts=1726655959297",
  },
  {
    name: "Khecheopalri Lake",
    rating: 4.6,
    time: "45 min",
    description: "Sacred wishing lake surrounded by forest and prayer flags",
    hidden: true,
    image: "https://edvanceupsc.com/wp-content/uploads/2021/12/maxresdefault.jpg",
  },
  {
    name: "Rabdentse Ruins",
    rating: 4.4,
    time: "1 hour",
    description: "Ancient ruins of Sikkim’s second capital with scenic forest trails",
    hidden: false,
    image: "https://www.discoverimages.com/p/251/india-sikkim-pelling-rabdentse-ruins-19483787.jpg.webp",
  },
  {
    name: "Buddha Park Ravangla",
    rating: 4.8,
    time: "1.5 hours",
    description: "Massive Buddha statue with panoramic Himalayan views",
    hidden: false,
    image: "https://miro.medium.com/v2/0*QVORolmzs-afKhxc.",
  },
  {
    name: "Temi Tea Garden",
    rating: 4.5,
    time: "1 hour",
    description: "Lush tea estate offering beautiful rolling green landscapes",
    hidden: true,
    image: "https://scontent.fccu1-2.fna.fbcdn.net/v/t39.30808-6/474878305_122214932990172200_8485119097410773648_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=7b2446&_nc_ohc=PNaZbHZ_6LsQ7kNvwEOe7nw&_nc_oc=AdrzIXhAyW1aFygEOBCHCsd94DtF5mP7YhJ3Ri00Rbu_zwAc-kUOZr8a2RmrDUzsrHg&_nc_zt=23&_nc_ht=scontent.fccu1-2.fna&_nc_gid=LP4U8QN_vItzg7wU5J7Akg&_nc_ss=7a389&oh=00_Af0U2j9K0lZPN79DnzqFJbuIZDmewXy51f4F0nItGw8ELg&oe=69EE5D5F",
  },
  {
    name: "Pelling Skywalk",
    rating: 4.3,
    time: "30 min",
    description: "Glass skywalk offering breathtaking valley views",
    hidden: false,
    image: "https://scontent.fccu1-2.fna.fbcdn.net/v/t39.30808-6/605507064_862512436530082_2835745525312044334_n.jpg?stp=dst-jpg_s640x640_tt6&_nc_cat=105&ccb=1-7&_nc_sid=7b2446&_nc_ohc=623lNfgN_TkQ7kNvwGJBmnO&_nc_oc=AdoqQlmaSsXnPa5GK-xa7bGfqTpeyBSjDXfhLiD-HOTQb_ZN3RjWJTy1dCkTIoKNVU8&_nc_zt=23&_nc_ht=scontent.fccu1-2.fna&_nc_gid=w32hhH_4HL6qBAszYZGzqA&_nc_ss=7a389&oh=00_Af0bb95dPHy05ogeIRdeAkJc6zCNu5K4GfJH4tUmz7Uttg&oe=69EE338B",
  },
  {
    name: "Char Dham Namchi",
    rating: 4.6,
    time: "2 hours",
    description: "Pilgrimage site with giant Shiva statue and replicas of Char Dham",
    hidden: false,
    image: "https://curlytales.com/wp-content/uploads/2020/10/1162cba28418a3eaa344dd62176ffa08-1.jpg",
  },
  {
    name: "Samdruptse Hill",
    rating: 4.5,
    time: "1 hour",
    description: "Hilltop with giant Guru Padmasambhava statue",
    hidden: true,
    image: "https://raw.githubusercontent.com/Panchammmm/sikkim_on_wheels/ea2aafc78a314ad28c2cfc1386bfe0cb1387d0f6/src/assets/spot.jpg",
  },
];

export const totalDistance = itinerary.reduce((sum, day) => sum + day.distance, 0);
