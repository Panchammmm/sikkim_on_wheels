import HeroSection from "@/components/trip/HeroSection";
import StickyNav from "@/components/trip/StickyNav";
import TripOverview from "@/components/trip/TripOverview";
import ItinerarySection from "@/components/trip/ItinerarySection";
import ElevationChart from "@/components/trip/ElevationChart";
import WeatherDashboard from "@/components/trip/WeatherDashboard";
import SightseeingMap from "@/components/trip/SightseeingMap";
import DocumentsSection from "@/components/trip/DocumentsSection";
import PackingChecklist from "@/components/trip/PackingChecklist";
import MustVisitSpots from "@/components/trip/MustVisitSpots";
import BudgetTracker from "@/components/trip/BudgetTracker";
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
      <SightseeingMap />
      <DocumentsSection />
      <MustVisitSpots />
      <EmergencyContacts />
      <FooterSection />
    </div>
  );
}
