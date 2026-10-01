'use client';

import React from 'react';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

interface MissionsMenuProps {
  unlockedLevels: number[];
  completedLevels: number[];
  onNavigate: (level: GameLevel) => void;
}

export default function MissionsMenu({ unlockedLevels, completedLevels, onNavigate }: MissionsMenuProps) {
  const isLevel2Unlocked = unlockedLevels.includes(2);
  const isLevel3Unlocked = unlockedLevels.includes(3);

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '30px 20px',
        width: '100%',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            FLIGHT LOG & ROSTER
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>MISSION DIRECTORY</h2>
        </div>
        <button
          onClick={() => {
            sounds.playClick();
            onNavigate('MENU');
          }}
          className="btn-secondary"
        >
          ← BACK TO MENU
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Mission 1 */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderLeft: '4px solid #00e5ff',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(0, 229, 255, 0.1)',
                  border: '1px solid rgba(0, 229, 255, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🛰️
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>LEVEL 1: ASTRONAUT TRAINING</h3>
                  {completedLevels.includes(1) && <span className="badge badge-green">COMPLETED</span>}
                </div>
                <div style={{ color: '#00e5ff', fontSize: '0.85rem', marginTop: '2px' }}>
                  Orbital Simulation & Systems Familiarization
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onNavigate('LEVEL_1');
              }}
              className="btn-primary"
            >
              {completedLevels.includes(1) ? 'REPLAY MISSION 1' : 'START MISSION 1'}
            </button>
          </div>

          <div
            style={{
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <div>
              <strong style={{ color: '#f0f6fc' }}>1. Satellite Repair:</strong>
              <p>Fix damaged solar panel, re-solder bus cable, and align deep space communication dish.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>2. Station ECLSS Check:</strong>
              <p>Verify oxygen levels, balance thermal radiators, engage airflow fans, and inspect emergency safety lockers.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>3. Resource Discovery:</strong>
              <p>Operate multi-spectral orbital scanner to detect Water Ice, Minerals, Oxygen, and Solar Energy sites.</p>
            </div>
          </div>
        </div>

        {/* Mission 2 */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderLeft: isLevel2Unlocked ? '4px solid #ffd166' : '4px solid #64748b',
            opacity: isLevel2Unlocked ? 1 : 0.7,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(255, 209, 102, 0.1)',
                  border: '1px solid rgba(255, 209, 102, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🌕
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>LEVEL 2: MOON SURVIVAL</h3>
                  {completedLevels.includes(2) ? (
                    <span className="badge badge-green">COMPLETED</span>
                  ) : isLevel2Unlocked ? (
                    <span className="badge badge-gold">UNLOCKED</span>
                  ) : (
                    <span className="badge badge-red">LOCKED</span>
                  )}
                </div>
                <div style={{ color: '#ffd166', fontSize: '0.85rem', marginTop: '2px' }}>
                  Lunar Surface Exploration & Base Resource Management
                </div>
              </div>
            </div>

            <button
              disabled={!isLevel2Unlocked}
              onClick={() => {
                if (isLevel2Unlocked) {
                  sounds.playClick();
                  onNavigate('LEVEL_2');
                }
              }}
              className="btn-primary"
            >
              {isLevel2Unlocked
                ? completedLevels.includes(2)
                  ? 'REPLAY MISSION 2'
                  : 'START MISSION 2'
                : 'LOCKED (FINISH LEVEL 1)'}
            </button>
          </div>

          <div
            style={{
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <div>
              <strong style={{ color: '#f0f6fc' }}>1. 2D Lunar Exploration:</strong>
              <p>Pilot astronaut (WASD / Arrows / Touch) across lunar craters, boulders, and harvest ice crystals & minerals.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>2. Base Conversion Plants:</strong>
              <p>Melt ice to water, perform water electrolysis to make oxygen, recharge suit at solar array, and grow greenhouse food.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>3. The Great Crater & Emergencies:</strong>
              <p>Risk deep crater ice mining, survive oxygen leaks, solar storms, and repair broken subsystems.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>4. Return Rocket Preparation:</strong>
              <p>Provision the return spacecraft with 8 critical items (Fuel, Power, O2, Water, Food, Comms, Nav, Hull).</p>
            </div>
          </div>
        </div>

        {/* Mission 3 */}
        <div
          className="glass-panel"
          style={{
            padding: '24px',
            borderLeft: isLevel3Unlocked ? '4px solid #00e676' : '4px solid #64748b',
            opacity: isLevel3Unlocked ? 1 : 0.7,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: 'rgba(0, 230, 118, 0.1)',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                }}
              >
                🌍
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>LEVEL 3: RETURN TO EARTH</h3>
                  {completedLevels.includes(3) ? (
                    <span className="badge badge-green">COMPLETED</span>
                  ) : isLevel3Unlocked ? (
                    <span className="badge badge-green">UNLOCKED</span>
                  ) : (
                    <span className="badge badge-red">LOCKED</span>
                  )}
                </div>
                <div style={{ color: '#00e676', fontSize: '0.85rem', marginTop: '2px' }}>
                  Atmospheric Entry Corridor, Plasma Burn & Ocean Landing
                </div>
              </div>
            </div>

            <button
              disabled={!isLevel3Unlocked}
              onClick={() => {
                if (isLevel3Unlocked) {
                  sounds.playClick();
                  onNavigate('LEVEL_3');
                }
              }}
              className="btn-primary"
            >
              {isLevel3Unlocked
                ? completedLevels.includes(3)
                  ? 'REPLAY MISSION 3'
                  : 'START MISSION 3'
                : 'LOCKED (FINISH LEVEL 2)'}
            </button>
          </div>

          <div
            style={{
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '12px',
              fontSize: '0.85rem',
              color: '#94a3b8',
            }}
          >
            <div>
              <strong style={{ color: '#f0f6fc' }}>1. Pre-Entry System Checks:</strong>
              <p>Check rocket thrusters, cabin oxygen, power reserves, and calibrate earth return guidance.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>2. Heat Shield Deployment:</strong>
              <p>Angle spacecraft blunt thermal ablative shield to withstand 2,700°C extreme atmospheric friction.</p>
            </div>
            <div>
              <strong style={{ color: '#f0f6fc' }}>3. Parachute & Splashdown:</strong>
              <p>Deploy braking parachutes at target deceleration window and achieve touchdown to earn Astronaut Certification!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
