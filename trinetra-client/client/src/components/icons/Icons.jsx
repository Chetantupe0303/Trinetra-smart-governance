import React from "react";

/**
 * Trinetra Icon Set — clean stroke-based SVGs, no emoji.
 * All icons accept className for sizing/coloring via currentColor.
 */

const base = "w-5 h-5";

export const IconRoad = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 20L9 4h6l5 16M11 10h2M10 15h4" />
  </svg>
);

export const IconWater = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3s6 7.2 6 11.5A6 6 0 016 14.5C6 10.2 12 3 12 3z" />
  </svg>
);

export const IconElectric = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
  </svg>
);

export const IconTrash = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M9 7V4h6v3m-8 0l1 13a2 2 0 002 2h4a2 2 0 002-2l1-13" />
  </svg>
);

export const IconSewage = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="8" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 2" />
  </svg>
);

export const IconLight = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 18h6M10 21h4M12 3a6 6 0 00-3.6 10.8c.6.5.9 1 .9 1.7V16h5.4v-.5c0-.7.3-1.2.9-1.7A6 6 0 0012 3z" />
  </svg>
);

export const IconTree = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l4 6h-2.5l3.5 5h-3v2a2 2 0 11-4 0v-2h-3l3.5-5H8l4-6z" />
  </svg>
);

export const IconTraffic = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <rect x="8" y="2" width="8" height="16" rx="2" strokeWidth={1.8} />
    <circle cx="12" cy="6" r="1.2" fill="currentColor" />
    <circle cx="12" cy="10" r="1.2" fill="currentColor" />
    <circle cx="12" cy="14" r="1.2" fill="currentColor" />
    <path strokeLinecap="round" strokeWidth={1.8} d="M12 18v4" />
  </svg>
);

export const IconNoise = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5L6 9H3v6h3l5 4V5z" />
    <path strokeLinecap="round" strokeWidth={1.8} d="M16 8a5 5 0 010 8M18.5 5.5a9 9 0 010 13" />
  </svg>
);

export const IconOther = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const categoryIconMap = {
  Roads: IconRoad,
  Water: IconWater,
  Electricity: IconElectric,
  Garbage: IconTrash,
  Sewage: IconSewage,
  "Street Lights": IconLight,
  Parks: IconTree,
  Traffic: IconTraffic,
  Noise: IconNoise,
  Other: IconOther,
};

export const IconGear = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

export const IconWrench = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.7 6.3a4 4 0 00-5.4 5.4L3 18v3h3l6.3-6.3a4 4 0 005.4-5.4l-2.83 2.83-2.83-2.83L14.7 6.3z" />
  </svg>
);

export const IconSupervisor = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="9" cy="8" r="3" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 20a6 6 0 0112 0M16 4.2a3 3 0 010 5.6M20 20a5.5 5.5 0 00-5-5.9" />
  </svg>
);

export const IconChart = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 19V10m6 9V5m6 14v-7m-6 7h6M4 19h2" />
  </svg>
);

export const IconPlus = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 4v16m8-8H4" />
  </svg>
);

export const IconKey = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="8" cy="15" r="4" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 12l8-8m0 0h-4m4 0v4" />
  </svg>
);

export const IconSparkle = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3v4M12 17v4M4 12h4M16 12h4M6.3 6.3l2.8 2.8M14.9 14.9l2.8 2.8M17.7 6.3l-2.8 2.8M9.1 14.9l-2.8 2.8" />
  </svg>
);

export const IconLogout = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

export const IconCamera = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 8a2 2 0 012-2h1.2a1 1 0 00.9-.55l.4-.9A1 1 0 019.4 4h5.2a1 1 0 01.9.55l.4.9a1 1 0 00.9.55H18a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V8z" />
    <circle cx="12" cy="13" r="3.2" strokeWidth={1.8} />
  </svg>
);

export const IconPin = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s7-6.6 7-11.5A7 7 0 105 9.5C5 14.4 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.3" strokeWidth={1.8} />
  </svg>
);

export const IconNote = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

export const IconEye = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.5 12S6 5 12 5s9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z" />
    <circle cx="12" cy="12" r="3" strokeWidth={1.8} />
  </svg>
);

export const IconShield = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 3l7 3v6c0 4.5-3 7.7-7 9-4-1.3-7-4.5-7-9V6l7-3z" />
  </svg>
);

export const IconCheck = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const IconDetails = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const IconInfo = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <circle cx="12" cy="12" r="9" strokeWidth={1.8} />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 11v5m0-8h.01" />
  </svg>
);

export const IconRocket = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 15c3-1 5-4 5-8.5C17 4 15.5 3 14 3c-4.5 0-8 4-9 8 1 0 3 0 4 1s1 3 1 4c4-1 7-3 8-6" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 15l-3 3m9-9a1.2 1.2 0 100 2.4A1.2 1.2 0 0015 9zM5.5 12S4 15 5 19c4 1 7-.5 7-.5" />
  </svg>
);

export const IconHome = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 11l8-7 8 7M6 10v9a1 1 0 001 1h3v-6h4v6h3a1 1 0 001-1v-9" />
  </svg>
);

export const IconMessage = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a8 8 0 01-8 8H7l-4 3 .5-4.2A8 8 0 1121 12z" />
  </svg>
);

export const IconClock = ({ className = base }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
