'use client';

import React, { useState, useEffect } from 'react';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

interface HeaderProps {
  currentLevel: GameLevel;
  onNavigate: (level: GameLevel) => void;
  missionTime: number;
  score: number;
}

export default function Header({ currentLevel, onNavigate, missionTime, score }: HeaderProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(sounds.isMuted());
  }, []);

  const handleToggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sounds.playBeep(880, 0.1);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelTitle = () => {
    switch (currentLevel) {
      case 'LEVEL_1':
        return 'LEVEL 1: ASTRONAUT TRAINING';
      case 'LEVEL_2':
        return 'LEVEL 2: MOON SURVIVAL';
      case 'LEVEL_3':
        return 'LEVEL 3: RETURN TO EARTH';
      case 'MISSIONS':
        return 'MISSION DIRECTORY';
      case 'HOW_TO_PLAY':
        return 'MISSION FLIGHT MANUAL';
      case 'SUMMARY':
        return 'MISSION DEBRIEF';
      default:
        return 'TRAINING SIMULATOR';
    }
  };

  return (
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 24px',
        backgroundColor: 'rgba(5, 12, 28, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 229, 255, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {/* Brand & NASA Space Apps Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('MENU');
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'inherit',
            textAlign: 'left',
          }}
          title="Return to Main Menu"
        >
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #0b3d91 60%, #fc3d21 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.5)',
              fontSize: '18px',
            }}
          >
            🚀
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.08em', color: '#00e5ff' }}>
              JUNIOR ASTRONAUT
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.04em' }}>
              NASA SPACE APPS CHALLENGE
            </div>
          </div>
        </button>

        {currentLevel !== 'MENU' && (
          <div className="badge badge-cyan" style={{ marginLeft: '10px' }}>
            {getLevelTitle()}
          </div>
        )}
      </div>

      {/* Telemetry Readouts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {currentLevel !== 'MENU' && currentLevel !== 'HOW_TO_PLAY' && (
          <>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#ffd166' }}>⏱️ TIME:</span>
              <span style={{ fontWeight: 'bold' }}>{formatTime(missionTime)}</span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 0, 0, 0.4)',
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid rgba(0, 230, 118, 0.2)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
              }}
            >
              <span style={{ color: '#00e676' }}>★ SCORE:</span>
              <span style={{ fontWeight: 'bold', color: '#00e676' }}>{score.toLocaleString()}</span>
            </div>
          </>
        )}

        {/* Audio Mute Button */}
        <button
          onClick={handleToggleSound}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        >
          {isMuted ? '🔇 MUTED' : '🔊 AUDIO ON'}
        </button>

        {/* Main Menu Button */}
        {currentLevel !== 'MENU' && (
          <button
            onClick={() => {
              sounds.playClick();
              onNavigate('MENU');
            }}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem', borderColor: 'rgba(255,82,82,0.4)' }}
          >
            MENU
          </button>
        )}
      </div>
    </header>
  );
}
