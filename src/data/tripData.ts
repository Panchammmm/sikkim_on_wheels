import type { DayItinerary, Spot } from "@/data/types";

import SamdruptseImg from "@/assets/samdruptse.jpg";
import CharDamImg from "@/assets/CharDam.jpg";
import BuddhaParkImg from "@/assets/BuddhaPark.webp";
import PemayangtseImg from "@/assets/Pemayangtse.jpeg";
import KhecheopalriImg from "@/assets/Khecheopalri.jpg";
import RabdentseImg from "@/assets/Rabdentse.webp";
import PellingSkywalkImg from "@/assets/PellingSkywalk.png";
import TemiTeaGardenImg from "@/assets/TemiTeaGarden.png";

export const TRIP_START_DATE = new Date("2026-06-18T06:00:00+05:30");

export const DifficultyConfig: Record<
  DayItinerary["difficulty"],
  { label: string; color: string }
> = {
  easy: { label: "Easy", color: "#10B981" },
  moderate: { label: "Moderate", color: "#F59E0B" },
  challenging: { label: "Challenging", color: "#EF4444" },
};

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
      "Rimbi Waterfall & Orange Garden",
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
    distance: 101,
    travelTime: "6-7 hours",
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

export const emergencyContacts = [
  { name: "Sikkim Police Helpline", number: "100", type: "police" },
  { name: "Ambulance Service", number: "102", type: "medical" },
  { name: "Pelling Police Station", number: "+91-3595-250733", type: "police" },
  { name: "District Hospital Gyalshing", number: "+91-3595-250285", type: "medical" },
  { name: "Highway Helpline", number: "1033", type: "road" },
  { name: "BSNL Customer Care", number: "1500", type: "general" },
];

export const mustVisitSpots: Spot[] = [
  {
    id: "pemayangtse-monastery",
    name: "Pemayangtse Monastery",
    rating: 4.8,
    time: "30 mins",
    description:
      "One of the oldest monasteries in Sikkim, offering serene surroundings and stunning views of Kanchenjunga.",
    hidden: false,
    image: PemayangtseImg,
  },
  {
    id: "khecheopalri-lake",
    name: "Khecheopalri Lake",
    rating: 4.6,
    time: "1 hour",
    description:
      "A sacred wishing lake surrounded by dense forest and prayer flags, known for its peaceful atmosphere and trek.",
    hidden: true,
    image: KhecheopalriImg,
  },
  {
    id: "rabdentse-ruins",
    name: "Rabdentse Ruins",
    rating: 4.4,
    time: "40 mins",
    description:
      "Historic ruins of Sikkim’s second capital, set amidst forest trails with scenic viewpoints.",
    hidden: false,
    image: RabdentseImg,
  },
  {
    id: "buddha-park-ravangla",
    name: "Buddha Park Ravangla",
    rating: 4.8,
    time: "45 mins",
    description:
      "Home to a towering Buddha statue with breathtaking panoramic views of the surrounding mountains.",
    hidden: false,
    image: BuddhaParkImg,
  },
  {
    id: "temi-tea-garden",
    name: "Temi Tea Garden",
    rating: 4.5,
    time: "20 mins",
    description:
      "Sikkim’s only tea estate, featuring rolling green hills and some of the finest organic tea in India.",
    hidden: true,
    image: TemiTeaGardenImg,
  },
  {
    id: "pelling-skywalk",
    name: "Pelling Skywalk",
    rating: 4.3,
    time: "1 hour",
    description:
      "A glass skywalk offering thrilling views of the valley and surrounding Himalayan landscape.",
    hidden: false,
    image: PellingSkywalkImg,
  },
  {
    id: "Siddheshwar-Char-Dham",
    name: "Siddheshwar Char Dham",
    rating: 4.6,
    time: "1 hour",
    description:
      "A major pilgrimage site featuring a giant Shiva statue and replicas of the Char Dham temples.",
    hidden: false,
    image: CharDamImg,
  },
  {
    id: "samdruptse",
    name: "Samdruptse",
    rating: 4.5,
    time: "20 mins",
    description:
      "Hilltop viewpoint featuring a massive statue of Guru Padmasambhava and sweeping valley views.",
    hidden: true,
    image: SamdruptseImg,
  },
];

export const totalDistance = itinerary.reduce((sum, day) => sum + day.distance, 0);
