'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { sounds } from '../../utils/audio';
import { fetchNASAImage, NASA_EDUCATIONAL_FACTS } from '../../utils/nasaApi';
import { NASAImageItem, EmergencyEvent, EmergencyType } from '../../types/game';

interface MoonSurvivalMissionProps {
  onLevelComplete: () => void;
  onAddScore: (points: number) => void;
  onNavigateMenu: () => void;
}

interface WorldEntity {
  id: string;
  name: string;
  type: 'base' | 'rover' | 'solar' | 'greenhouse' | 'crater' | 'ice' | 'mineral' | 'rocket' | 'great_crater';
  x: number;
  y: number;
  radius: number;
  icon: string;
  interacted?: boolean;
}

const EMERGENCY_TEMPLATES: Array<{
  type: EmergencyType;
  title: string;
  description: string;
  actionName: string;
  tip: string;
}> = [
  {
    type: 'oxygen',
    title: '⚠️ EMERGENCY: OXYGEN LEAK!',
    description: 'Micro-puncture detected in astronaut suit secondary valve! Oxygen reserves venting into vacuum.',
    actionName: 'PATCH O2 SEAL',
    tip: 'Apply emergency resin sealant patch to prevent suit depressurization.',
  },
  {
    type: 'solar',
    title: '⚠️ EMERGENCY: SOLAR RADIATION STORM!',
    description: 'NASA SOHO detected a Coronal Mass Ejection! Intense ionizing radiation wave arriving.',
    actionName: 'ENGAGE RADIATION SHIELD',
    tip: 'Deploy electromagnetic deflector or take shelter inside the lunar base habitat.',
  },
  {
    type: 'power',
    title: '⚠️ EMERGENCY: MAIN POWER FAILURE!',
    description: 'Base solar array inverter surged and tripped main circuit breakers. Grid offline.',
    actionName: 'RESET POWER RELAY',
    tip: 'Cycle high-voltage switchgear breakers to restore habitat power.',
  },
  {
    type: 'rover',
    title: '⚠️ EMERGENCY: ROVER DRIVETRAIN JAM!',
    description: 'Abrasive lunar regolith dust infiltrated the electric wheel drive motor assembly.',
    actionName: 'PURGE MOTOR DUST',
    tip: 'Blow nitrogen gas purge through wheel bearings and reset torque limiter.',
  },
  {
    type: 'greenhouse',
    title: '⚠️ EMERGENCY: GREENHOUSE PUMP FREEZE!',
    description: 'Lunar night chill froze the hydroponic nutrient solution circulation line.',
    actionName: 'THAW GREENHOUSE LOOP',
    tip: 'Activate thermal heating coils to restart vital crop irrigation.',
  },
  {
    type: 'comm',
    title: '⚠️ EMERGENCY: COMMUNICATION BLACKOUT!',
    description: 'Lunar seismic tremor misaligned the high-gain telemetry dish to NASA Houston.',
    actionName: 'RE-ALIGN COMM DISH',
    tip: 'Recalibrate antenna tracking servo to lock onto the Lunar Gateway orbiter.',
  },
];

