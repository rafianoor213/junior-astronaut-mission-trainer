'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { fetchNASAImage } from '../../utils/nasaApi';
import { NASAImageItem } from '../../types/game';

interface ResourceDiscoveryMissionProps {
  onComplete: () => void;
  onAddScore: (points: number) => void;
}

interface ResourceTarget {
  id: 'water' | 'minerals' | 'oxygen' | 'solar';
  name: string;
  icon: string;
  sensorBand: string;
  location: string;
  nasaFact: string;
  x: number; // percentage on map
  y: number;
}

const RESOURCE_TARGETS: ResourceTarget[] = [
  {
    id: 'water',
    name: 'Water Ice Deposits',
    icon: '💧',
    sensorBand: 'Infrared & Neutron Spectrometry',
    location: 'Shackleton Crater Floor (-89.9°S)',
    nasaFact: 'Permanently shadowed regions remain at -246°C, harboring millions of tons of ancient water ice essential for rocket propellant and life support.',
    x: 48,
    y: 78,
  },
  {
    id: 'minerals',
    name: 'Ilmenite & Titanium Minerals',
    icon: '⛏️',
    sensorBand: 'Visible & Near-Infrared Reflectance',
    location: 'Mare Tranquillitatis Basalt Plateaus',
    nasaFact: 'Ilmenite (FeTiO3) is rich in titanium and iron, and serves as an abundant source for building lunar base infrastructure.',
    x: 72,
    y: 38,
  },
  {
    id: 'oxygen',
    name: 'Regolith-Bound Oxygen',
    icon: '💨',
    sensorBand: 'Gamma-Ray Spectroscopy',
    location: 'Oceanus Procellarum Highland Regolith',
    nasaFact: 'Over 40% of lunar soil by weight consists of trapped oxygen. Carbothermal reduction reactors can extract breathable oxygen directly on the Moon.',
    x: 26,
    y: 42,
  },
  {
    id: 'solar',
    name: 'Peaks of Eternal Light',
    icon: '⚡',
    sensorBand: 'Solar Irradiance Flux Radiometer',
    location: 'Malapert Mountain Rim (High Elevation)',
    nasaFact: 'Elevated crater rims near the South Pole experience over 90% continuous solar illumination throughout the year, ideal for uninterrupted solar power generation.',
    x: 54,
    y: 84,
  },
];

