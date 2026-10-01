'use client';

import React, { useState, useEffect } from 'react';
import { sounds } from '../../utils/audio';
import { fetchNASAImage, NASA_EDUCATIONAL_FACTS } from '../../utils/nasaApi';
import { NASAImageItem } from '../../types/game';

interface ReturnToEarthMissionProps {
  onLevelComplete: () => void;
  onAddScore: (points: number) => void;
  onNavigateMenu: () => void;
  playerName: string;
}

type FlightStep =
  | 'CHECK_SPACECRAFT'
  | 'CHECK_RESOURCES'
  | 'PREPARE_HEAT_SHIELD'
  | 'START_REENTRY'
  | 'OPEN_PARACHUTE'
  | 'LANDING_SUCCESS';

interface FailureReason {
  title: string;
  explanation: string;
  retryStep: FlightStep;
}

export default function ReturnToEarthMission({
  onLevelComplete,
  onAddScore,
  onNavigateMenu,
  playerName,
}: ReturnToEarthMissionProps) {
  // Flight Steps
  const [currentStep, setCurrentStep] = useState<FlightStep>('CHECK_SPACECRAFT');

  // Step 1: Spacecraft checks
  const [rcsTested, setRcsTested] = useState(false);
  const [avionicsTested, setAvionicsTested] = useState(false);
  const [cabinSealTested, setCabinSealTested] = useState(false);

  // Step 2: Resources check
  const [propellantChecked, setPropellantChecked] = useState(false);
  const [o2Checked, setO2Checked] = useState(false);
  const [busVoltageChecked, setBusVoltageChecked] = useState(false);

  // Step 3: Heat shield & corridor
  const [serviceModuleJettisoned, setServiceModuleJettisoned] = useState(false);
  const [entryAngle, setEntryAngle] = useState(6.2); // degrees (optimal 5.5 to 7.0)
  const [heatShieldOriented, setHeatShieldOriented] = useState(false);

  // Step 4: Re-entry telemetry & simulation
  const [altitudeKm, setAltitudeKm] = useState(120);
  const [velocityMach, setVelocityMach] = useState(25.0);
  const [shieldTempC, setShieldTempC] = useState(20);
  const [plasmaPhase, setPlasmaPhase] = useState(false);
  const [rollStabilized, setRollStabilized] = useState(true);

  // Step 5: Parachute deployment
  const [drogueDeployed, setDrogueDeployed] = useState(false);
  const [mainChutesDeployed, setMainChutesDeployed] = useState(false);

  // Failure modal state
  const [failure, setFailure] = useState<FailureReason | null>(null);

  // NASA Public Image & Fact
  const [nasaImage, setNasaImage] = useState<NASAImageItem | null>(null);
  const [randomFact, setRandomFact] = useState('');

  useEffect(() => {
    fetchNASAImage('NASA Orion splashdown Pacific Ocean', 'reentry').then((data) => {
      setNasaImage(data);
    });
    const facts = NASA_EDUCATIONAL_FACTS.reentry;
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  // Re-entry dynamic descent loop (during START_REENTRY phase)
  useEffect(() => {
    if (currentStep !== 'START_REENTRY') return;

    sounds.playLaunch();
    setPlasmaPhase(true);

    const descentInterval = setInterval(() => {
      setAltitudeKm((alt) => {
        if (alt <= 12) {
          clearInterval(descentInterval);
          setPlasmaPhase(false);
          setCurrentStep('OPEN_PARACHUTE');
          sounds.playBeep(880, 0.2);
          return 12;
        }

        // Descend
        return Math.max(12, alt - 6);
      });

      setVelocityMach((v) => Math.max(1.2, v - 1.1));

      setShieldTempC((t) => {
        if (t < 2650) return t + 280;
        return 2720 + Math.floor(Math.random() * 80);
      });
    }, 450);

    return () => clearInterval(descentInterval);
  }, [currentStep]);

  // Step 1: Check Spacecraft handlers
  const handleTestRCS = () => {
    sounds.playRepair();
    setRcsTested(true);
    onAddScore(150);
  };
  const handleTestAvionics = () => {
    sounds.playRepair();
    setAvionicsTested(true);
    onAddScore(150);
  };
  const handleTestCabinSeal = () => {
    sounds.playRepair();
    setCabinSealTested(true);
    onAddScore(150);
  };

  const handleFinishStep1 = () => {
    if (!rcsTested || !avionicsTested || !cabinSealTested) {
      triggerFailure(
        'FLIGHT CONTROL FAILURE',
        'You attempted to skip essential spacecraft pre-entry checklists. Unchecked thruster manifolds could lead to loss of attitude control during hypersonic entry.',
        'CHECK_SPACECRAFT'
      );
      return;
    }
    sounds.playSuccess();
    setCurrentStep('CHECK_RESOURCES');
  };

  // Step 2: Check Resources handlers
  const handleCheckPropellant = () => {
    sounds.playRepair();
    setPropellantChecked(true);
    onAddScore(150);
  };
  const handleCheckO2 = () => {
    sounds.playRepair();
    setO2Checked(true);
    onAddScore(150);
  };
  const handleCheckBusVoltage = () => {
    sounds.playRepair();
    setBusVoltageChecked(true);
    onAddScore(150);
  };

  const handleFinishStep2 = () => {
    if (!propellantChecked || !o2Checked || !busVoltageChecked) {
      triggerFailure(
        'UNVERIFIED CONSUMABLES',
        'De-orbit propellant and cabin electrical buses must be fully verified before committing to irreversible atmospheric entry.',
        'CHECK_RESOURCES'
      );
      return;
    }
    sounds.playSuccess();
    setCurrentStep('PREPARE_HEAT_SHIELD');
  };

  // Step 3: Prepare Heat Shield handlers
  const handleJettisonServiceModule = () => {
    sounds.playRepair();
    setServiceModuleJettisoned(true);
    onAddScore(200);
  };

  const handleOrientHeatShield = () => {
    sounds.playRepair();
    setHeatShieldOriented(true);
    onAddScore(200);
  };

  const handleCommitReentry = () => {
    if (!serviceModuleJettisoned) {
      triggerFailure(
        'SERVICE MODULE STILL ATTACHED',
        'Atmospheric re-entry requires jettisoning the cylindrical service module so the blunt thermal heat shield can face the atmospheric flow!',
        'PREPARE_HEAT_SHIELD'
      );
      return;
    }

    if (!heatShieldOriented) {
      triggerFailure(
        'ATTITUDE ORIENTATION ERROR',
        'Spacecraft must be oriented with the ablative heat shield facing into the velocity vector. Forward hull cannot survive 2,700°C plasma.',
        'PREPARE_HEAT_SHIELD'
      );
      return;
    }

    // Check entry angle corridor
    if (entryAngle < 5.3) {
      triggerFailure(
        'TRAJECTORY TOO SHALLOW: ATMOSPHERIC SKIP',
        `Entry flight path angle of ${entryAngle}° is too shallow! The spacecraft skipped off the dense upper atmosphere like a stone on water and bounced back into high elliptical orbit with no remaining propellant.`,
        'PREPARE_HEAT_SHIELD'
      );
      return;
    }

    if (entryAngle > 7.3) {
      triggerFailure(
        'TRAJECTORY TOO STEEP: THERMAL & G-FORCE OVERLOAD',
        `Entry flight path angle of ${entryAngle}° is too steep! Deceleration peaked above 18 Gs and thermal heat flux exceeded 3,600°C, destroying the heat shield structure.`,
        'PREPARE_HEAT_SHIELD'
      );
      return;
    }

    // Valid corridor!
    sounds.playSuccess();
    onAddScore(400);
    setCurrentStep('START_REENTRY');
  };

  // Step 5: Parachute deployment actions
  const handleDeployDrogue = () => {
    // Drogue must be deployed when subsonic / high altitude (~8-10 km)
    if (velocityMach > 3.0) {
      triggerFailure(
        'DROGUE CHUTES DEPLOYED AT SUPERSONIC VELOCITY',
        `Drogue parachutes deployed at Mach ${velocityMach.toFixed(1)}! Extreme aerodynamic drag tore the risers completely off the capsule.`,
        'OPEN_PARACHUTE'
      );
      return;
    }

    sounds.playRepair();
    setDrogueDeployed(true);
    setVelocityMach(0.6);
    setAltitudeKm(4.2);
    setShieldTempC(120);
    onAddScore(300);
  };

  const handleDeployMainChutes = () => {
    if (!drogueDeployed) {
      triggerFailure(
        'PREMATURE MAIN PARACHUTE DEPLOYMENT',
        'Main parachute canopies are too large to survive without initial drogue chute deceleration and attitude stabilization!',
        'OPEN_PARACHUTE'
      );
      return;
    }

    sounds.playSuccess();
    setMainChutesDeployed(true);
    setVelocityMach(0.08); // 25 km/h splashdown speed
    setAltitudeKm(0);
    setShieldTempC(35);
    onAddScore(500);

    setTimeout(() => {
      sounds.playSuccess();
      setCurrentStep('LANDING_SUCCESS');
      onLevelComplete();
    }, 1500);
  };

  const triggerFailure = (title: string, explanation: string, retryStep: FlightStep) => {
    sounds.playError();
    setFailure({
      title,
      explanation,
      retryStep,
    });
  };

  const handleRetry = () => {
    if (!failure) return;
    sounds.playClick();
    const retryTo = failure.retryStep;
    setFailure(null);
    setCurrentStep(retryTo);

    if (retryTo === 'PREPARE_HEAT_SHIELD') {
      setEntryAngle(6.2);
    } else if (retryTo === 'OPEN_PARACHUTE') {
      setAltitudeKm(10);
      setVelocityMach(1.4);
      setDrogueDeployed(false);
      setMainChutesDeployed(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', width: '100%' }}>
      {/* Header bar */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌍</span>
          <div>
            <div style={{ fontWeight: 800, color: '#00e676', fontSize: '1rem' }}>LEVEL 3: RETURN TO EARTH</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Orion Atmospheric Entry Corridor & Splashdown</div>
          </div>
        </div>

        {/* Phase Stepper Pills */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <span className={`badge ${currentStep === 'CHECK_SPACECRAFT' ? 'badge-cyan' : 'badge-green'}`}>
            1. SYSTEMS
          </span>
          <span className={`badge ${currentStep === 'CHECK_RESOURCES' ? 'badge-cyan' : 'badge-green'}`}>
            2. RESOURCES
          </span>
          <span className={`badge ${currentStep === 'PREPARE_HEAT_SHIELD' ? 'badge-cyan' : 'badge-green'}`}>
            3. HEAT SHIELD
          </span>
          <span className={`badge ${currentStep === 'START_REENTRY' ? 'badge-cyan' : 'badge-green'}`}>
            4. RE-ENTRY
          </span>
          <span className={`badge ${currentStep === 'OPEN_PARACHUTE' ? 'badge-cyan' : 'badge-green'}`}>
            5. PARACHUTE
          </span>
          <span className={`badge ${currentStep === 'LANDING_SUCCESS' ? 'badge-green' : 'badge-gold'}`}>
            6. TOUCHDOWN
          </span>
        </div>
      </div>

      {/* Primary Flight Telemetry HUD */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          marginBottom: '20px',
          background: 'radial-gradient(ellipse at center, rgba(13, 27, 42, 0.9) 0%, #030712 100%)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '14px',
          textAlign: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>ALTITUDE</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#00e5ff', fontFamily: 'monospace' }}>
            {altitudeKm.toFixed(1)} KM
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>VELOCITY</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: velocityMach > 5 ? '#ff5252' : '#00e676', fontFamily: 'monospace' }}>
            Mach {velocityMach.toFixed(1)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>HEAT SHIELD TEMP</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: shieldTempC > 1500 ? '#ff5252' : shieldTempC > 100 ? '#ffd166' : '#00e676', fontFamily: 'monospace' }}>
            {shieldTempC.toLocaleString()}°C
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>COMMUNICATION</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 800, color: plasmaPhase ? '#ff5252' : '#00e676', fontFamily: 'monospace', marginTop: '4px' }}>
            {plasmaPhase ? '⚡ BLACKOUT' : '🟢 DSN LOCKED'}
          </div>
        </div>
      </div>

      {/* Dynamic Content by Step */}

      {/* STEP 1: Check Spacecraft */}
      {currentStep === 'CHECK_SPACECRAFT' && (
        <div className="glass-panel" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            CHECKPOINT 1 OF 6
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
            🛠️ CHECK SPACECRAFT SYSTEMS
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
            Prior to executing the irreversible de-orbit burn from lunar transfer orbit, the flight computer requires a full manual verification of critical spacecraft hardware.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderColor: rcsTested ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>1. Reaction Control Thrusters (RCS)</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Test 16 bipropellant attitude thrusters for pitch, yaw, and roll orientation.
              </p>
              <button
                disabled={rcsTested}
                onClick={handleTestRCS}
                className={rcsTested ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {rcsTested ? '✓ RCS FIRING NOMINAL' : 'FIRE TEST RCS PULSE (+150)'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderColor: avionicsTested ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>2. Guidance & Avionics Computers</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Execute self-diagnostic test on triply-redundant flight computers.
              </p>
              <button
                disabled={avionicsTested}
                onClick={handleTestAvionics}
                className={avionicsTested ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {avionicsTested ? '✓ AVIONICS 100% ONLINE' : 'RUN FLIGHT DIAGNOSTIC (+150)'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderColor: cabinSealTested ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>3. Cabin Pressure Seals & Locks</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Verify hatch latch mechanisms and structural cabin pressure integrity at 14.7 psi.
              </p>
              <button
                disabled={cabinSealTested}
                onClick={handleTestCabinSeal}
                className={cabinSealTested ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {cabinSealTested ? '✓ CABIN INTEGRITY LOCKED' : 'PRESSURE SEAL CHECK (+150)'}
              </button>
            </div>
          </div>

          <button
            onClick={handleFinishStep1}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            CONFIRM ALL SYSTEMS & PROCEED TO RESOURCE AUDIT →
          </button>
        </div>
      )}

      {/* STEP 2: Check Resources */}
      {currentStep === 'CHECK_RESOURCES' && (
        <div className="glass-panel" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            CHECKPOINT 2 OF 6
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
            📊 CHECK CRITICAL CONSUMABLES & POWER
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
            Verify onboard consumable reserves to ensure sufficient delta-V fuel for the atmospheric injection burn and survival through splashdown.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderColor: propellantChecked ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>1. De-Orbit Propellant Reserves</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Audit hypergolic fuel tanks: 120 kg remaining (exceeds 95 kg minimum required).
              </p>
              <button
                disabled={propellantChecked}
                onClick={handleCheckPropellant}
                className={propellantChecked ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {propellantChecked ? '✓ FUEL AUDIT CERTIFIED' : 'VERIFY PROPELLANT TANK (+150)'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderColor: o2Checked ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>2. Crew Cabin O2 & Life Support</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Verify high-pressure oxygen bottles: 40 hours of breathing gas remaining.
              </p>
              <button
                disabled={o2Checked}
                onClick={handleCheckO2}
                className={o2Checked ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {o2Checked ? '✓ O2 FLOW CERTIFIED' : 'VERIFY CABIN O2 (+150)'}
              </button>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderColor: busVoltageChecked ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>3. Main Electrical Bus Voltage</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '12px' }}>
                Verify lithium-ion auxiliary battery bus: 28.4 V DC stable across all circuits.
              </p>
              <button
                disabled={busVoltageChecked}
                onClick={handleCheckBusVoltage}
                className={busVoltageChecked ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '8px' }}
              >
                {busVoltageChecked ? '✓ VOLTAGE NOMINAL' : 'CHECK MAIN BUS VOLTAGE (+150)'}
              </button>
            </div>
          </div>

          <button
            onClick={handleFinishStep2}
            className="btn-primary"
            style={{ width: '100%', padding: '14px', fontSize: '1.05rem' }}
          >
            CONFIRM CONSUMABLES & PROCEED TO HEAT SHIELD PREPARATION →
          </button>
        </div>
      )}

      {/* STEP 3: Prepare Heat Shield & Entry Corridor */}
      {currentStep === 'PREPARE_HEAT_SHIELD' && (
        <div className="glass-panel" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
          <div className="badge badge-cyan" style={{ marginBottom: '8px' }}>
            CHECKPOINT 3 OF 6
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
            🛡️ PREPARE HEAT SHIELD & FLIGHT PATH ANGLE
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
            The thermal protection system must withstand extreme plasma friction. Jettison the service module, point the ablative heat shield forward, and align entry corridor between 5.5° and 7.0°.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Jettison Module */}
            <div className="glass-panel" style={{ padding: '18px', borderColor: serviceModuleJettisoned ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>1. Service Module Separation</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                Fire pyrotechnic separation bolts to detach the cylindrical service module from the crew module.
              </p>
              <button
                disabled={serviceModuleJettisoned}
                onClick={handleJettisonServiceModule}
                className={serviceModuleJettisoned ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '10px' }}
              >
                {serviceModuleJettisoned ? '✓ SERVICE MODULE SEPARATED' : '💥 JETTISON SERVICE MODULE (+200)'}
              </button>
            </div>

            {/* Orient Heat Shield */}
            <div className="glass-panel" style={{ padding: '18px', borderColor: heatShieldOriented ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.2)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>2. Blunt Body Shield Orientation</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                Pitch the capsule blunt base forward into the atmospheric velocity vector to form the shockwave boundary.
              </p>
              <button
                disabled={heatShieldOriented}
                onClick={handleOrientHeatShield}
                className={heatShieldOriented ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '10px' }}
              >
                {heatShieldOriented ? '✓ HEAT SHIELD ORIENTED FORWARD' : '🔄 ORIENT BLUNT SHIELD (+200)'}
              </button>
            </div>
          </div>

          {/* Interactive Entry Angle Slider */}
          <div
            className="glass-panel"
            style={{
              padding: '20px',
              marginBottom: '24px',
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid rgba(0,229,255,0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong style={{ color: '#00e5ff', fontSize: '1rem' }}>3. CALIBRATE FLIGHT PATH ENTRY CORRIDOR</strong>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Target Range: 5.5° to 7.0° (Artemis Corridor)</div>
              </div>
              <div
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: entryAngle >= 5.5 && entryAngle <= 7.0 ? '#00e676' : '#ff5252',
                }}
              >
                {entryAngle.toFixed(1)}°
              </div>
            </div>

            <input
              type="range"
              min="3.0"
              max="9.5"
              step="0.1"
              value={entryAngle}
              onChange={(e) => setEntryAngle(parseFloat(e.target.value))}
              style={{ width: '100%', cursor: 'pointer', marginBottom: '10px' }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8' }}>
              <span style={{ color: '#ff5252' }}>3.0° (Too Shallow - Will Skip Off)</span>
              <span style={{ color: '#00e676', fontWeight: 'bold' }}>5.5° - 7.0° (Optimal Corridor)</span>
              <span style={{ color: '#ff5252' }}>9.5° (Too Steep - Burn Up)</span>
            </div>
          </div>

          <button
            onClick={handleCommitReentry}
            className="btn-primary"
            style={{ width: '100%', padding: '16px', fontSize: '1.15rem' }}
          >
            🔥 EXECUTE ATMOSPHERIC INTERFACE RE-ENTRY →
          </button>
        </div>
      )}

      {/* STEP 4: Start Re-entry (Descent & Plasma Phase) */}
      {currentStep === 'START_REENTRY' && (
        <div
          className="glass-panel"
          style={{
            padding: '30px',
            textAlign: 'center',
            background: 'radial-gradient(circle at center, rgba(80, 20, 20, 0.8) 0%, #050814 100%)',
            border: '2px solid #ff5252',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div className="badge badge-red" style={{ marginBottom: '12px', fontSize: '0.9rem' }}>
            ⚡ HYPERSONIC RE-ENTRY IN PROGRESS
          </div>
          <h2 style={{ fontSize: '2rem', color: '#fff', marginBottom: '8px' }}>
            MACH 25 ATMOSPHERIC INTERFACE
          </h2>
          <p style={{ color: '#fecaca', fontSize: '0.95rem', maxWidth: '650px', margin: '0 auto 24px' }}>
            Ionized air creates a 2,700°C plasma shockwave around the capsule! Avcoat ablative tiles are actively shedding the heat. Stand by for deceleration through blackout...
          </p>

          {/* Visual Plasma Capsule Art */}
          <div style={{ position: 'relative', width: '220px', height: '140px', margin: '0 auto 24px' }}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 82, 82, 0.7) 0%, rgba(255, 179, 0, 0.4) 60%, transparent 100%)',
                animation: 'pulse-danger 0.5s infinite',
              }}
            />
            <div style={{ fontSize: '64px', position: 'relative', zIndex: 2, transform: 'rotate(180deg)' }}>
              🛸
            </div>
            <div className="thruster-flame" style={{ fontSize: '36px', marginTop: '-20px', position: 'relative', zIndex: 1 }}>
              🔥
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', fontSize: '0.9rem', color: '#fecaca' }}>
            <div>Altitude: <strong>{altitudeKm.toFixed(0)} km</strong></div>
            <div>Velocity: <strong>Mach {velocityMach.toFixed(1)}</strong></div>
            <div>Deceleration: <strong>4.8 G</strong></div>
          </div>
        </div>
      )}

      {/* STEP 5: Parachute Deployment */}
      {currentStep === 'OPEN_PARACHUTE' && (
        <div className="glass-panel" style={{ padding: '24px', animation: 'fadeIn 0.3s ease' }}>
          <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
            CHECKPOINT 5 OF 6
          </div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '8px' }}>
            🪂 DEPLOY BRAKING PARACHUTE SYSTEM
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '20px' }}>
            Capsule has survived the plasma burn and entered dense troposphere air. Deploy the drogue chutes to stabilize and slow below Mach 1, then deploy main canopies for soft ocean splashdown.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {/* Drogue Parachute */}
            <div className="glass-panel" style={{ padding: '18px', borderColor: drogueDeployed ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.3)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>1. Deploy Drogue Stabilization Chutes</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                Jettison forward bay apex cover and fire mortar to deploy dual drogue parachutes (~8,000m altitude).
              </p>
              <button
                disabled={drogueDeployed}
                onClick={handleDeployDrogue}
                className={drogueDeployed ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '12px' }}
              >
                {drogueDeployed ? '✓ DROGUE CHUTES DEPLOYED & STABILIZED' : '🪂 DEPLOY DROGUE PARACHUTES (+300)'}
              </button>
            </div>

            {/* Main Parachutes */}
            <div className="glass-panel" style={{ padding: '18px', borderColor: mainChutesDeployed ? 'rgba(0,230,118,0.4)' : 'rgba(0,229,255,0.3)' }}>
              <div style={{ fontWeight: 700, marginBottom: '6px' }}>2. Deploy Triple Main Parachutes</div>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '14px' }}>
                Release drogue chutes and reef out three giant 116-foot main canopies at 2,500m to decelerate to 25 km/h.
              </p>
              <button
                disabled={!drogueDeployed || mainChutesDeployed}
                onClick={handleDeployMainChutes}
                className={mainChutesDeployed ? 'btn-success' : 'btn-primary'}
                style={{ width: '100%', padding: '12px' }}
              >
                {mainChutesDeployed ? '✓ MAIN CANOPIES INFLATED' : drogueDeployed ? '🪂 DEPLOY MAIN TRIPLE CANOPIES (+500)' : 'WAIT FOR DROGUE CHUTES FIRST'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 6: Landing Success & Certification */}
      {currentStep === 'LANDING_SUCCESS' && (
        <div
          className="glass-panel"
          style={{
            padding: '36px 24px',
            textAlign: 'center',
            maxWidth: '720px',
            margin: '0 auto',
            animation: 'fadeIn 0.5s ease',
          }}
        >
          <div
            style={{
              width: '90px',
              height: '90px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #00e676 40%, #0077b6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '48px',
              margin: '0 auto 16px',
              boxShadow: '0 0 35px rgba(0, 230, 118, 0.7)',
            }}
          >
            🌊
          </div>

          <div className="badge badge-green" style={{ marginBottom: '10px', fontSize: '0.9rem', padding: '6px 16px' }}>
            ★ PACIFIC OCEAN SPLASHDOWN CONFIRMED ★
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              background: 'linear-gradient(180deg, #ffffff 0%, #69f0ae 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px',
            }}
          >
            MISSION SUCCESS — JUNIOR ASTRONAUT CERTIFIED!
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '24px', maxWidth: '600px', margin: '0 auto 24px' }}>
            Cadet <strong style={{ color: '#00e5ff' }}>{playerName || 'Cadet Explorer'}</strong>, your flawless execution of orbital satellite repair, lunar resource extraction, and precision atmospheric re-entry has met all NASA Space Apps Challenge standards!
          </p>

          {/* NASA Photo */}
          {nasaImage && (
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(0,229,255,0.3)', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>
              <img
                src={nasaImage.imageUrl}
                alt={nasaImage.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.6)', fontSize: '0.8rem', color: '#94a3b8' }}>
                NASA Recovery: {nasaImage.title}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                sounds.playClick();
                // Navigate to mission summary / certificate
                onLevelComplete();
              }}
              className="btn-success"
              style={{ padding: '14px 28px', fontSize: '1.1rem' }}
            >
              📜 VIEW OFFICIAL NASA CERTIFICATE
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

      {/* Failure & Retry Modal */}
      {failure && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(25, 4, 10, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-panel-danger" style={{ maxWidth: '520px', width: '100%', padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '10px' }}>⚠️</div>
            <h3 style={{ fontSize: '1.6rem', color: '#ff5252', marginBottom: '10px' }}>
              {failure.title}
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '24px' }}>
              {failure.explanation}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleRetry}
                className="btn-success"
                style={{ padding: '12px 24px', fontSize: '1rem' }}
              >
                🔄 RETRY FLIGHT PHASE
              </button>
              <button
                onClick={onNavigateMenu}
                className="btn-secondary"
                style={{ padding: '12px 20px' }}
              >
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
