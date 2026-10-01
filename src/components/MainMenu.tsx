'use client';

import React from 'react';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

interface MainMenuProps {
  unlockedLevels: number[];
  completedLevels: number[];
  playerName: string;
  setPlayerName: (name: string) => void;
  onNavigate: (level: GameLevel) => void;
  onResetProgress: () => void;
}

export default function MainMenu({
  unlockedLevels,
  completedLevels,
  playerName,
  setPlayerName,
  onNavigate,
  onResetProgress,
}: MainMenuProps) {
  const isLevel2Unlocked = unlockedLevels.includes(2);
  const isLevel3Unlocked = unlockedLevels.includes(3);

  const handleStartMission = () => {
    sounds.playClick();
    // Start highest unlocked level or level 1
    if (isLevel3Unlocked && !completedLevels.includes(3)) {
      onNavigate('LEVEL_3');
    } else if (isLevel2Unlocked && !completedLevels.includes(2)) {
      onNavigate('LEVEL_2');
    } else {
      onNavigate('LEVEL_1');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 70px)',
        padding: '30px 20px',
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto',
        width: '100%',
      }}
    >
      {/* Insignia / Emblem */}
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #0b3d91 50%, #00e5ff 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          boxShadow: '0 0 35px rgba(0, 229, 255, 0.6)',
          marginBottom: '20px',
          animation: 'twinkle 3s infinite ease-in-out',
        }}
      >
        👨‍🚀
      </div>

      <div className="badge badge-gold" style={{ marginBottom: '14px', fontSize: '0.85rem', padding: '6px 16px' }}>
        ★ NASA SPACE APPS CHALLENGE ★
      </div>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: 'linear-gradient(180deg, #ffffff 0%, #a5f3fc 70%, #00e5ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px',
          lineHeight: 1.15,
        }}
      >
        JUNIOR ASTRONAUT
        <br />
        <span style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', color: '#00e5ff' }}>MISSION TRAINER</span>
      </h1>

      <p
        style={{
          color: '#94a3b8',
          fontSize: '1.05rem',
          maxWidth: '650px',
          marginBottom: '28px',
          lineHeight: 1.6,
        }}
      >
        Master essential orbital repairs, survive the harsh lunar environment, manage life support
        systems, and execute a critical atmospheric re-entry return to Earth.
      </p>

      {/* Cadet Call-sign Input */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '400px',
          width: '100%',
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🧑‍🚀</span>
        <label style={{ fontSize: '0.85rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>ASTRONAUT CALLSIGN:</label>
        <input
          type="text"
          value={playerName}
          maxLength={18}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Cadet Name"
          style={{
            background: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '6px',
            color: '#00e5ff',
            padding: '6px 12px',
            fontSize: '0.95rem',
            fontWeight: 700,
            width: '100%',
            outline: 'none',
          }}
        />
      </div>

      {/* Main Action Buttons */}
      <div
        style={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          marginBottom: '42px',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        <button
          onClick={handleStartMission}
          className="btn-primary"
          style={{ flex: '1 1 200px', padding: '16px 28px', fontSize: '1.15rem' }}
        >
          🚀 START MISSION
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('MISSIONS');
          }}
          className="btn-secondary"
          style={{ flex: '1 1 140px', padding: '16px 24px', fontSize: '1.05rem' }}
        >
          📋 MISSIONS
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('HOW_TO_PLAY');
          }}
          className="btn-secondary"
          style={{ flex: '1 1 140px', padding: '16px 24px', fontSize: '1.05rem' }}
        >
          📖 HOW TO PLAY
        </button>
      </div>

      {/* 3 Level Overview Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
          width: '100%',
          marginBottom: '32px',
        }}
      >
        {/* Level 1 Card */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 20px',
            textAlign: 'left',
            position: 'relative',
            borderColor: completedLevels.includes(1) ? 'rgba(0, 230, 118, 0.4)' : 'rgba(0, 229, 255, 0.4)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🛰️</span>
            {completedLevels.includes(1) ? (
              <span className="badge badge-green">✓ COMPLETED</span>
            ) : (
              <span className="badge badge-cyan">LEVEL 1</span>
            )}
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#fff' }}>Astronaut Training</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>
            Satellite repairs, station life support diagnostic checks, and deep space resource spectral analysis.
          </p>
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('LEVEL_1');
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            {completedLevels.includes(1) ? 'REPLAY TRAINING' : 'LAUNCH LEVEL 1'}
          </button>
        </div>

        {/* Level 2 Card */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 20px',
            textAlign: 'left',
            position: 'relative',
            opacity: isLevel2Unlocked ? 1 : 0.65,
            borderColor: completedLevels.includes(2)
              ? 'rgba(0, 230, 118, 0.4)'
              : isLevel2Unlocked
              ? 'rgba(0, 229, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🌕</span>
            {completedLevels.includes(2) ? (
              <span className="badge badge-green">✓ COMPLETED</span>
            ) : isLevel2Unlocked ? (
              <span className="badge badge-cyan">LEVEL 2</span>
            ) : (
              <span className="badge badge-red">🔒 LOCKED</span>
            )}
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#fff' }}>Moon Survival</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>
            Explore lunar surface, harvest water ice, operate base systems, survive emergencies, and fuel the return rocket.
          </p>
          <button
            disabled={!isLevel2Unlocked}
            onClick={() => {
              if (isLevel2Unlocked) {
                sounds.playClick();
                onNavigate('LEVEL_2');
              }
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            {isLevel2Unlocked ? (completedLevels.includes(2) ? 'REPLAY LEVEL 2' : 'LAUNCH LEVEL 2') : 'COMPLETE LEVEL 1 FIRST'}
          </button>
        </div>

        {/* Level 3 Card */}
        <div
          className="glass-panel"
          style={{
            padding: '24px 20px',
            textAlign: 'left',
            position: 'relative',
            opacity: isLevel3Unlocked ? 1 : 0.65,
            borderColor: completedLevels.includes(3)
              ? 'rgba(0, 230, 118, 0.4)'
              : isLevel3Unlocked
              ? 'rgba(0, 229, 255, 0.4)'
              : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '1.8rem' }}>🌍</span>
            {completedLevels.includes(3) ? (
              <span className="badge badge-green">✓ COMPLETED</span>
            ) : isLevel3Unlocked ? (
              <span className="badge badge-cyan">LEVEL 3</span>
            ) : (
              <span className="badge badge-red">🔒 LOCKED</span>
            )}
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '6px', color: '#fff' }}>Return to Earth</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '16px', lineHeight: 1.4 }}>
            Critical flight checklist, heat shield orientation, atmospheric re-entry corridor, parachute descent, and touchdown.
          </p>
          <button
            disabled={!isLevel3Unlocked}
            onClick={() => {
              if (isLevel3Unlocked) {
                sounds.playClick();
                onNavigate('LEVEL_3');
              }
            }}
            className="btn-primary"
            style={{ width: '100%', padding: '10px' }}
          >
            {isLevel3Unlocked ? (completedLevels.includes(3) ? 'REPLAY LEVEL 3' : 'LAUNCH LEVEL 3') : 'COMPLETE LEVEL 2 FIRST'}
          </button>
        </div>
      </div>

      {/* Reset Progress Footer */}
      {(unlockedLevels.length > 1 || completedLevels.length > 0) && (
        <button
          onClick={() => {
            if (window.confirm('Reset all mission progress back to Level 1?')) {
              onResetProgress();
            }
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Reset Mission Progress
        </button>
      )}
    </div>
  );
}