export default function ResourceDiscoveryMission({ onComplete, onAddScore }: ResourceDiscoveryMissionProps) {
  const [discovered, setDiscovered] = useState<Record<string, boolean>>({
    water: false,
    minerals: false,
    oxygen: false,
    solar: false,
  });

  const [activeFilter, setActiveFilter] = useState<'all' | 'infrared' | 'gamma' | 'solar'>('all');
  const [selectedTarget, setSelectedTarget] = useState<ResourceTarget | null>(null);
  const [scanningId, setScanningId] = useState<string | null>(null);

  // NASA image
  const [nasaImage, setNasaImage] = useState<NASAImageItem | null>(null);

  useEffect(() => {
    fetchNASAImage('Lunar South Pole Shackleton Crater water ice', 'moon').then((data) => {
      setNasaImage(data);
    });
  }, []);

  const handleScanResource = (target: ResourceTarget) => {
    if (discovered[target.id] || scanningId) return;

    sounds.playBeep(920, 0.15);
    setScanningId(target.id);
    setSelectedTarget(target);

    // Simulate orbital sensor raster scan
    setTimeout(() => {
      sounds.playCollect();
      setDiscovered((prev) => {
        const next = { ...prev, [target.id]: true };
        const count = Object.values(next).filter(Boolean).length;
        if (count === 4) {
          sounds.playSuccess();
          setTimeout(() => {
            onComplete();
          }, 1200);
        }
        return next;
      });
      onAddScore(250);
      setScanningId(null);
    }, 700);
  };

  const discoveredCount = Object.values(discovered).filter(Boolean).length;
  const allDiscovered = discoveredCount === 4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header Bar */}
      <div
        className="glass-panel"
        style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '6px' }}>
            PHASE 3 OF 3: RESOURCE SPECTROMETRY
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>📡 DISCOVER LUNAR RESOURCES</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '650px' }}>
            Calibrate the orbital satellite spectrometer. Scan designated lunar sectors to confirm the 4 critical resources needed for Artemis Moon survival: Water, Minerals, Oxygen, and Solar Energy.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>RESOURCES IDENTIFIED</div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: allDiscovered ? '#00e676' : '#00e5ff',
              fontFamily: 'monospace',
            }}
          >
            {discoveredCount} / 4
          </div>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Interactive Orbital Moon Radar Map */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'radial-gradient(circle at center, #0d1b2a 0%, #030712 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: '#00e5ff', fontWeight: 700 }}>ORBITAL RADAR SWEEP (ALT: 100 KM)</span>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CLICK ANOMALIES TO SCAN</span>
          </div>

          {/* Moon Surface Globe & Target Markers */}
          <div
            style={{
              position: 'relative',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, #475569 0%, #1e293b 65%, #0f172a 100%)',
              boxShadow: 'inset -20px -20px 40px rgba(0,0,0,0.8), 0 0 30px rgba(0, 229, 255, 0.25)',
              border: '2px solid rgba(0, 229, 255, 0.4)',
              overflow: 'hidden',
            }}
          >
            {/* Crater Texture details */}
            <div style={{ position: 'absolute', top: '25%', left: '30%', width: '45px', height: '45px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }} />
            <div style={{ position: 'absolute', top: '65%', left: '45%', width: '60px', height: '60px', borderRadius: '50%', border: '2px solid rgba(0,229,255,0.3)', background: 'rgba(0,0,0,0.35)' }} />
            <div style={{ position: 'absolute', top: '15%', left: '60%', width: '30px', height: '30px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)' }} />

            {/* Radar Sweep Line */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, rgba(0, 229, 255, 0.4) 0deg, transparent 60deg)',
                animation: 'spin 4s linear infinite',
                pointerEvents: 'none',
              }}
            />

            {/* Target Anomaly Markers */}
            {RESOURCE_TARGETS.map((target) => {
              const isFound = discovered[target.id];
              const isScanning = scanningId === target.id;

              return (
                <button
                  key={target.id}
                  onClick={() => handleScanResource(target)}
                  title={`Scan anomaly: ${target.name}`}
                  style={{
                    position: 'absolute',
                    top: `${target.y}%`,
                    left: `${target.x}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isFound ? '36px' : '32px',
                    height: isFound ? '36px' : '32px',
                    borderRadius: '50%',
                    background: isFound ? 'rgba(0, 230, 118, 0.9)' : isScanning ? '#ffd166' : 'rgba(0, 229, 255, 0.85)',
                    border: '2px solid white',
                    color: '#050814',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isFound ? 'default' : 'pointer',
                    boxShadow: isFound ? '0 0 15px rgba(0, 230, 118, 0.8)' : '0 0 15px rgba(0, 229, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    zIndex: 10,
                  }}
                >
                  {isScanning ? '⏳' : target.icon}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: '16px', fontSize: '0.85rem', color: allDiscovered ? '#00e676' : '#94a3b8', fontWeight: 600 }}>
            {allDiscovered ? '✓ ALL 4 VITAL RESOURCES CONFIRMED FOR ARTEMIS' : 'CLICK THE HIGHLIGHTED TARGETS TO SCAN'}
          </div>
        </div>

        {/* Selected Target Dossier / NASA Card */}
        <div
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span className="badge badge-gold">SPECTROMETRY DOSSIER</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>NASA Artemis Prospecting</span>
            </div>

            {selectedTarget ? (
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.3)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '28px' }}>{selectedTarget.icon}</span>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', color: '#00e5ff' }}>{selectedTarget.name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedTarget.location}</span>
                  </div>
                </div>

                <div style={{ fontSize: '0.8rem', color: '#ffd166', marginBottom: '8px', fontFamily: 'monospace' }}>
                  SENSOR: {selectedTarget.sensorBand}
                </div>

                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '10px' }}>
                  {selectedTarget.nasaFact}
                </p>

                <div className="badge badge-green">
                  ✓ SPECTRAL SIGNATURE CONFIRMED
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px 16px', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', color: '#94a3b8' }}>
                <div style={{ fontSize: '32px', marginBottom: '10px' }}>🛰️</div>
                <p style={{ fontSize: '0.9rem' }}>Select an anomaly on the lunar map to view telemetry and extract its spectral signature.</p>
              </div>
            )}

            {/* Real NASA Photo */}
            {nasaImage && (
              <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img
                  src={nasaImage.imageUrl}
                  alt={nasaImage.title}
                  style={{ width: '100%', height: '110px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div style={{ padding: '6px 10px', background: 'rgba(0,0,0,0.5)', fontSize: '0.7rem', color: '#94a3b8' }}>
                  NASA Target: {nasaImage.title}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
            Data source: Lunar Reconnaissance Orbiter (LRO) & NASA VIPER Mission Data
          </div>
        </div>
      </div>

      {/* 4 Resource Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
        }}
      >
        {RESOURCE_TARGETS.map((target) => {
          const isFound = discovered[target.id];

          return (
            <div
              key={target.id}
              className="glass-panel"
              style={{
                padding: '16px',
                borderColor: isFound ? 'rgba(0, 230, 118, 0.4)' : 'rgba(0, 229, 255, 0.25)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  {target.icon} {target.name}
                </span>
                {isFound ? (
                  <span className="badge badge-green">DISCOVERED</span>
                ) : (
                  <span className="badge badge-gold">UNSCANNED</span>
                )}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '10px' }}>
                {target.location}
              </p>
              <button
                disabled={isFound || scanningId !== null}
                onClick={() => handleScanResource(target)}
                className={isFound ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px', fontSize: '0.85rem' }}
              >
                {isFound ? '✓ CONFIRMED' : 'SCAN SECTOR (+250)'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
