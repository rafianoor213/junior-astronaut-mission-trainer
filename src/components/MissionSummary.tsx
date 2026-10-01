'use client';

import React from 'react';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

interface MissionSummaryProps {
  score: number;
  missionTime: number;
  playerName: string;
  onNavigate: (level: GameLevel) => void;
  onRestart: () => void;
}

export default function MissionSummary({
  score,
  missionTime,
  playerName,
  onNavigate,
  onRestart,
}: MissionSummaryProps) {
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}m ${secs}s`;
  };

  const handlePrint = () => {
    sounds.playClick();
    window.print();
  };

  return (
    <div
      style={{
        maxWidth: '920px',
        margin: '0 auto',
        padding: '30px 20px',
        width: '100%',
        textAlign: 'center',
      }}
    >
      {/* Top Victory Ribbon */}
      <div className="badge badge-gold" style={{ marginBottom: '14px', fontSize: '0.9rem', padding: '8px 20px' }}>
        ★ NASA SPACE APPS CHALLENGE OFFICIAL DIPLOMA ★
      </div>

      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3rem)',
          fontWeight: 900,
          letterSpacing: '0.04em',
          background: 'linear-gradient(180deg, #ffffff 0%, #a5f3fc 50%, #00e5ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          lineHeight: 1.2,
        }}
      >
        MISSION SUCCESS — JUNIOR ASTRONAUT CERTIFIED!
      </h1>

      <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto 28px' }}>
        Congratulations Cadet! You have conquered all three flight phases: Satellite & Station Training, Lunar Base Moon Survival, and Atmospheric Re-entry.
      </p>

      {/* Official Certificate Box */}
      <div
        className="glass-panel"
        style={{
          padding: '36px 28px',
          background: 'radial-gradient(ellipse at center, rgba(11, 28, 56, 0.95) 0%, #050814 100%)',
          border: '2px solid rgba(0, 229, 255, 0.5)',
          borderRadius: '16px',
          boxShadow: '0 0 40px rgba(0, 229, 255, 0.25)',
          marginBottom: '32px',
          position: 'relative',
        }}
      >
        {/* Certificate NASA Insignia */}
        <div
          style={{
            width: '84px',
            height: '84px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #0b3d91 60%, #fc3d21 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '44px',
            margin: '0 auto 16px',
            boxShadow: '0 0 25px rgba(0, 229, 255, 0.5)',
          }}
        >
          🚀
        </div>

        <div style={{ fontSize: '0.85rem', letterSpacing: '0.2em', color: '#ffd166', textTransform: 'uppercase', marginBottom: '8px' }}>
          NATIONAL AERONAUTICS AND SPACE ADMINISTRATION
        </div>

        <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', marginBottom: '14px' }}>
          CERTIFICATE OF JUNIOR ASTRONAUT WINGS
        </h2>

        <div style={{ fontSize: '0.95rem', color: '#cbd5e1', marginBottom: '6px' }}>
          This flight certification is officially conferred upon:
        </div>

        <div
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 900,
            color: '#00e5ff',
            letterSpacing: '0.08em',
            padding: '8px 24px',
            borderBottom: '2px solid rgba(0, 229, 255, 0.4)',
            display: 'inline-block',
            marginBottom: '20px',
            textTransform: 'uppercase',
          }}
        >
          {playerName || 'CADET EXPLORER'}
        </div>

        <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          For demonstrating exemplary skill in satellite telemetry repair, space station life support systems diagnostic, lunar volatile prospecting, base emergency response, and hypersonic atmospheric entry return.
        </p>

        {/* Mission Telemetry Summary Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '14px',
            maxWidth: '680px',
            margin: '0 auto 28px',
          }}
        >
          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>FINAL SCORE</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00e676', fontFamily: 'monospace' }}>
              {score.toLocaleString()} PTS
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>MISSION DURATION</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd166', fontFamily: 'monospace' }}>
              {formatTime(missionTime)}
            </div>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.4)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>RANK ACHIEVED</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#00e5ff', marginTop: '4px' }}>
              COMMANDER ⭐⭐⭐
            </div>
          </div>
        </div>

        {/* 6 Astronaut Badges Earned */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
          <div style={{ fontSize: '0.85rem', color: '#ffd166', fontWeight: 700, marginBottom: '14px', letterSpacing: '0.05em' }}>
            MISSION HONORS & FLIGHT WINGS EARNED
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              🛰️ Satellite Master
            </div>
            <div style={{ background: 'rgba(0, 229, 255, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              🔬 Station ECLSS Specialist
            </div>
            <div style={{ background: 'rgba(255, 209, 102, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255, 209, 102, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              💧 Lunar Ice Miner
            </div>
            <div style={{ background: 'rgba(255, 209, 102, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(255, 209, 102, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              🚜 Lunar Rover Ace
            </div>
            <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0, 230, 118, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              🛡️ Emergency Crisis Expert
            </div>
            <div style={{ background: 'rgba(0, 230, 118, 0.1)', padding: '8px 14px', borderRadius: '8px', border: '1px solid rgba(0, 230, 118, 0.3)', fontSize: '0.8rem', color: '#e2e8f0' }}>
              🌊 Re-entry Flight Commander
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={handlePrint}
          className="btn-success"
          style={{ padding: '14px 28px', fontSize: '1.05rem' }}
        >
          🖨️ PRINT / SAVE CERTIFICATE
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('MISSIONS');
          }}
          className="btn-primary"
          style={{ padding: '14px 24px' }}
        >
          📋 MISSION DIRECTORY
        </button>

        <button
          onClick={() => {
            sounds.playClick();
            onRestart();
          }}
          className="btn-secondary"
          style={{ padding: '14px 24px' }}
        >
          🔄 NEW CADET MISSION
        </button>
      </div>
    </div>
  );
}
