'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { fetchNASAImage, NASA_EDUCATIONAL_FACTS } from '../../utils/nasaApi';
import { NASAImageItem } from '../../types/game';

interface SpaceStationMissionProps {
  onComplete: () => void;
  onAddScore: (points: number) => void;
}

export default function SpaceStationMission({ onComplete, onAddScore }: SpaceStationMissionProps) {
  // 4 Space Station Checklist tasks
  const [o2GeneratorChecked, setO2GeneratorChecked] = useState(false);
  const [co2ScrubberChecked, setCo2ScrubberChecked] = useState(false);
  const [thermalRadiatorChecked, setThermalRadiatorChecked] = useState(false);
  const [airlockSealsChecked, setAirlockSealsChecked] = useState(false);

  // Live telemetry readings
  const [oxygenLevel, setOxygenLevel] = useState(18.2); // target 21.0%
  const [cabinPressure, setCabinPressure] = useState(14.7); // psi
  const [radiatorTemp, setRadiatorTemp] = useState(65); // optimal ~22°C

  // NASA image & fact
  const [nasaImage, setNasaImage] = useState<NASAImageItem | null>(null);
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    fetchNASAImage('International Space Station cupola', 'spacestation').then((data) => {
      setNasaImage(data);
    });
    const facts = NASA_EDUCATIONAL_FACTS.spacestation;
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  const handleFixO2 = () => {
    sounds.playRepair();
    setOxygenLevel(20.9);
    setO2GeneratorChecked(true);
    onAddScore(250);
    checkIfAllDone(true, co2ScrubberChecked, thermalRadiatorChecked, airlockSealsChecked);
  };

  const handleFixCO2 = () => {
    sounds.playRepair();
    setCo2ScrubberChecked(true);
    onAddScore(250);
    checkIfAllDone(o2GeneratorChecked, true, thermalRadiatorChecked, airlockSealsChecked);
  };

  const handleFixThermal = () => {
    sounds.playRepair();
    setRadiatorTemp(21.5);
    setThermalRadiatorChecked(true);
    onAddScore(250);
    checkIfAllDone(o2GeneratorChecked, co2ScrubberChecked, true, airlockSealsChecked);
  };

  const handleFixAirlock = () => {
    sounds.playRepair();
    setCabinPressure(14.7);
    setAirlockSealsChecked(true);
    onAddScore(250);
    checkIfAllDone(o2GeneratorChecked, co2ScrubberChecked, thermalRadiatorChecked, true);
  };

  const checkIfAllDone = (o2: boolean, co2: boolean, thermal: boolean, airlock: boolean) => {
    if (o2 && co2 && thermal && airlock) {
      sounds.playSuccess();
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  };

  const completedCount = Number(o2GeneratorChecked) + Number(co2ScrubberChecked) + Number(thermalRadiatorChecked) + Number(airlockSealsChecked);
  const allFixed = completedCount === 4;
  const progressPercent = Math.round((completedCount / 4) * 100);

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
            PHASE 2 OF 3: STATION ECLSS CHECK
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>🛰️ INSPECT ORBITAL SPACE STATION</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '650px' }}>
            Board the International Space Station habitat module. Perform flight diagnostics on the Environmental Control and Life Support Systems (ECLSS) to protect astronaut health.
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>SYSTEM READINESS</div>
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

      {/* Main station visual stage */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
        }}
      >
        {/* Interactive Space Station SVG Diagram */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, rgba(11, 28, 54, 0.9) 0%, #050814 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Station Visual SVG */}
          <svg width="300" height="190" viewBox="0 0 300 190" style={{ filter: 'drop-shadow(0 0 16px rgba(0,229,255,0.3))' }}>
            {/* Solar Truss Bar */}
            <line x1="20" y1="95" x2="280" y2="95" stroke="#94a3b8" strokeWidth="4" />

            {/* Left Solar Arrays */}
            <rect x="25" y="40" width="30" height="110" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="25" y1="65" x2="55" y2="65" stroke="rgba(255,255,255,0.4)" />
            <line x1="25" y1="95" x2="55" y2="95" stroke="rgba(255,255,255,0.4)" />
            <line x1="25" y1="125" x2="55" y2="125" stroke="rgba(255,255,255,0.4)" />

            <rect x="65" y="40" width="30" height="110" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="65" y1="65" x2="95" y2="65" stroke="rgba(255,255,255,0.4)" />
            <line x1="65" y1="95" x2="95" y2="95" stroke="rgba(255,255,255,0.4)" />
            <line x1="65" y1="125" x2="95" y2="125" stroke="rgba(255,255,255,0.4)" />

            {/* Right Solar Arrays */}
            <rect x="205" y="40" width="30" height="110" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="205" y1="65" x2="235" y2="65" stroke="rgba(255,255,255,0.4)" />
            <line x1="205" y1="95" x2="235" y2="95" stroke="rgba(255,255,255,0.4)" />
            <line x1="205" y1="125" x2="235" y2="125" stroke="rgba(255,255,255,0.4)" />

            <rect x="245" y="40" width="30" height="110" rx="3" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
            <line x1="245" y1="65" x2="275" y2="65" stroke="rgba(255,255,255,0.4)" />
            <line x1="245" y1="95" x2="275" y2="95" stroke="rgba(255,255,255,0.4)" />
            <line x1="245" y1="125" x2="275" y2="125" stroke="rgba(255,255,255,0.4)" />

            {/* Central Pressurized Modules */}
            <rect x="110" y="70" width="80" height="50" rx="6" fill="#334155" stroke="#00e5ff" strokeWidth="2" />
            {/* Laboratory Window Cupola */}
            <circle cx="150" cy="95" r="14" fill="#0284c7" stroke="#fff" strokeWidth="2" />
            <line x1="150" y1="81" x2="150" y2="109" stroke="#fff" strokeWidth="1" />
            <line x1="136" y1="95" x2="164" y2="95" stroke="#fff" strokeWidth="1" />

            {/* Status indicator LEDs */}
            <circle cx="122" cy="80" r="4" fill={o2GeneratorChecked ? '#00e676' : '#ef4444'} />
            <circle cx="132" cy="80" r="4" fill={co2ScrubberChecked ? '#00e676' : '#ef4444'} />
            <circle cx="168" cy="80" r="4" fill={thermalRadiatorChecked ? '#00e676' : '#ef4444'} />
            <circle cx="178" cy="80" r="4" fill={airlockSealsChecked ? '#00e676' : '#ef4444'} />

            {/* Docking Node & Airlock Hatch */}
            <rect x="135" y="120" width="30" height="30" rx="4" fill="#1e293b" stroke={airlockSealsChecked ? '#00e676' : '#ffd166'} strokeWidth="2" />
            <text x="150" y="140" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">AIRLOCK</text>
          </svg>

          <div style={{ marginTop: '10px', fontSize: '0.85rem', color: allFixed ? '#00e676' : '#94a3b8', fontWeight: 600 }}>
            {allFixed ? '✓ ALL LIFE SUPPORT SYSTEMS NOMINAL' : 'STATUS: MODULE INSPECTION IN PROGRESS'}
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
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>ECLSS Life Support Facts</span>
            </div>
            {nasaImage ? (
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.2)', marginBottom: '10px' }}>
                <img
                  src={nasaImage.imageUrl}
                  alt={nasaImage.title}
                  style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <div style={{ padding: '8px 10px', background: 'rgba(0,0,0,0.5)', fontSize: '0.75rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#00e5ff' }}>{nasaImage.title}</strong>
                </div>
              </div>
            ) : (
              <div style={{ height: '140px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                Loading NASA Life Support Imagery...
              </div>
            )}
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
              💡 <strong style={{ color: '#fff' }}>NASA Fact:</strong> {randomFact}
            </p>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#64748b' }}>
            Data source: NASA Johnson Space Center ECLSS Engineering Teams
          </div>
        </div>
      </div>

      {/* 4 Life Support System Checklist Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {/* 1. Oxygen Generator */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: o2GeneratorChecked ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>1. O2 GENERATOR</span>
            {o2GeneratorChecked ? (
              <span className="badge badge-green">20.9% NOMINAL</span>
            ) : (
              <span className="badge badge-red">{oxygenLevel}% LOW</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Calibrate water electrolysis assembly to balance cabin oxygen concentration at standard atmospheric levels.
          </p>
          <button
            disabled={o2GeneratorChecked}
            onClick={handleFixO2}
            className={o2GeneratorChecked ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {o2GeneratorChecked ? '✓ OXYGEN STABILIZED' : '💨 BALANCE O2 FLOW (+250)'}
          </button>
        </div>

        {/* 2. CO2 Scrubber */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: co2ScrubberChecked ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>2. CO2 SCRUBBER</span>
            {co2ScrubberChecked ? (
              <span className="badge badge-green">SCRUBBING ACTIVE</span>
            ) : (
              <span className="badge badge-red">BLOCKED</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Carbon dioxide scrubbers and cabin circulation fans are idle. Start blowers to prevent hazardous gas pockets.
          </p>
          <button
            disabled={co2ScrubberChecked}
            onClick={handleFixCO2}
            className={co2ScrubberChecked ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {co2ScrubberChecked ? '✓ CABIN AIR CIRCULATING' : '🌀 START CO2 FANS (+250)'}
          </button>
        </div>

        {/* 3. Thermal Radiator */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: thermalRadiatorChecked ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>3. THERMAL LOOP</span>
            {thermalRadiatorChecked ? (
              <span className="badge badge-green">21.5°C OPTIMAL</span>
            ) : (
              <span className="badge badge-red">{radiatorTemp}°C OVERHEATING</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            External ammonia cooling loop valve is locked. Regulate radiator flow between orbital sun and shadow passes.
          </p>
          <button
            disabled={thermalRadiatorChecked}
            onClick={handleFixThermal}
            className={thermalRadiatorChecked ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {thermalRadiatorChecked ? '✓ THERMAL BALANCED' : '🌡️ REGULATE COOLANT (+250)'}
          </button>
        </div>

        {/* 4. Airlock Hatch Seals */}
        <div
          className="glass-panel"
          style={{
            padding: '18px',
            borderColor: airlockSealsChecked ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 82, 82, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 700, color: '#fff' }}>4. AIRLOCK HATCH</span>
            {airlockSealsChecked ? (
              <span className="badge badge-green">14.7 PSI SEALED</span>
            ) : (
              <span className="badge badge-gold">UNVERIFIED</span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
            Inspect vacuum pressure seals on the Quest EVA airlock and certify emergency pressure relief valves.
          </p>
          <button
            disabled={airlockSealsChecked}
            onClick={handleFixAirlock}
            className={airlockSealsChecked ? 'btn-success' : 'btn-primary'}
            style={{ width: '100%', padding: '10px' }}
          >
            {airlockSealsChecked ? '✓ HATCH CERTIFIED' : '🔒 TEST AIRLOCK SEAL (+250)'}
          </button>
        </div>
      </div>
    </div>
  );
}
