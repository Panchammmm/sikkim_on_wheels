import React, { RefObject } from "react";
import type { DayItinerary, DayMeta, SidebarTab } from "@/data/types";
import { DifficultyConfig } from "@/data/tripData";
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
            // On mobile: smaller padding, still readable
            className="rounded-full px-3 py-1.5 sm:px-4 sm:py-2 text-[12px] sm:text-[13px] font-bold tracking-wide whitespace-nowrap transition-all duration-200 border-2"
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
    // On mobile: slightly smaller min-width so all three fit in a row
    <div className="flex flex-col items-center gap-0.5 bg-white/[0.06] rounded-xl px-2.5 py-2 sm:px-3.5 sm:py-2.5 min-w-[60px] sm:min-w-[72px] flex-1">
        <span className="text-base sm:text-lg" aria-hidden="true">{icon}</span>
        <span className="text-white font-bold text-[12px] sm:text-[13px] text-center">{value}</span>
        <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest text-center">{label}</span>
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

// MapPanel — the map canvas + loading overlay
// On mobile this becomes the top half of a stacked layout.
export type MapPanelProps = {
    mapRef: RefObject<HTMLDivElement>;
    mapLoaded: boolean;
    accentColor: string;
    dayLabel: string;
};

export const MapPanel: React.FC<MapPanelProps> = ({
    mapRef, mapLoaded, accentColor, dayLabel,
}) => (
    // Mobile: fixed height so the map doesn't collapse. Desktop: flex-1 fills the row.
    <div className="relative min-w-0 h-[260px] sm:h-auto sm:flex-1">
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

// Sidebar — stops, stats, difficulty, content tabs
export type SidebarProps = {
    day: DayItinerary;
    meta: DayMeta;
    activeTab: SidebarTab;
    onTabChange: (tab: SidebarTab) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ day, meta, activeTab, onTabChange }) => {
    const difficultyConfig = DifficultyConfig[day.difficulty];

    return (
        // Mobile: full width, no left border. Desktop: fixed 300px, left border.
        <div className="w-full sm:w-[300px] sm:shrink-0 bg-[#141820] overflow-y-auto sm:border-l border-t sm:border-t-0 border-white/[0.06] flex flex-col">

            {/* Route stops — horizontal scroll on very small screens */}
            <div className="p-4 border-b border-white/[0.06]">
                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-3 m-0">Route Stops</p>

                {/* Mobile: horizontal pill strip. Desktop: vertical list with connector */}
                <div className="flex sm:hidden gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                    {meta.stops.map((stop, i) => (
                        <div
                            key={i}
                            className="flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium text-white/70 border border-white/10"
                            style={{ background: `${meta.color}18` }}
                        >
                            <span
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                                style={{ background: meta.color }}
                            >
                                {i + 1}
                            </span>
                            {stop.label}
                        </div>
                    ))}
                </div>

                {/* Desktop: vertical list with connector line */}
                <ol className="hidden sm:flex flex-col list-none m-0 p-0">
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

            {/* Stats — always a row, flex-1 per pill so they share width */}
            <div className="flex gap-2 p-3 border-b border-white/[0.06]">
                <StatPill icon="🏍️" value={`${day.distance}km`} label="Distance" />
                <StatPill icon="⏱️" value={day.travelTime} label="RideTime" />
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