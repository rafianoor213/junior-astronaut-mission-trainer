import { NASAImageItem } from '../types/game';

// Robust offline fallback imagery from NASA's official public archives
const FALLBACK_NASA_DATA: Record<string, NASAImageItem[]> = {
  satellite: [
    {
      title: 'Hubble Space Telescope Servicing Mission 4',
      description: 'Astronauts perform extravehicular activity (EVA) spacewalk repairs on the Hubble Space Telescope in low Earth orbit.',
      imageUrl: 'https://images-assets.nasa.gov/image/iss020e038502/iss020e038502~medium.jpg',
      nasaId: 'iss020e038502',
    },
    {
      title: 'Solar Dynamics Observatory (SDO) in Solar Orbit',
      description: 'SDO studies solar flares, coronal mass ejections, and the magnetic field of the Sun to protect space missions.',
      imageUrl: 'https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e001435/GSFC_20171208_Archive_e001435~medium.jpg',
      nasaId: 'GSFC_20171208_Archive_e001435',
    },
  ],
  spacestation: [
    {
      title: 'International Space Station (ISS) Cupola & Solar Arrays',
      description: 'The ISS orbits Earth every 90 minutes. Its Environmental Control and Life Support System (ECLSS) recycles up to 98% of water and oxygen.',
      imageUrl: 'https://images-assets.nasa.gov/image/iss065e094406/iss065e094406~medium.jpg',
      nasaId: 'iss065e094406',
    },
    {
      title: 'Astronaut Conducting Life Support System Checks',
      description: 'Flight engineers inspect atmospheric revitalization and water recovery assemblies inside Destiny laboratory module.',
      imageUrl: 'https://images-assets.nasa.gov/image/iss036e006175/iss036e006175~medium.jpg',
      nasaId: 'iss036e006175',
    },
  ],
  moon: [
    {
      title: 'Apollo Lunar Surface & Astronaut Exploration',
      description: 'Astronaut explores the lunar regolith. Future Artemis missions target the Moon’s South Pole to extract water ice trapped in permanently shadowed craters.',
      imageUrl: 'https://images-assets.nasa.gov/image/as11-40-5903/as11-40-5903~medium.jpg',
      nasaId: 'as11-40-5903',
    },
    {
      title: 'Artemis Lunar Terrain Vehicle & Shackleton Crater',
      description: 'Lunar rovers assist astronauts across rocky terrain, carrying ice drills and multi-spectral spectrometers to search for volatiles.',
      imageUrl: 'https://images-assets.nasa.gov/image/PIA24550/PIA24550~medium.jpg',
      nasaId: 'PIA24550',
    },
  ],
  reentry: [
    {
      title: 'NASA Orion Spacecraft Pacific Ocean Splashdown',
      description: 'Orion capsule returned from lunar orbit, enduring 2,760°C during atmospheric re-entry before deploying drogue and main parachutes.',
      imageUrl: 'https://images-assets.nasa.gov/image/art001e000670/art001e000670~medium.jpg',
      nasaId: 'art001e000670',
    },
    {
      title: 'Spacecraft Atmospheric Re-entry Plasma Sheath',
      description: 'During hypersonic re-entry, ionized air surrounds the capsule, requiring precise heat shield thermal ablation and attitude control.',
      imageUrl: 'https://images-assets.nasa.gov/image/NHQ202212110034/NHQ202212110034~medium.jpg',
      nasaId: 'NHQ202212110034',
    },
  ],
};

// In-memory cache to prevent redundant API calls
const imageCache: Record<string, NASAImageItem> = {};

/**
 * Fetch a real NASA space image using NASA's free public Search API.
 * Gracefully falls back to pre-verified NASA archive images if offline or rate-limited.
 */
export async function fetchNASAImage(query: string, category: 'satellite' | 'spacestation' | 'moon' | 'reentry'): Promise<NASAImageItem> {
  const cacheKey = `${category}-${query}`;
  if (imageCache[cacheKey]) {
    return imageCache[cacheKey];
  }

  const fallbackList = FALLBACK_NASA_DATA[category] || FALLBACK_NASA_DATA.satellite;
  const defaultFallback = fallbackList[Math.floor(Math.random() * fallbackList.length)];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout for fast UI

    const url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!res.ok) {
      imageCache[cacheKey] = defaultFallback;
      return defaultFallback;
    }

    const data = await res.json();
    const items = data?.collection?.items;

    if (items && items.length > 0) {
      // Find an item with both data and links
      for (const item of items.slice(0, 5)) {
        const itemData = item.data?.[0];
        const link = item.links?.[0]?.href;
        if (itemData && link) {
          const result: NASAImageItem = {
            title: itemData.title || defaultFallback.title,
            description: itemData.description ? itemData.description.slice(0, 220) + '...' : defaultFallback.description,
            imageUrl: link,
            date: itemData.date_created,
            nasaId: itemData.nasa_id,
          };
          imageCache[cacheKey] = result;
          return result;
        }
      }
    }
  } catch {
    // Network error or timeout: seamlessly use high-quality NASA archive fallback
  }

  imageCache[cacheKey] = defaultFallback;
  return defaultFallback;
}

// NASA educational facts for each mission phase
export const NASA_EDUCATIONAL_FACTS = {
  satellite: [
    'NASA operates dozens of satellites in Low Earth Orbit (LEO) traveling at ~28,000 km/h (17,500 mph).',
    'Satellite solar arrays must continually tilt to track the Sun using onboard sun sensors and reaction wheels.',
    'Communications with spacecraft rely on NASA’s Deep Space Network (DSN) antennas located in California, Spain, and Australia.',
  ],
  spacestation: [
    'The International Space Station ECLSS recycles over 98% of all water onboard through vacuum distillation and filtration.',
    'NASA’s Sabatier reactor combines exhaled carbon dioxide with hydrogen to produce fresh water and methane.',
    'Oxygen on the ISS is produced primarily via water electrolysis, splitting H2O molecules into breathable O2 and hydrogen gas.',
  ],
  moon: [
    'The Moon has no atmosphere, meaning temperatures swing from a searing 120°C in sunlight down to -130°C in the shade.',
    'Permanently shadowed craters at the lunar South Pole (like Shackleton) hold millions of tons of ancient water ice.',
    'Lunar regolith contains roughly 40-45% oxygen bound to silicon, iron, and titanium minerals, which can be extracted via thermal chemical reduction.',
    'NASA Artemis astronauts will utilize Lunar Terrain Vehicles (LTV) to travel kilometers across the South Pole region.',
  ],
  reentry: [
    'Orion hits Earth’s upper atmosphere at Mach 25 (over 30,000 km/h) after returning from the Moon.',
    'The spacecraft heat shield is covered in Avcoat ablator tiles that vaporize layer by layer to dissipate up to 2,760°C.',
    'NASA uses a "skip entry" trajectory technique to dip into the atmosphere, bleed off extreme velocity, and target precise landing zones.',
    'Drogue parachutes deploy at high altitude to stabilize the capsule before the three giant main canopies deploy at ~2,500 meters.',
  ],
};
