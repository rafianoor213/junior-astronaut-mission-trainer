'use client';

import React, { useState } from 'react';
import SatelliteMission from './SatelliteMission';
import SpaceStationMission from './SpaceStationMission';
import ResourceDiscoveryMission from './ResourceDiscoveryMission';
import { sounds } from '../../utils/audio';

interface Level1MissionProps {
  onLevelComplete: () => void;
  onAddScore: (points: number) => void;
  onNavigateMenu: () => void;
}

export default function Level1Mission({ onLevelComplete, onAddScore, onNavigateMenu }: Level1MissionProps) {
  // Step 1: Satellite Repair, Step 2: Station ECLSS, Step 3: Resource Discovery, Step 4: Finished
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  const handleSatelliteDone = () => {
    setCurrentStep(2);
  };

  const handleStationDone = () => {
    setCurrentStep(3);
  };

  const handleDiscoveryDone = () => {
    sounds.playSuccess();
    sounds.playCollect();
    onAddScore(500); // Level 1 Completion bonus
    setCurrentStep(4);
  };

  const handleProceedToLevel2 = () => {
    sounds.playClick();
    onLevelComplete();
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px', width: '100%' }}>
      {/* Top Phase Stepper */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '1.4rem' }}>👨‍🚀</span>
          <div>
            <div style={{ fontWeight: 800, color: '#00e5ff', fontSize: '1rem' }}>LEVEL 1: ASTRONAUT TRAINING</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Orbital Flight Certification Simulation</div>
          </div>
        </div>

        {/* 3 Step Indicators */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: currentStep >= 1 ? (currentStep > 1 ? 'rgba(0,230,118,0.2)' : 'rgba(0,229,255,0.2)') : 'rgba(255,255,255,0.05)',
              border: `1px solid ${currentStep === 1 ? '#00e5ff' : currentStep > 1 ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
              fontSize: '0.8rem',
              color: currentStep > 1 ? '#00e676' : currentStep === 1 ? '#00e5ff' : '#64748b',
              fontWeight: 700,
            }}
          >
            {currentStep > 1 ? '✓' : '1.'} SATELLITE
          </div>

          <span style={{ color: '#475569' }}>→</span>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: currentStep >= 2 ? (currentStep > 2 ? 'rgba(0,230,118,0.2)' : 'rgba(0,229,255,0.2)') : 'rgba(255,255,255,0.05)',
              border: `1px solid ${currentStep === 2 ? '#00e5ff' : currentStep > 2 ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
              fontSize: '0.8rem',
              color: currentStep > 2 ? '#00e676' : currentStep === 2 ? '#00e5ff' : '#64748b',
              fontWeight: 700,
            }}
          >
            {currentStep > 2 ? '✓' : '2.'} SPACE STATION
          </div>

          <span style={{ color: '#475569' }}>→</span>

          <div
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              background: currentStep >= 3 ? (currentStep > 3 ? 'rgba(0,230,118,0.2)' : 'rgba(0,229,255,0.2)') : 'rgba(255,255,255,0.05)',
              border: `1px solid ${currentStep === 3 ? '#00e5ff' : currentStep > 3 ? '#00e676' : 'rgba(255,255,255,0.1)'}`,
              fontSize: '0.8rem',
              color: currentStep > 3 ? '#00e676' : currentStep === 3 ? '#00e5ff' : '#64748b',
              fontWeight: 700,
            }}
          >
            {currentStep > 3 ? '✓' : '3.'} RESOURCES
          </div>
        </div>
      </div>

      {/* Dynamic Content based on Step */}
      {currentStep === 1 && (
        <SatelliteMission onComplete={handleSatelliteDone} onAddScore={onAddScore} />
      )}

      {currentStep === 2 && (
        <SpaceStationMission onComplete={handleStationDone} onAddScore={onAddScore} />
      )}

      {currentStep === 3 && (
        <ResourceDiscoveryMission onComplete={handleDiscoveryDone} onAddScore={onAddScore} />
      )}

      {currentStep === 4 && (
        <div
          className="glass-panel"
          style={{
            padding: '40px 24px',
            textAlign: 'center',
            maxWidth: '650px',
            margin: '20px auto',
            animation: 'fadeIn 0.5s ease',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #00e676 0%, #0077b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '40px',
              margin: '0 auto 20px',
              boxShadow: '0 0 30px rgba(0, 230, 118, 0.6)',
            }}
          >
            🌟
          </div>

          <div className="badge badge-green" style={{ marginBottom: '12px', fontSize: '0.85rem' }}>
            LEVEL 1 COMPLETED — FLIGHT CERTIFIED
          </div>

          <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '12px', color: '#fff' }}>
            ASTRONAUT TRAINING PASSED!
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px' }}>
            You have successfully repaired Satellite Alpha-7, certified the Space Station ECLSS life support loops, and detected all 4 vital lunar resources (Water Ice, Minerals, Regolith Oxygen, and Solar Peaks).
          </p>

          <div
            style={{
              background: 'rgba(0, 229, 255, 0.08)',
              border: '1px solid rgba(0, 229, 255, 0.3)',
              borderRadius: '10px',
              padding: '16px',
              marginBottom: '28px',
              display: 'flex',
              justifyContent: 'space-around',
            }}
          >
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>TRAINING SCORE BONUS</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#00e676' }}>+1,500 PTS</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>NEXT UNLOCKED</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffd166' }}>LEVEL 2: MOON</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleProceedToLevel2}
              className="btn-primary"
              style={{ padding: '14px 28px', fontSize: '1.1rem' }}
            >
              🌕 LAUNCH LEVEL 2: MOON SURVIVAL
            </button>
            <button
              onClick={onNavigateMenu}
              className="btn-secondary"
              style={{ padding: '14px 24px' }}
            >
              MAIN MENU
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
