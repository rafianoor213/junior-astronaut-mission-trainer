'use client';

import React from 'react';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

interface HowToPlayProps {
  onNavigate: (level: GameLevel) => void;
}

export default function HowToPlay({ onNavigate }: HowToPlayProps) {
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
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            ASTRONAUT FIELD MANUAL
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>HOW TO PLAY</h2>
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
        {/* Controls Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#00e5ff', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎮 CONTROLS & MOBILITY
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
            }}
          >
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>⌨️ KEYBOARD</div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                Use <strong style={{ color: '#00e5ff' }}>W, A, S, D</strong> or the <strong style={{ color: '#00e5ff' }}>ARROW KEYS</strong> to move your astronaut.
                Press <strong style={{ color: '#00e5ff' }}>E</strong> or <strong style={{ color: '#00e5ff' }}>SPACE</strong> to interact with base terminals, rovers, and resources.
              </p>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontWeight: 700, color: '#fff', marginBottom: '6px' }}>📱 TOUCH / MOUSE</div>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                On-screen virtual D-Pad buttons are available for mobile/tablet players. You can also click directly on resources, terminals, and repair buttons.
              </p>
            </div>
          </div>
        </div>

        {/* Resources Section */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#ffd166', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧪 THE 5 SURVIVAL RESOURCES
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '12px',
            }}
          >
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>💨</div>
              <div style={{ fontWeight: 700, color: '#00e5ff' }}>OXYGEN</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Depletes while moving on Moon surface. Produce from water at base electrolysis unit.
              </div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>⚡</div>
              <div style={{ fontWeight: 700, color: '#ffd166' }}>ENERGY</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Powers suit & tools. Stand on Solar Panel array recharge pad to refill instantly.
              </div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>💧</div>
              <div style={{ fontWeight: 700, color: '#38bdf8' }}>WATER</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Collect raw ice crystals and melt into clean water at base processor.
              </div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>🥗</div>
              <div style={{ fontWeight: 700, color: '#4ade80' }}>FOOD</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Grow crops in Lunar Greenhouse using stored water and electrical power.
              </div>
            </div>
            <div style={{ background: 'rgba(0, 0, 0, 0.3)', padding: '12px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>❤️</div>
              <div style={{ fontWeight: 700, color: '#f87171' }}>HEALTH</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                Drains if Oxygen or Energy hits 0%. Rest inside base habitat airlock to recover.
              </div>
            </div>
          </div>
        </div>

        {/* Tactical Tips */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', color: '#00e676', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🛰️ MISSION COMMAND TIPS
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>▶</span>
              <span><strong>The Great Shadow Crater:</strong> Contains massive water ice. Choose Safe exploration for modest gain, or Risky exploration for giant yields at the cost of high O2 usage and emergency risks.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>▶</span>
              <span><strong>Mission Control Emergencies:</strong> Watch for flashing warning alerts (Oxygen leak, Solar storm, Power failure, Rover jam). Press the REPAIR button immediately to safeguard your score!</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>▶</span>
              <span><strong>Return Rocket Preparation:</strong> To complete Level 2, provision your return rocket with Fuel, Power, O2, Water, Food, Comms, Nav, and Hull integrity.</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ color: '#00e5ff' }}>▶</span>
              <span><strong>Level 3 Re-Entry Sequence:</strong> Follow standard checklist order. Always activate heat shield before atmospheric entry, and never deploy parachutes while traveling at hypersonic speed!</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