export default function MoonSurvivalMission({
  onLevelComplete,
  onAddScore,
  onNavigateMenu,
}: MoonSurvivalMissionProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Astronaut Position & State
  const [playerX, setPlayerX] = useState(250);
  const [playerY, setPlayerY] = useState(240);
  const [inRover, setInRover] = useState(false);
  const [roverX, setRoverX] = useState(290);
  const [roverY, setRoverY] = useState(260);

  // 5 Survival Resources
  const [oxygen, setOxygen] = useState(100);
  const [energy, setEnergy] = useState(100);
  const [water, setWater] = useState(20); // melted clean water
  const [rawIce, setRawIce] = useState(15); // mined ice
  const [food, setFood] = useState(25);
  const [health, setHealth] = useState(100);
  const [minerals, setMinerals] = useState(15);

  // Rocket Provisions (8 Requirements)
  const [rocketProvisions, setRocketProvisions] = useState({
    fuel: 0, // needs 50 (from water)
    power: 0, // needs 100 (from energy)
    o2: 0, // needs 40 (from oxygen)
    food: 0, // needs 30 (from food)
    water: 0, // needs 30 (from water)
    comm: false, // antenna calibrated
    nav: false, // trajectory locked
    hull: 0, // needs 40 (from minerals)
  });

  // Safe vs Risky Crater Modal
  const [showCraterChoice, setShowCraterChoice] = useState(false);
  const [craterOutcome, setCraterOutcome] = useState<string | null>(null);

  // Dynamic Emergency State
  const [activeEmergency, setActiveEmergency] = useState<EmergencyEvent | null>(null);
  const [emergencyTimer, setEmergencyTimer] = useState(0);

  // Rocket Launching Animation
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchCountdown, setLaunchCountdown] = useState<number | null>(null);

  // Player Failure / Medevac Modal
  const [isDead, setIsDead] = useState(false);

  // NASA Public Imagery & Fact
  const [nasaImage, setNasaImage] = useState<NASAImageItem | null>(null);
  const [randomFact, setRandomFact] = useState('');

  // Notifications banner
  const [notice, setNotice] = useState<string | null>('Welcome to the Lunar South Pole! Harvest ice & minerals, manage ECLSS, and prep the return rocket.');

  // Active Keys set for smooth movement
  const keysPressed = useRef<Record<string, boolean>>({});

  // World Entities / Landmarks
  const [entities, setEntities] = useState<WorldEntity[]>([
    { id: 'base', name: 'Lunar Base Habitat', type: 'base', x: 200, y: 220, radius: 45, icon: '🏠' },
    { id: 'solar', name: 'Solar Panel Array', type: 'solar', x: 120, y: 110, radius: 40, icon: '⚡' },
    { id: 'greenhouse', name: 'Hydroponic Greenhouse', type: 'greenhouse', x: 300, y: 120, radius: 36, icon: '🌱' },
    { id: 'great_crater', name: 'Shackleton Deep Crater', type: 'great_crater', x: 620, y: 380, radius: 60, icon: '🕳️' },
    { id: 'rocket', name: 'Return Rocket (Orion)', type: 'rocket', x: 680, y: 150, radius: 50, icon: '🚀' },

    // Harvestable Ice Nodes
    { id: 'ice_1', name: 'Water Ice Deposit', type: 'ice', x: 450, y: 280, radius: 25, icon: '💧' },
    { id: 'ice_2', name: 'Water Ice Deposit', type: 'ice', x: 540, y: 440, radius: 25, icon: '💧' },
    { id: 'ice_3', name: 'Water Ice Deposit', type: 'ice', x: 380, y: 420, radius: 25, icon: '💧' },

    // Harvestable Mineral Rocks
    { id: 'min_1', name: 'Titanium Mineral Rock', type: 'mineral', x: 420, y: 130, radius: 25, icon: '⛏️' },
    { id: 'min_2', name: 'Ilmenite Mineral Node', type: 'mineral', x: 560, y: 220, radius: 25, icon: '⛏️' },
    { id: 'min_3', name: 'Basalt Regolith Node', type: 'mineral', x: 220, y: 410, radius: 25, icon: '⛏️' },

    // Craters
    { id: 'c1', name: 'Impact Crater', type: 'crater', x: 490, y: 80, radius: 30, icon: '🌑' },
    { id: 'c2', name: 'Small Crater', type: 'crater', x: 100, y: 340, radius: 28, icon: '🌑' },
  ]);

  // Load NASA Image & Fact on mount
  useEffect(() => {
    fetchNASAImage('Apollo lunar surface astronaut rover', 'moon').then((data) => {
      setNasaImage(data);
    });
    const facts = NASA_EDUCATIONAL_FACTS.moon;
    setRandomFact(facts[Math.floor(Math.random() * facts.length)]);
  }, []);

  // Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true;
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      if (e.key.toLowerCase() === 'e' || e.key === ' ') {
        handleInteractWithNearby();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [playerX, playerY, inRover, roverX, roverY, entities]);

  // Main Game Loop for Movement & Depletion
  useEffect(() => {
    const interval = setInterval(() => {
      if (isLaunching || isDead) return;

      // Handle Key movement
      const keys = keysPressed.current;
      const speed = inRover ? 5.5 : 3.0;
      let dx = 0;
      let dy = 0;

      if (keys['arrowup'] || keys['w']) dy -= speed;
      if (keys['arrowdown'] || keys['s']) dy += speed;
      if (keys['arrowleft'] || keys['a']) dx -= speed;
      if (keys['arrowright'] || keys['d']) dx += speed;

      if (dx !== 0 || dy !== 0) {
        // Move player
        setPlayerX((prev) => Math.max(30, Math.min(770, prev + dx)));
        setPlayerY((prev) => Math.max(30, Math.min(450, prev + dy)));

        if (inRover) {
          setRoverX((prev) => Math.max(30, Math.min(770, prev + dx)));
          setRoverY((prev) => Math.max(30, Math.min(450, prev + dy)));
        }

        // Movement drains oxygen & energy
        const o2Drain = inRover ? 0.04 : 0.08;
        const energyDrain = inRover ? 0.08 : 0.06;

        setOxygen((prev) => Math.max(0, prev - o2Drain));
        setEnergy((prev) => Math.max(0, prev - energyDrain));
      }

      // Base vicinity recharge
      const distToBase = Math.hypot(playerX - 200, playerY - 220);
      if (distToBase < 65) {
        // Inside/near base: recover oxygen, energy, health slowly
        setOxygen((prev) => Math.min(100, prev + 0.35));
        setEnergy((prev) => Math.min(100, prev + 0.25));
        setHealth((prev) => Math.min(100, prev + 0.2));
      }

      // Solar Panel vicinity recharge
      const distToSolar = Math.hypot(playerX - 120, playerY - 110);
      if (distToSolar < 55) {
        setEnergy((prev) => Math.min(100, prev + 0.8));
      }

      // Health penalty if O2 or Energy hits 0
      setOxygen((currO2) => {
        if (currO2 <= 0) {
          setHealth((h) => {
            const nextH = Math.max(0, h - 0.4);
            if (nextH <= 0 && !isDead) {
              handlePlayerDeath();
            }
            return nextH;
          });
        }
        return currO2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [playerX, playerY, inRover, isLaunching, isDead]);

  // Periodic random emergency trigger (Every 28-36 seconds if none active)
  useEffect(() => {
    const emergencyInterval = setInterval(() => {
      if (isLaunching || isDead || activeEmergency) return;

      // 40% chance of emergency event triggering
      if (Math.random() < 0.45) {
        triggerRandomEmergency();
      }
    }, 28000);

    return () => clearInterval(emergencyInterval);
  }, [activeEmergency, isLaunching, isDead]);

  // Emergency countdown timer
  useEffect(() => {
    if (!activeEmergency) return;

    const timer = setInterval(() => {
      setEmergencyTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEmergencyTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeEmergency]);

  const triggerRandomEmergency = (forcedType?: EmergencyType) => {
    sounds.playAlarm();
    const template = forcedType
      ? EMERGENCY_TEMPLATES.find((t) => t.type === forcedType) || EMERGENCY_TEMPLATES[0]
      : EMERGENCY_TEMPLATES[Math.floor(Math.random() * EMERGENCY_TEMPLATES.length)];

    const event: EmergencyEvent = {
      id: Date.now().toString(),
      type: template.type,
      title: template.title,
      description: template.description,
      severity: 'high',
      timerSeconds: 22,
      repairActionName: template.actionName,
      mitigationTip: template.tip,
    };

    setActiveEmergency(event);
    setEmergencyTimer(22);
    setNotice(template.title);
  };

  const handleResolveEmergency = () => {
    if (!activeEmergency) return;
    sounds.playRepair();
    sounds.playCollect();
    onAddScore(350);
    setNotice(`✓ Resolved ${activeEmergency.title} (+350 PTS)! Systems stabilized.`);
    setActiveEmergency(null);
  };

  const handleEmergencyTimeout = () => {
    if (!activeEmergency) return;
    sounds.playError();
    setNotice(`❌ Emergency timed out! Suit & systems suffered damage.`);
    setHealth((prev) => Math.max(10, prev - 30));
    setOxygen((prev) => Math.max(10, prev - 25));
    setActiveEmergency(null);
  };

  const handlePlayerDeath = () => {
    sounds.playError();
    setIsDead(true);
  };

  const handleRevive = () => {
    sounds.playRepair();
    setHealth(100);
    setOxygen(100);
    setEnergy(100);
    setPlayerX(200);
    setPlayerY(220);
    setInRover(false);
    setIsDead(false);
    setNotice('Astronaut revived in Lunar Base medical airlock. Continue mission!');
  };

  // Interaction with nearby objects
  const handleInteractWithNearby = useCallback(() => {
    // 1. Check Rover mount/dismount
    const distToRover = Math.hypot(playerX - roverX, playerY - roverY);
    if (distToRover < 50) {
      sounds.playClick();
      setInRover((prev) => !prev);
      setNotice(inRover ? 'Dismounted Lunar Rover.' : 'Mounted Lunar Rover! Driving speed boosted 2x.');
      return;
    }

    // 2. Check nearby entity
    for (const ent of entities) {
      const dist = Math.hypot(playerX - ent.x, playerY - ent.y);
      if (dist < ent.radius + 25) {
        if (ent.type === 'ice') {
          sounds.playCollect();
          setRawIce((prev) => prev + 15);
          onAddScore(150);
          setNotice('Mined +15 Water Ice crystals (+150 PTS)! Process at Lunar Base.');
          // Respawn ice slightly elsewhere
          ent.x = Math.floor(Math.random() * 450) + 200;
          ent.y = Math.floor(Math.random() * 300) + 100;
          return;
        }

        if (ent.type === 'mineral') {
          sounds.playCollect();
          setMinerals((prev) => prev + 15);
          onAddScore(150);
          setNotice('Mined +15 Titanium/Ilmenite Minerals (+150 PTS)! Needed for rocket hull.');
          ent.x = Math.floor(Math.random() * 450) + 200;
          ent.y = Math.floor(Math.random() * 300) + 100;
          return;
        }

        if (ent.type === 'great_crater') {
          sounds.playBeep(600, 0.1);
          setShowCraterChoice(true);
          return;
        }

        if (ent.type === 'greenhouse') {
          handleHarvestGreenhouse();
          return;
        }

        if (ent.type === 'solar') {
          sounds.playRepair();
          setEnergy(100);
          setNotice('⚡ Suit energy recharged to 100% at Solar Panel Array.');
          return;
        }

        if (ent.type === 'base') {
          sounds.playRepair();
          setNotice('Inside Lunar Base. Use base terminal below to convert ice, water, and O2.');
          return;
        }

        if (ent.type === 'rocket') {
          sounds.playClick();
          setNotice('Return Rocket launchpad. Check provision requirements in the Rocket Control Panel below.');
          return;
        }
      }
    }
  }, [playerX, playerY, roverX, roverY, inRover, entities, onAddScore]);

  // Base Production Actions
  const handleMeltIce = () => {
    if (rawIce < 10) {
      sounds.playError();
      setNotice('Need at least 10 raw ice crystals to melt into drinking water!');
      return;
    }
    sounds.playCollect();
    setRawIce((prev) => prev - 10);
    setWater((prev) => prev + 15);
    onAddScore(100);
    setNotice('✓ Melted 10 Ice into +15 Clean Water (+100 PTS).');
  };

  const handleElectrolysis = () => {
    if (water < 10) {
      sounds.playError();
      setNotice('Need at least 10 Water for electrolysis oxygen generation!');
      return;
    }
    sounds.playRepair();
    setWater((prev) => prev - 10);
    setOxygen((prev) => Math.min(100, prev + 35));
    onAddScore(100);
    setNotice('✓ Electrolysis complete: Split H2O into +35% Oxygen (+100 PTS).');
  };

  const handleHarvestGreenhouse = () => {
    if (water < 10 || energy < 15) {
      sounds.playError();
      setNotice('Greenhouse requires 10 Water and 15 Energy to irrigate and harvest crops!');
      return;
    }
    sounds.playCollect();
    setWater((prev) => prev - 10);
    setEnergy((prev) => prev - 15);
    setFood((prev) => prev + 25);
    onAddScore(150);
    setNotice('🌱 Harvested +25 Fresh Hydroponic Food rations (+150 PTS).');
  };

  // Safe vs Risky Crater Exploration Choice
  const handleExploreCrater = (choice: 'safe' | 'risky') => {
    setShowCraterChoice(false);

    if (choice === 'safe') {
      sounds.playCollect();
      setOxygen((prev) => Math.max(10, prev - 12));
      setRawIce((prev) => prev + 25);
      setMinerals((prev) => prev + 20);
      onAddScore(200);
      setCraterOutcome('Safe Ridge Survey: Extracted +25 Ice and +20 Minerals with zero incident! (+200 PTS)');
    } else {
      // Risky
      setOxygen((prev) => Math.max(10, prev - 25));
      const roll = Math.random();

      if (roll > 0.45) {
        // High reward jackpot!
        sounds.playSuccess();
        setRawIce((prev) => prev + 65);
        setMinerals((prev) => prev + 60);
        onAddScore(600);
        setCraterOutcome('🏆 JACKPOT DESCENT! Deep crater shadow yielded +65 Ice and +60 Titanium Minerals! (+600 PTS)');
      } else {
        // Hazard strike!
        sounds.playError();
        setHealth((prev) => Math.max(20, prev - 25));
        setRawIce((prev) => prev + 20);
        triggerRandomEmergency('oxygen');
        setCraterOutcome('⚠️ CAVE-IN! Regolith slide damaged suit valve and triggered an Oxygen Leak!');
      }
    }
  };

  // Load Rocket Provisions
  const handleProvisionRocket = (item: keyof typeof rocketProvisions) => {
    if (item === 'fuel') {
      if (water < 15) {
        sounds.playError();
        setNotice('Need 15 Water to synthesize liquid hydrogen/oxygen rocket fuel!');
        return;
      }
      sounds.playRepair();
      setWater((prev) => prev - 15);
      setRocketProvisions((prev) => ({ ...prev, fuel: Math.min(50, prev.fuel + 15) }));
      onAddScore(100);
      setNotice('Synthesized and pumped +15 Fuel into Return Rocket.');
    } else if (item === 'power') {
      if (energy < 25) {
        sounds.playError();
        setNotice('Need at least 25 Energy to charge rocket avionics!');
        return;
      }
      sounds.playRepair();
      setEnergy((prev) => prev - 25);
      setRocketProvisions((prev) => ({ ...prev, power: Math.min(100, prev.power + 25) }));
      onAddScore(100);
      setNotice('Transferred +25 Power into Return Rocket backup cells.');
    } else if (item === 'o2') {
      if (oxygen < 25) {
        sounds.playError();
        setNotice('Need at least 25% Oxygen to fill rocket life support tanks!');
        return;
      }
      sounds.playRepair();
      setOxygen((prev) => prev - 25);
      setRocketProvisions((prev) => ({ ...prev, o2: Math.min(40, prev.o2 + 20) }));
      onAddScore(100);
      setNotice('Filled +20 Oxygen into rocket flight cabin.');
    } else if (item === 'food') {
      if (food < 15) {
        sounds.playError();
        setNotice('Need at least 15 Food rations for the return voyage!');
        return;
      }
      sounds.playRepair();
      setFood((prev) => prev - 15);
      setRocketProvisions((prev) => ({ ...prev, food: Math.min(30, prev.food + 15) }));
      onAddScore(100);
      setNotice('Stowed +15 Food rations into rocket galley.');
    } else if (item === 'water') {
      if (water < 15) {
        sounds.playError();
        setNotice('Need at least 15 Water to load rocket water stores!');
        return;
      }
      sounds.playRepair();
      setWater((prev) => prev - 15);
      setRocketProvisions((prev) => ({ ...prev, water: Math.min(30, prev.water + 15) }));
      onAddScore(100);
      setNotice('Loaded +15 Drinking Water into return spacecraft.');
    } else if (item === 'comm') {
      sounds.playRepair();
      setRocketProvisions((prev) => ({ ...prev, comm: true }));
      onAddScore(150);
      setNotice('✓ Deep Space Network telemetry carrier locked to NASA Houston.');
    } else if (item === 'nav') {
      sounds.playRepair();
      setRocketProvisions((prev) => ({ ...prev, nav: true }));
      onAddScore(150);
      setNotice('✓ Trans-Earth Insertion (TEI) trajectory calculated.');
    } else if (item === 'hull') {
      if (minerals < 15) {
        sounds.playError();
        setNotice('Need 15 Titanium Minerals to reinforce heat shield hull!');
        return;
      }
      sounds.playRepair();
      setMinerals((prev) => prev - 15);
      setRocketProvisions((prev) => ({ ...prev, hull: Math.min(40, prev.hull + 15) }));
      onAddScore(100);
      setNotice('Reinforced heat shield tiles with +15 Minerals.');
    }
  };

  // Check if rocket is 100% prepared
  const isRocketFullyPrepped =
    rocketProvisions.fuel >= 50 &&
    rocketProvisions.power >= 100 &&
    rocketProvisions.o2 >= 40 &&
    rocketProvisions.food >= 30 &&
    rocketProvisions.water >= 30 &&
    rocketProvisions.comm &&
    rocketProvisions.nav &&
    rocketProvisions.hull >= 40;

  // Handle Rocket Launch
  const handleLaunchRocket = () => {
    if (!isRocketFullyPrepped) {
      sounds.playError();
      setNotice('Return Rocket is not fully provisioned! Check missing items.');
      return;
    }

    sounds.playLaunch();
    setIsLaunching(true);
    setLaunchCountdown(3);

    const countInterval = setInterval(() => {
      setLaunchCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countInterval);
          setTimeout(() => {
            sounds.playSuccess();
            onAddScore(1000);
            onLevelComplete();
          }, 3200);
          return 0;
        }
        sounds.playBeep(440, 0.1);
        return prev - 1;
      });
    }, 1000);
  };

  // Canvas Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw Lunar Surface
    ctx.fillStyle = '#1e2430'; // Lunar regolith gray-dark
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle crater textures & dust speckles
    ctx.fillStyle = '#171c26';
    ctx.beginPath();
    ctx.arc(380, 260, 110, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(150, 390, 75, 0, Math.PI * 2);
    ctx.fill();

    // Distant Earth hanging in sky (top-left)
    const earthGrad = ctx.createRadialGradient(50, 45, 2, 50, 45, 22);
    earthGrad.addColorStop(0, '#38bdf8');
    earthGrad.addColorStop(0.7, '#0284c7');
    earthGrad.addColorStop(1, '#082f49');
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(50, 45, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw Entities
    entities.forEach((ent) => {
      ctx.save();
      // Outer aura / shadow
      ctx.beginPath();
      ctx.arc(ent.x, ent.y, ent.radius, 0, Math.PI * 2);

      if (ent.type === 'base') {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();

        // Base dome window
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.arc(ent.x, ent.y - 8, 14, 0, Math.PI * 2);
        ctx.fill();
      } else if (ent.type === 'solar') {
        ctx.fillStyle = 'rgba(2, 132, 199, 0.4)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      } else if (ent.type === 'greenhouse') {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.35)';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
      } else if (ent.type === 'great_crater') {
        ctx.fillStyle = 'rgba(5, 8, 18, 0.95)';
        ctx.strokeStyle = '#ffd166';
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 6]);
        ctx.fill();
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (ent.type === 'rocket') {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = isRocketFullyPrepped ? '#00e676' : '#ffd166';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();
      } else if (ent.type === 'ice') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.3)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      } else if (ent.type === 'mineral') {
        ctx.fillStyle = 'rgba(245, 158, 11, 0.3)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      } else {
        // crater
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();
      }

      // Draw Icon & Label
      ctx.font = `${Math.max(16, ent.radius * 0.55)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(ent.icon, ent.x, ent.y);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText(ent.name, ent.x, ent.y + ent.radius + 12);

      ctx.restore();
    });

    // Draw Unmounted Rover if player is not in it
    if (!inRover) {
      ctx.save();
      ctx.fillStyle = 'rgba(255, 209, 102, 0.2)';
      ctx.strokeStyle = '#ffd166';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(roverX, roverY, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.font = '18px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚜', roverX, roverY);

      ctx.font = '9px monospace';
      ctx.fillStyle = '#ffd166';
      ctx.fillText('LUNAR ROVER', roverX, roverY + 24);
      ctx.restore();
    }

    // Draw Player Astronaut (or Astronaut driving Rover)
    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.beginPath();
    ctx.ellipse(playerX, playerY + 12, inRover ? 22 : 12, inRover ? 10 : 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Aura ring
    ctx.strokeStyle = inRover ? '#ffd166' : '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(playerX, playerY, inRover ? 24 : 16, 0, Math.PI * 2);
    ctx.stroke();

    // Sprite
    ctx.font = inRover ? '24px sans-serif' : '20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(inRover ? '🚜👨‍🚀' : '👨‍🚀', playerX, playerY - 2);

    // Callsign tag above head
    ctx.font = 'bold 9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(inRover ? 'ROVER MODE' : 'CADET', playerX, playerY - 22);

    ctx.restore();
  }, [playerX, playerY, inRover, roverX, roverY, entities, isRocketFullyPrepped]);

  // Click on canvas to move player there
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const targetX = (e.clientX - rect.left) * scaleX;
    const targetY = (e.clientY - rect.top) * scaleY;

    setPlayerX(targetX);
    setPlayerY(targetY);
    if (inRover) {
      setRoverX(targetX);
      setRoverY(targetY);
    }
    sounds.playClick();
  };

  return (
    <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '16px 20px', width: '100%' }}>
      {/* Top Telemetry & Resource Gauges */}
      <div
        className="glass-panel"
        style={{
          padding: '14px 18px',
          marginBottom: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.4rem' }}>🌕</span>
          <div>
            <div style={{ fontWeight: 800, color: '#ffd166', fontSize: '1rem' }}>LEVEL 2: MOON SURVIVAL</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Shackleton Crater Expedition & Rocket Prep</div>
          </div>
        </div>

        {/* 5 Survival Resource Gauges */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {/* Oxygen */}
          <div className="hud-gauge">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#00e5ff' }}>💨 O2</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(oxygen)}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${oxygen}%`,
                  background: oxygen > 30 ? '#00e5ff' : '#ff5252',
                }}
              />
            </div>
          </div>

          {/* Energy */}
          <div className="hud-gauge">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#ffd166' }}>⚡ ENERGY</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(energy)}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${energy}%`,
                  background: energy > 30 ? '#ffd166' : '#ff5252',
                }}
              />
            </div>
          </div>

          {/* Water */}
          <div className="hud-gauge">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#38bdf8' }}>💧 WATER</span>
              <span style={{ fontWeight: 'bold' }}>{water}L (Ice: {rawIce})</span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, water * 1.5)}%`,
                  background: '#38bdf8',
                }}
              />
            </div>
          </div>

          {/* Food */}
          <div className="hud-gauge">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#4ade80' }}>🥗 FOOD</span>
              <span style={{ fontWeight: 'bold' }}>{food}</span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${Math.min(100, food * 2)}%`,
                  background: '#4ade80',
                }}
              />
            </div>
          </div>

          {/* Health */}
          <div className="hud-gauge">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
              <span style={{ color: '#f87171' }}>❤️ HEALTH</span>
              <span style={{ fontWeight: 'bold' }}>{Math.round(health)}%</span>
            </div>
            <div className="progress-bar-container" style={{ height: '8px' }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${health}%`,
                  background: health > 30 ? '#f87171' : '#ff0000',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notice & Status banner */}
      {notice && (
        <div
          style={{
            background: 'rgba(0, 229, 255, 0.1)',
            border: '1px solid rgba(0, 229, 255, 0.3)',
            borderRadius: '8px',
            padding: '10px 16px',
            marginBottom: '16px',
            fontSize: '0.85rem',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>🛰️ <strong>MISSION LOG:</strong> {notice}</span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Minerals: <strong style={{ color: '#f59e0b' }}>{minerals}</strong></span>
        </div>
      )}

      {/* Active Emergency Alert Bar */}
      {activeEmergency && (
        <div
          className="glass-panel-danger"
          style={{
            padding: '14px 20px',
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#ff5252' }}>
              {activeEmergency.title} ({emergencyTimer}s remaining)
            </div>
            <p style={{ fontSize: '0.85rem', color: '#fecaca', marginTop: '2px' }}>
              {activeEmergency.description} <em>{activeEmergency.mitigationTip}</em>
            </p>
          </div>
          <button
            onClick={handleResolveEmergency}
            className="btn-danger"
            style={{ padding: '10px 20px', fontSize: '0.95rem' }}
          >
            🛠️ {activeEmergency.repairActionName} (+350 PTS)
          </button>
        </div>
      )}

      {/* Main 2D Surface Canvas Area */}
      <div className="canvas-wrapper" style={{ marginBottom: '16px' }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={480}
          onClick={handleCanvasClick}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            cursor: 'crosshair',
          }}
        />

        {/* Mobility HUD Overlay */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            display: 'flex',
            gap: '8px',
            background: 'rgba(5, 12, 28, 0.75)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            fontSize: '0.8rem',
            color: '#94a3b8',
          }}
        >
          <span>Use <strong>WASD / Arrow Keys</strong> or <strong>Click Canvas</strong> to walk.</span>
        </div>

        {/* Action Button & Rover Toggle on Canvas */}
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
          }}
        >
          <button
            onClick={handleInteractWithNearby}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem' }}
          >
            ⚡ INTERACT (E / SPACE)
          </button>
        </div>
      </div>

      {/* Mobile / Touch On-Screen D-Pad & Controls */}
      <div
        className="glass-panel"
        style={{
          padding: '12px 20px',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>VIRTUAL D-PAD:</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 40px)', gap: '4px' }}>
            <div />
            <button
              onClick={() => {
                setPlayerY((p) => Math.max(30, p - 20));
                if (inRover) setRoverY((p) => Math.max(30, p - 20));
              }}
              className="btn-secondary"
              style={{ padding: '4px', fontSize: '1rem', width: '40px', height: '36px' }}
            >
              ▲
            </button>
            <div />

            <button
              onClick={() => {
                setPlayerX((p) => Math.max(30, p - 20));
                if (inRover) setRoverX((p) => Math.max(30, p - 20));
              }}
              className="btn-secondary"
              style={{ padding: '4px', fontSize: '1rem', width: '40px', height: '36px' }}
            >
              ◀
            </button>
            <button
              onClick={handleInteractWithNearby}
              className="btn-primary"
              style={{ padding: '4px', fontSize: '0.8rem', width: '40px', height: '36px' }}
              title="Interact"
            >
              OK
            </button>
            <button
              onClick={() => {
                setPlayerX((p) => Math.min(770, p + 20));
                if (inRover) setRoverX((p) => Math.min(770, p + 20));
              }}
              className="btn-secondary"
              style={{ padding: '4px', fontSize: '1rem', width: '40px', height: '36px' }}
            >
              ▶
            </button>

            <div />
            <button
              onClick={() => {
                setPlayerY((p) => Math.min(450, p + 20));
                if (inRover) setRoverY((p) => Math.min(450, p + 20));
              }}
              className="btn-secondary"
              style={{ padding: '4px', fontSize: '1rem', width: '40px', height: '36px' }}
            >
              ▼
            </button>
            <div />
          </div>
        </div>

        {/* Quick Operations Controls */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleMeltIce}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            💧 Melt Ice (10 Ice → 15 Water)
          </button>
          <button
            onClick={handleElectrolysis}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            💨 Electrolysis (10 Water → 35% O2)
          </button>
          <button
            onClick={handleHarvestGreenhouse}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '0.8rem' }}
          >
            🌱 Greenhouse (+25 Food)
          </button>
        </div>
      </div>

      {/* Return Rocket Preparation Console (Key Objective) */}
      <div className="glass-panel" style={{ padding: '22px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '6px' }}>
              PRIMARY LEVEL OBJECTIVE
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#fff' }}>🚀 RETURN ROCKET LAUNCHPAD CONSOLE</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Provision all 8 required systems to authorize Trans-Earth Insertion launch to Level 3.
            </p>
          </div>
          <button
            disabled={!isRocketFullyPrepped || isLaunching}
            onClick={handleLaunchRocket}
            className={isRocketFullyPrepped ? 'btn-success' : 'btn-primary'}
            style={{ padding: '12px 24px', fontSize: '1.05rem' }}
          >
            {isRocketFullyPrepped ? '🚀 LAUNCH TO EARTH (UNLOCK LEVEL 3)' : 'LOCK: PROVISIONING INCOMPLETE'}
          </button>
        </div>

        {/* 8 Provisions Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '12px',
          }}
        >
          {/* 1. Fuel */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>⛽ Liquid Fuel</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.fuel >= 50 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.fuel} / 50 L
              </span>
            </div>
            <button
              disabled={rocketProvisions.fuel >= 50}
              onClick={() => handleProvisionRocket('fuel')}
              className={rocketProvisions.fuel >= 50 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.fuel >= 50 ? '✓ TANK FULL' : '+ Pump 15 Fuel (-15 Water)'}
            </button>
          </div>

          {/* 2. Power */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>⚡ Battery Bank</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.power >= 100 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.power} / 100%
              </span>
            </div>
            <button
              disabled={rocketProvisions.power >= 100}
              onClick={() => handleProvisionRocket('power')}
              className={rocketProvisions.power >= 100 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.power >= 100 ? '✓ CHARGED' : '+ Charge 25% (-25 Energy)'}
            </button>
          </div>

          {/* 3. Cabin Oxygen */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>💨 Cabin O2</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.o2 >= 40 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.o2} / 40%
              </span>
            </div>
            <button
              disabled={rocketProvisions.o2 >= 40}
              onClick={() => handleProvisionRocket('o2')}
              className={rocketProvisions.o2 >= 40 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.o2 >= 40 ? '✓ FILLED' : '+ Fill 20% O2 (-25% O2)'}
            </button>
          </div>

          {/* 4. Food Supplies */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>🥗 Return Food</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.food >= 30 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.food} / 30 Rations
              </span>
            </div>
            <button
              disabled={rocketProvisions.food >= 30}
              onClick={() => handleProvisionRocket('food')}
              className={rocketProvisions.food >= 30 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.food >= 30 ? '✓ STOWED' : '+ Stow 15 Food (-15 Food)'}
            </button>
          </div>

          {/* 5. Drinking Water */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>💧 Clean Water</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.water >= 30 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.water} / 30 L
              </span>
            </div>
            <button
              disabled={rocketProvisions.water >= 30}
              onClick={() => handleProvisionRocket('water')}
              className={rocketProvisions.water >= 30 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.water >= 30 ? '✓ LOADED' : '+ Load 15 Water (-15 Water)'}
            </button>
          </div>

          {/* 6. DSN Comms */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>📡 DSN Comms</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.comm ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.comm ? 'ONLINE' : 'UNVERIFIED'}
              </span>
            </div>
            <button
              disabled={rocketProvisions.comm}
              onClick={() => handleProvisionRocket('comm')}
              className={rocketProvisions.comm ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.comm ? '✓ VERIFIED' : 'Calibrate DSN Antenna'}
            </button>
          </div>

          {/* 7. Navigation Guidance */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>🧭 TEI Guidance</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.nav ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.nav ? 'LOCKED' : 'UNCALIBRATED'}
              </span>
            </div>
            <button
              disabled={rocketProvisions.nav}
              onClick={() => handleProvisionRocket('nav')}
              className={rocketProvisions.nav ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.nav ? '✓ LOCKED' : 'Compute Earth Corridor'}
            </button>
          </div>

          {/* 8. Hull & Heat Shield */}
          <div style={{ background: 'rgba(0,0,0,0.35)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: '#fff' }}>🛡️ Heat Shield Hull</span>
              <span style={{ fontSize: '0.85rem', color: rocketProvisions.hull >= 40 ? '#00e676' : '#ffd166', fontWeight: 'bold' }}>
                {rocketProvisions.hull} / 40 Tiles
              </span>
            </div>
            <button
              disabled={rocketProvisions.hull >= 40}
              onClick={() => handleProvisionRocket('hull')}
              className={rocketProvisions.hull >= 40 ? 'btn-success' : 'btn-secondary'}
              style={{ width: '100%', padding: '6px 10px', fontSize: '0.75rem' }}
            >
              {rocketProvisions.hull >= 40 ? '✓ REINFORCED' : '+ 15 Tiles (-15 Minerals)'}
            </button>
          </div>
        </div>
      </div>

      {/* NASA Education & Moon Photo Card */}
      <div
        className="glass-panel"
        style={{
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {nasaImage && (
            <img
              src={nasaImage.imageUrl}
              alt="NASA Moon Exploration"
              style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="badge badge-gold" style={{ marginBottom: '4px' }}>
              NASA ARTEMIS SCIENCE FACT
            </div>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', maxWidth: '650px' }}>
              {randomFact}
            </p>
          </div>
        </div>
        <button onClick={onNavigateMenu} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
          MAIN MENU
        </button>
      </div>

      {/* Safe vs Risky Crater Exploration Modal */}
      {showCraterChoice && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            className="glass-panel"
            style={{
              maxWidth: '560px',
              width: '100%',
              padding: '28px',
              textAlign: 'center',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ fontSize: '42px', marginBottom: '10px' }}>🕳️</div>
            <div className="badge badge-gold" style={{ marginBottom: '8px' }}>
              TACTICAL DECISION POINT
            </div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#fff' }}>
              SHACKLETON SHADOW CRATER
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '22px' }}>
              You stand on the rim of the permanently shadowed crater. Extreme cold (-240°C) preserves giant deposits of water ice and titanium minerals. How do you proceed?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              {/* Option A: Safe */}
              <div
                style={{
                  background: 'rgba(0, 230, 118, 0.1)',
                  border: '1px solid rgba(0, 230, 118, 0.4)',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 800, color: '#00e676', marginBottom: '6px' }}>
                  🛡️ SAFE RIDGE SURVEY
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.6, paddingLeft: 0 }}>
                  <li>✓ Cost: 12% Oxygen</li>
                  <li>✓ Yield: +25 Water Ice</li>
                  <li>✓ Yield: +20 Minerals</li>
                  <li>✓ Hazard Risk: 0%</li>
                </ul>
                <button
                  onClick={() => handleExploreCrater('safe')}
                  className="btn-success"
                  style={{ width: '100%', marginTop: '12px', padding: '8px' }}
                >
                  EXECUTE SAFE SURVEY
                </button>
              </div>

              {/* Option B: Risky */}
              <div
                style={{
                  background: 'rgba(255, 82, 82, 0.1)',
                  border: '1px solid rgba(255, 82, 82, 0.4)',
                  borderRadius: '10px',
                  padding: '16px',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 800, color: '#ff5252', marginBottom: '6px' }}>
                  ⚡ DEEP CRATER DESCENT
                </div>
                <ul style={{ fontSize: '0.8rem', color: '#cbd5e1', listStyle: 'none', lineHeight: 1.6, paddingLeft: 0 }}>
                  <li>⚠️ Cost: 25% Oxygen</li>
                  <li>💎 Jackpot Yield: +65 Ice, +60 Minerals</li>
                  <li>⚠️ Hazard Risk: 55% chance of rockslide & O2 leak</li>
                </ul>
                <button
                  onClick={() => handleExploreCrater('risky')}
                  className="btn-danger"
                  style={{ width: '100%', marginTop: '12px', padding: '8px' }}
                >
                  TAKE THE RISK!
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowCraterChoice(false)}
              className="btn-secondary"
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Crater Outcome Notification Modal */}
      {craterOutcome && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(5, 8, 20, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-panel" style={{ maxWidth: '450px', width: '100%', padding: '24px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#00e5ff' }}>CRATER EXPEDITION RESULT</h4>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '20px' }}>
              {craterOutcome}
            </p>
            <button
              onClick={() => setCraterOutcome(null)}
              className="btn-primary"
              style={{ width: '100%', padding: '10px' }}
            >
              CONTINUE EXPEDITION
            </button>
          </div>
        </div>
      )}

      {/* Player Medevac / Retry Modal */}
      {isDead && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(20, 4, 8, 0.92)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div className="glass-panel-danger" style={{ maxWidth: '480px', width: '100%', padding: '30px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🚨</div>
            <h3 style={{ fontSize: '1.6rem', color: '#ff5252', marginBottom: '8px' }}>
              LIFE SUPPORT FAILURE!
            </h3>
            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '24px' }}>
              Astronaut vitals reached zero. Base automated emergency recovery drones deployed and transported cadet back to Lunar Base medical bay.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleRevive} className="btn-success" style={{ padding: '12px 24px', fontSize: '1rem' }}>
                🔄 REVIVE AT LUNAR BASE (RETRY)
              </button>
              <button onClick={onNavigateMenu} className="btn-secondary" style={{ padding: '12px 20px' }}>
                MAIN MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rocket Launch Overlay Animation */}
      {isLaunching && (
        <div className="launch-overlay">
          <div style={{ textAlign: 'center', zIndex: 10 }}>
            {launchCountdown !== null && launchCountdown > 0 ? (
              <div>
                <div style={{ fontSize: '1.2rem', color: '#ffd166', letterSpacing: '0.1em' }}>
                  TRANS-EARTH INSERTION IGNITION T-MINUS
                </div>
                <div style={{ fontSize: '6rem', fontWeight: 900, color: '#00e5ff', fontFamily: 'monospace' }}>
                  00:0{launchCountdown}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: '1.4rem', color: '#00e676', fontWeight: 800 }}>
                  🚀 MAIN ENGINES FULL THRUST — LEAVING LUNAR ORBIT!
                </div>
                <div style={{ fontSize: '0.95rem', color: '#94a3b8', marginTop: '6px' }}>
                  Trajectory verified. Accelerating toward Earth atmospheric interface...
                </div>
              </div>
            )}
          </div>

          {/* Rocket Ascending Graphic */}
          <div
            className={launchCountdown === 0 ? 'rocket-launching' : ''}
            style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <div style={{ fontSize: '72px' }}>🚀</div>
            {launchCountdown === 0 && (
              <div className="thruster-flame" style={{ fontSize: '42px', marginTop: '-15px' }}>
                🔥
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
