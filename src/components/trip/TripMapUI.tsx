import React, { RefObject } from "react";
import { DayItinerary, DifficultyConfig, SidebarTab, DayMeta } from "@/data/tripData";
import { getDayMeta } from "@/hooks/mapUtils";

// Primitive sub-components
export const DayTab: React.FC<{
    day: DayItinerary;
    index: number;
    active: boolean;
    onClick: () => void;
}> = ({ day, index, active, onClick }) => {
    const { color } = getDayMeta(index);
    return (
        <button
            onClick={onClick}
            role="tab"
            aria-selected={active}
            className="rounded-full px-4 py-2 text-[13px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 border-2"
            style={{
                borderColor: active ? color : "transparent",
                background: active ? color : "rgba(255,255,255,0.07)",
                color: active ? "#fff" : "rgba(255,255,255,0.55)",
            }}
        >
            Day {day.day}
        </button>
    );
};

export const StatPill: React.FC<{
    icon: string; value: string; label: string;
}> = ({ icon, value, label }) => (
    <div className="flex flex-col items-center gap-0.5 bg-white/[0.06] rounded-xl px-3.5 py-2.5 min-w-[72px]">
        <span className="text-lg" aria-hidden="true">{icon}</span>
        <span className="text-white font-bold text-[13px]">{value}</span>
        <span className="text-white/40 text-[10px] uppercase tracking-widest">{label}</span>
    </div>
);

export const Section: React.FC<{
    title: string; icon: string; color: string; children: React.ReactNode;
}> = ({ title, icon, color, children }) => (
    <div className="mb-5">
        <div className="flex items-center gap-2 mb-2.5">
            <span className="text-[15px]" aria-hidden="true">{icon}</span>
            <span className="text-[11px] font-bold uppercase tracking-[1.5px]" style={{ color }}>{title}</span>
        </div>
        <div className="pl-3.5 flex flex-col gap-1.5 border-l-2" style={{ borderColor: `${color}40` }}>
            {children}
        </div>
    </div>
);

export const ListItem: React.FC<{ text: string }> = ({ text }) => (
    <p className="text-white/75 text-[13px] leading-relaxed m-0">{text}</p>
);

// MapPanel — the left half: the Google Maps div + loading overlay
export type MapPanelProps = {
    mapRef: RefObject<HTMLDivElement>;
    mapLoaded: boolean;
    accentColor: string;
    dayLabel: string; // e.g. "Day 2 route from Rinchenpong to Pelling City"
};

export const MapPanel: React.FC<MapPanelProps> = ({
    mapRef, mapLoaded, accentColor, dayLabel,
}) => (
    <div className="flex-1 relative min-w-0">
        <div
            ref={mapRef}
            className="w-full h-full"
            role="application"
            aria-label={dayLabel}
        />
        {!mapLoaded && (
            <div
                className="absolute inset-0 bg-[#0d1117] flex flex-col items-center justify-center gap-3.5"
                role="status"
                aria-label="Loading map"
            >
                <div
                    className="w-9 h-9 rounded-full border-[3px] border-t-transparent animate-spin"
                    style={{ borderColor: `${accentColor} transparent transparent transparent` }}
                    aria-hidden="true"
                />
                <span className="text-white/40 text-xs">Loading map…</span>
            </div>
        )}
    </div>
);

// Sidebar — the right panel: stops, stats, difficulty, tabs, content
export type SidebarProps = {
    day: DayItinerary;
    meta: DayMeta;
    activeTab: SidebarTab;
    onTabChange: (tab: SidebarTab) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ day, meta, activeTab, onTabChange }) => {
    const difficultyConfig = DifficultyConfig[day.difficulty];

    return (
        <div className="w-[300px] shrink-0 bg-[#141820] overflow-y-auto border-l border-white/[0.06] flex flex-col">

            {/* Route stops */}
            <div className="p-4 border-b border-white/[0.06]">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 m-0">Route Stops</p>
                <ol className="flex flex-col list-none m-0 p-0">
                    {meta.stops.map((stop, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                            <div className="flex flex-col items-center shrink-0">
                                <div
                                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold text-white z-10"
                                    style={{ background: meta.color }}
                                    aria-label={`Stop ${i + 1}`}
                                >
                                    {i + 1}
                                </div>
                                {i < meta.stops.length - 1 && (
                                    <div className="w-[2px] h-5 my-0.5" style={{ background: `${meta.color}35` }} aria-hidden="true" />
                                )}
                            </div>
                            <span className="text-white/65 text-[13px] pt-[3px] pb-2">{stop.label}</span>
                        </li>
                    ))}
                </ol>
            </div>

            {/* Stats */}
            <div className="flex gap-2 p-3 flex-wrap border-b border-white/[0.06]">
                <StatPill icon="🏍️" value={`${day.distance}km`} label="Distance" />
                <StatPill icon="⏱️" value={day.travelTime} label="Ride Time" />
                <StatPill icon="⛰️" value={`${day.elevation}m`} label="Elevation" />
            </div>

            {/* Difficulty + Stay */}
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: difficultyConfig.color }} aria-hidden="true" />
                    <span
                        className="text-[11px] font-bold"
                        style={{ color: difficultyConfig.color }}
                        aria-label={`Difficulty: ${difficultyConfig.label}`}
                    >
                        {difficultyConfig.label}
                    </span>
                </div>
                <p className="text-white/60 text-xs text-right max-w-[160px] leading-snug m-0">
                    🏠 {day.accommodation}
                </p>
            </div>

            {/* Content tabs */}
            <div role="tablist" aria-label="Day details" className="flex border-b border-white/[0.06]">
                {(["highlights", "food", "tips"] as const).map((tab) => (
                    <button
                        key={tab}
                        role="tab"
                        aria-selected={activeTab === tab}
                        onClick={() => onTabChange(tab)}
                        className="flex-1 py-3 px-1 bg-transparent cursor-pointer text-[10px] font-bold uppercase tracking-widest transition-all duration-200 border-0 border-b-2"
                        style={{
                            color: activeTab === tab ? meta.color : "rgba(255,255,255,0.3)",
                            borderBottomColor: activeTab === tab ? meta.color : "transparent",
                        }}
                    >
                        {tab === "highlights" ? "✨ Sights" : tab === "food" ? "🍜 Food" : "💡 Tips"}
                    </button>
                ))}
            </div>

            {/* Tab content */}
            <div role="tabpanel" className="p-4 flex-1">
                {activeTab === "highlights" && (
                    <Section title="Highlights" icon="✨" color={meta.color}>
                        {day.highlights.map((h, i) => <ListItem key={i} text={h} />)}
                    </Section>
                )}
                {activeTab === "food" && (
                    <Section title="Food Spots" icon="🍜" color={meta.color}>
                        {day.foodSpots.map((f, i) => <ListItem key={i} text={f} />)}
                    </Section>
                )}
                {activeTab === "tips" && (
                    <Section title="Rider Tips" icon="💡" color={meta.color}>
                        {day.tips.map((t, i) => <ListItem key={i} text={t} />)}
                    </Section>
                )}
            </div>
        </div>
    );
};