'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { fetchNASAImage, NASA_EDUCATIONAL_FACTS } from '../../utils/nasaApi';
import { NASAImageItem } from '../../types/game';

interface SatelliteMissionProps {
  onComplete: () => void;
  onAddScore: (points: number) => void;
}

export default function SatelliteMission({ onComplete, onAddScore }: SatelliteMissionProps) {
  // 3 tasks
  const [solarPanelFixed, setSolarPanelFixed] = useState(false);
  const [cableFixed, setCableFixed] = useState(false);
  const [commFixed, setCommFixed] = useState(false);

  // Solar panel alignment state (0 to 100)
  const [panelAngle, setPanelAngle] = useState(25);
  // Comm frequency tuner (target is 142)
  const [freq, setFreq] = useState(110);

  // NASA image & fact
  const [nasaImage, setNasaImage] = useState<NASAImageItem | null>(null);
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    fetchNASAImage('Hubble Space Telescope servicing mission', 'satellite').then((data) => {
      setNasaImage(data);
    });
    const facts = NASA_EDUCATIONAL_FACTS.satellite;
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  const handleAlignSolar = () => {
    sounds.playRepair();
    setPanelAngle(100);
    setSolarPanelFixed(true);
    onAddScore(250);
    checkIfAllDone(true, cableFixed, commFixed);
  };

  const handleFixCable = () => {
    sounds.playRepair();
    setCableFixed(true);
    onAddScore(250);
    checkIfAllDone(solarPanelFixed, true, commFixed);
  };

  const handleTuneComm = () => {
    sounds.playRepair();
    setFreq(142);
    setCommFixed(true);
    onAddScore(250);
    checkIfAllDone(solarPanelFixed, cableFixed, true);
  };

  const checkIfAllDone = (solar: boolean, cable: boolean, comm: boolean) => {
    if (solar && cable && comm) {
      sounds.playSuccess();
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const allFixed = solarPanelFixed && cableFixed && commFixed;
  const progressPercent = Math.round(((Number(solarPanelFixed) + Number(cableFixed) + Number(commFixed)) / 3) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header bar */}
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
            PHASE 1 OF 3: SATELLITE REPAIR
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>🛰️ REPAIR DAMAGED SATELLITE</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '650px' }}>
            Satellite Alpha-7 was struck by micro-meteoroids in low Earth orbit. Restore solar tracking, reconnect the high-voltage bus, and tune the RF carrier dish.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SYSTEM INTEGRITY</div>
          <div
            style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              color: allFixed ? '#00e676' : '#ffd166',
              fontFamily: 'monospace',
            }}
          >
            {progressPercent}%
          </div>
        </div>
      </div>

      {/* Main satellite visual stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Interactive Satellite Diagram */}
        <div
          className="glass-panel"
          style={{
            padding: '30px 20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(13, 23, 44, 0.9) 0%, #050814 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Orbit Grid lines */}
          <div
            style={{
              position: 'absolute',
              width: '320px',
              height: '320px',
              borderRadius: '50%',
              border: '1px dashed rgba(0, 229, 255, 0.2)',
              pointerEvents: 'none',
            }}
          />

          {/* Satellite SVG Artwork */}
          <svg width="280" height="180" viewBox="0 0 280 180" style={{ filter: 'drop-shadow(0 0 16px rgba(0,229,255,0.3))' }}>
            {/* Left Solar Panel */}
            <rect
              x="20"
              y="65"
              width="70"
              height="50"
              rx="4"
              fill={solarPanelFixed ? '#0284c7' : '#475569'}
              stroke={solarPanelFixed ? '#38bdf8' : '#ef4444'}
              strokeWidth="2"
              style={{ transition: 'all 0.5s ease' }}
            />
            <line x1="43" y1="65" x2="43" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="66" y1="65" x2="66" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="20" y1="90" x2="90" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

            {/* Left Arm */}
            <line x1="90" y1="90" x2="110" y2="90" stroke="#94a3b8" strokeWidth="4" />

            {/* Satellite Central Body */}
            <rect x="110" y="55" width="60" height="70" rx="8" fill="#1e293b" stroke="#00e5ff" strokeWidth="2.5" />
            {/* Gold Thermal Blanket details */}
            <rect x="118" y="65" width="44" height="50" fill="#ca8a04" opacity="0.6" rx="2" />

            {/* Right Arm */}
            <line x1="170" y1="90" x2="190" y2="90" stroke="#94a3b8" strokeWidth="4" />

            {/* Right Solar Panel */}
            <rect
              x="190"
              y="65"
              width="70"
              height="50"
              rx="4"
              fill={solarPanelFixed ? '#0284c7' : '#475569'}
              stroke={solarPanelFixed ? '#38bdf8' : '#ef4444'}
              strokeWidth="2"
              style={{ transition: 'all 0.5s ease' }}
            />
            <line x1="213" y1="65" x2="213" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="236" y1="65" x2="236" y2="115" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="190" y1="90" x2="260" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />

            {/* Communication Dish Antenna on Top */}
            <path
              d="M 125,55 Q 140,30 155,55"
              fill="none"
              stroke={commFixed ? '#00e676' : '#ef4444'}
              strokeWidth="3"
              style={{ transition: 'stroke 0.5s ease' }}
            />
            <line x1="140" y1="42" x2="140" y2="20" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="140" cy="20" r="3" fill={commFixed ? '#00e676' : '#ef4444'} />

            {/* Cable Harness on Bottom */}
            <path
              d={cableFixed ? 'M 130,125 Q 140,150 150,125' : 'M 130,125 Q 133,145 137,135 M 143,142 Q 147,133 150,125'}
              fill="none"
              stroke={cableFixed ? '#00e676' : '#ef4444'}
              strokeWidth="2.5"
              strokeDasharray={cableFixed ? 'none' : '3,3'}
              style={{ transition: 'all 0.5s ease' }}
            />
          </svg>

          <div style={{ marginTop: '14px', fontSize: '0.85rem', color: allFixed ? '#00e676' : '#94a3b8', fontWeight: 600 }}>
            {allFixed ? '✓ SATELLITE ALPHA-7 ONLINE & STABILIZED' : 'STATUS: DIAGNOSTIC REPAIR REQUIRED'}
          </div>
        </div>

        {/* NASA Educational & Real Photo Card */}
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
              <span className="badge badge-gold">NASA PUBLIC DATA</span>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real Mission Insight</span>
            </div>
            {nasaImage ? (
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.2)', marginBottom: '10px' }}>
                <img
                  src={nasaImage.imageUrl}
                  alt={nasaImage.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    // Fallback to solid NASA graphic if network image drops
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.5)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#00e5ff' }}>{nasaImage.title}</strong>
                </div>
              </div>
            ) : (
              <div style={{ height: '140px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Loading NASA Imagery...
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              💡 <strong style={{ color: '#fff' }}>NASA Fact:</strong> {randomFact}
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
            Data source: NASA Open Data Archives & DSN Telemetry Protocols
          </div>
        </div>
      </div>

      {/* 3 Repair Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {/* 1. Solar Panel Fix */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: solarPanelFixed ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>1. SOLAR PANEL ARRAY</span>
            {solarPanelFixed ? (
              <span className="badge badge-green">OPTIMAL</span>
            ) : (
              <span className="badge badge-red">MISALIGNED</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Solar cell tracking gimbal is stuck at {panelAngle}°. Align toward the Sun for maximum power harvesting.
          </p>
          <button
            disabled={solarPanelFixed}
            onClick={handleAlignSolar}
            className={solarPanelFixed ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {solarPanelFixed ? '✓ 100% SOLAR HARVESTED' : '⚡ FIX SOLAR PANEL (+250)'}
          </button>
        </div>

        {/* 2. Cable Reconnect */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: cableFixed ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>2. POWER & DATA CABLE</span>
            {cableFixed ? (
              <span className="badge badge-green">CONNECTED</span>
            ) : (
              <span className="badge badge-red">SEVERED</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            High-voltage bus cable severed by debris. Re-solder wire harness to restore telemetry flow.
          </p>
          <button
            disabled={cableFixed}
            onClick={handleFixCable}
            className={cableFixed ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {cableFixed ? '✓ POWER BUS RESTORED' : '🔌 REPAIR CABLE (+250)'}
          </button>
        </div>

        {/* 3. Communication System */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: commFixed ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>3. COMM SYSTEM</span>
            {commFixed ? (
              <span className="badge badge-green">LOCKED (142 MHz)</span>
            ) : (
              <span className="badge badge-red">NO SIGNAL ({freq} MHz)</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Telemetry dish is out of tune. Calibrate RF antenna frequency to lock with ground station.
          </p>
          <button
            disabled={commFixed}
            onClick={handleTuneComm}
            className={commFixed ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {commFixed ? '✓ CARRIER SIGNAL LOCKED' : '📡 TUNE COMM SYSTEM (+250)'}
          </button>
        </div>
      </div>
    </div>
  );
}
