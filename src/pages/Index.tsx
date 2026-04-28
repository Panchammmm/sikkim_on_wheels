import HeroSection from "@/components/trip/HeroSection";
import StickyNav from "@/components/trip/StickyNav";
import TripOverview from "@/components/trip/TripOverview";
import ItinerarySection from "@/components/trip/ItinerarySection";
import ElevationChart from "@/components/trip/ElevationChart";
import WeatherDashboard from "@/components/trip/WeatherDashboard";
import TripMap from "@/components/trip/TripMap";
import DocumentsSection from "@/components/trip/DocumentsSection";
import MustVisitSpots from "@/components/trip/MustVisitSpots";
import EmergencyContacts from "@/components/trip/EmergencyContacts";
import FooterSection from "@/components/trip/FooterSection";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <StickyNav />
      <HeroSection />
      <TripOverview />
      <ItinerarySection />
      <ElevationChart />
      <WeatherDashboard />
      <TripMap />
      <DocumentsSection />
      <MustVisitSpots />
      <EmergencyContacts />
      <FooterSection />
    </div>
  );
}
