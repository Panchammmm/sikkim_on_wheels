export const TRIP_START_DATE = new Date("2026-05-15T06:00:00");

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
  weather: { high: number; low: number; condition: string; rain: number };
}

export const itinerary: DayItinerary[] = [
  {
    day: 1,
    from: "Siliguri",
    to: "Rinchenpong",
    distance: 120,
    travelTime: "5-6 hours",
    elevation: 1700,
    elevationGain: "+1550m",
    difficulty: "moderate",
    route: "Siliguri → Jorethang → Legship → Rinchenpong",
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
    weather: { high: 18, low: 8, condition: "Partly Cloudy", rain: 30 },
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
    route: "Rinchenpong → Dentam → Pelling",
    accommodation: "Hotel Mount Pandim",
    accommodationAddress: "Upper Pelling, West Sikkim 737113",
    highlights: [
      "Sunrise over Kanchenjunga from Rinchenpong",
      "Pemayangtse Monastery - oldest in Sikkim",
      "Rabdentse Ruins - ancient capital",
      "Skywalk at Pelling",
    ],
    foodSpots: [
      "Pelling Main Market - Tibetan eateries",
      "Melting Point - Café with mountain views",
    ],
    tips: [
      "Catch sunrise before leaving Rinchenpong",
      "Roads are well-paved but narrow - ride cautiously",
      "Visit Pemayangtse before 4 PM",
    ],
    weather: { high: 15, low: 5, condition: "Clear Sky", rain: 15 },
  },
  {
    day: 3,
    from: "Pelling",
    to: "Yuksom",
    distance: 40,
    travelTime: "2-3 hours",
    elevation: 1780,
    elevationGain: "-370m",
    difficulty: "moderate",
    route: "Pelling → Khecheopalri → Yuksom",
    accommodation: "Tashigang Resort",
    accommodationAddress: "Yuksom, West Sikkim 737114",
    highlights: [
      "Khecheopalri Lake - sacred wishing lake",
      "Coronation Throne of first Chogyal",
      "Dubdi Monastery trek",
      "Yuksom village charm",
    ],
    foodSpots: [
      "Gupta Restaurant Yuksom - best dal bhat",
      "Local bakeries for fresh bread",
    ],
    tips: [
      "Khecheopalri Lake visit takes ~1 hour",
      "Road has some rough patches near Yuksom",
      "Yuksom is the base for Goechala trek",
    ],
    weather: { high: 17, low: 7, condition: "Light Showers", rain: 55 },
  },
  {
    day: 4,
    from: "Yuksom",
    to: "Ravangla",
    distance: 65,
    travelTime: "3-4 hours",
    elevation: 2200,
    elevationGain: "+420m",
    difficulty: "moderate",
    route: "Yuksom → Tashiding → Ravangla",
    accommodation: "Cherry Resort",
    accommodationAddress: "Ravangla, South Sikkim 737139",
    highlights: [
      "Tashiding Monastery - holiest in Sikkim",
      "Buddha Park (Tathagata Tsal)",
      "Tea gardens of Ravangla",
      "Maenam Hill viewpoint",
    ],
    foodSpots: [
      "Ravangla Bazaar - local Sikkimese cuisine",
      "Buddha Park cafeteria",
    ],
    tips: [
      "Tashiding monastery is a slight detour but worth it",
      "Buddha Park closes at 5 PM",
      "Ravangla has the best tea - buy some to take home",
    ],
    weather: { high: 16, low: 6, condition: "Mostly Clear", rain: 20 },
  },
  {
    day: 5,
    from: "Ravangla",
    to: "Siliguri",
    distance: 150,
    travelTime: "6-7 hours",
    elevation: 150,
    elevationGain: "-2050m",
    difficulty: "challenging",
    route: "Ravangla → Namchi → Melli → Teesta Bazaar → Siliguri",
    accommodation: "Journey ends at Siliguri",
    accommodationAddress: "N/A",
    highlights: [
      "Namchi Char Dham & Samdruptse viewpoint",
      "Temi Tea Garden stop",
      "Teesta River descent",
      "Final stretch along NH10",
    ],
    foodSpots: [
      "Namchi Market - farewell momos",
      "Teesta Bazaar - riverside lunch",
    ],
    tips: [
      "Long riding day - start by 6 AM",
      "Road from Melli to Siliguri gets heavy traffic after 3 PM",
      "Keep energy bars and water handy",
    ],
    weather: { high: 28, low: 18, condition: "Warm & Humid", rain: 40 },
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
  { name: "Pemayangtse Monastery", rating: 4.8, time: "1-2 hours", description: "One of the oldest monasteries in Sikkim with stunning Kanchenjunga views", hidden: false },
  { name: "Khecheopalri Lake", rating: 4.5, time: "45 min", description: "Sacred wishing lake surrounded by prayer flags and pristine forest", hidden: true },
  { name: "Rabdentse Ruins", rating: 4.3, time: "1 hour", description: "Remnants of the second capital of the former kingdom of Sikkim", hidden: false },
  { name: "Dubdi Monastery", rating: 4.6, time: "2 hours (trek)", description: "Oldest monastery in Sikkim accessible via a beautiful forest trek from Yuksom", hidden: true },
  { name: "Buddha Park Ravangla", rating: 4.7, time: "1.5 hours", description: "130-foot Buddha statue surrounded by landscaped gardens", hidden: false },
  { name: "Temi Tea Garden", rating: 4.4, time: "1 hour", description: "Only tea garden in Sikkim with panoramic Himalayan views", hidden: true },
  { name: "Pelling Skywalk", rating: 4.2, time: "30 min", description: "Glass-floor skywalk with jaw-dropping valley views", hidden: false },
];

export const totalDistance = itinerary.reduce((sum, day) => sum + day.distance, 0);
