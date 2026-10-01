'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MainMenu from '../components/MainMenu';
import MissionsMenu from '../components/MissionsMenu';
import HowToPlay from '../components/HowToPlay';
import Level1Mission from '../components/level1/Level1Mission';
import MoonSurvivalMission from '../components/level2/MoonSurvivalMission';
import ReturnToEarthMission from '../components/level3/ReturnToEarthMission';
import MissionSummary from '../components/MissionSummary';
import { GameLevel } from '../types/game';
import { sounds } from '../utils/audio';

export default function GamePage() {
  const [currentLevel, setCurrentLevel] = useState<GameLevel>('MENU');
  const [unlockedLevels, setUnlockedLevels] = useState<number[]>([1]);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [playerName, setPlayerName] = useState<string>('Cadet Armstrong');
  const [score, setScore] = useState<number>(0);
  const [missionTime, setMissionTime] = useState<number>(0);

  // Restore saved progress from localStorage if available
  useEffect(() => {
    try {
      const savedUnlocked = localStorage.getItem('jamt_unlocked');
      const savedCompleted = localStorage.getItem('jamt_completed');
      const savedName = localStorage.getItem('jamt_player');
      const savedScore = localStorage.getItem('jamt_score');

      if (savedUnlocked) setUnlockedLevels(JSON.parse(savedUnlocked));
      if (savedCompleted) setCompletedLevels(JSON.parse(savedCompleted));
      if (savedName) setPlayerName(savedName);
      if (savedScore) setScore(parseInt(savedScore, 10) || 0);
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  // Save progress changes
  useEffect(() => {
    try {
      localStorage.setItem('jamt_unlocked', JSON.stringify(unlockedLevels));
      localStorage.setItem('jamt_completed', JSON.stringify(completedLevels));
      localStorage.setItem('jamt_player', playerName);
      localStorage.setItem('jamt_score', score.toString());
    } catch {
      // ignore
    }
  }, [unlockedLevels, completedLevels, playerName, score]);

  // Mission time tracking during gameplay
  useEffect(() => {
    const isPlaying = ['LEVEL_1', 'LEVEL_2', 'LEVEL_3'].includes(currentLevel);
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setMissionTime((t) => t + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLevel]);

  const handleAddScore = (points: number) => {
    setScore((s) => s + points);
  };

  const handleNavigate = (level: GameLevel) => {
    setCurrentLevel(level);
  };

  // Completion handlers for each level
  const handleLevel1Complete = () => {
    setCompletedLevels((prev) => (prev.includes(1) ? prev : [...prev, 1]));
    setUnlockedLevels((prev) => (prev.includes(2) ? prev : [...prev, 2]));
    // Advance to Level 2
    setCurrentLevel('LEVEL_2');
  };

  const handleLevel2Complete = () => {
    setCompletedLevels((prev) => (prev.includes(2) ? prev : [...prev, 2]));
    setUnlockedLevels((prev) => (prev.includes(3) ? prev : [...prev, 3]));
    // Advance to Level 3
    setCurrentLevel('LEVEL_3');
  };

  const handleLevel3Complete = () => {
    setCompletedLevels((prev) => (prev.includes(3) ? prev : [...prev, 3]));
    // Go to summary debrief / certificate
    setCurrentLevel('SUMMARY');
  };

  const handleResetProgress = () => {
    sounds.playClick();
    setUnlockedLevels([1]);
    setCompletedLevels([]);
    setScore(0);
    setMissionTime(0);
    try {
      localStorage.removeItem('jamt_unlocked');
      localStorage.removeItem('jamt_completed');
      localStorage.removeItem('jamt_score');
    } catch {
      // ignore
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header & Telemetry */}
      <Header
        currentLevel={currentLevel}
        onNavigate={handleNavigate}
        missionTime={missionTime}
        score={score}
      />

      {/* Main View Router */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentLevel === 'MENU' && (
          <MainMenu
            unlockedLevels={unlockedLevels}
            completedLevels={completedLevels}
            playerName={playerName}
            setPlayerName={setPlayerName}
            onNavigate={handleNavigate}
            onResetProgress={handleResetProgress}
          />
        )}

        {currentLevel === 'MISSIONS' && (
          <MissionsMenu
            unlockedLevels={unlockedLevels}
            completedLevels={completedLevels}
            onNavigate={handleNavigate}
          />
        )}

        {currentLevel === 'HOW_TO_PLAY' && (
          <HowToPlay onNavigate={handleNavigate} />
        )}

        {currentLevel === 'LEVEL_1' && (
          <Level1Mission
            onLevelComplete={handleLevel1Complete}
            onAddScore={handleAddScore}
            onNavigateMenu={() => setCurrentLevel('MENU')}
          />
        )}

        {currentLevel === 'LEVEL_2' && (
          <MoonSurvivalMission
            onLevelComplete={handleLevel2Complete}
            onAddScore={handleAddScore}
            onNavigateMenu={() => setCurrentLevel('MENU')}
          />
        )}

        {currentLevel === 'LEVEL_3' && (
          <ReturnToEarthMission
            onLevelComplete={handleLevel3Complete}
            onAddScore={handleAddScore}
            onNavigateMenu={() => setCurrentLevel('MENU')}
            playerName={playerName}
          />
        )}

        {currentLevel === 'SUMMARY' && (
          <MissionSummary
            score={score}
            missionTime={missionTime}
            playerName={playerName}
            onNavigate={handleNavigate}
            onRestart={() => {
              setCurrentLevel('MENU');
            }}
          />
        )}
      </div>
    </main>
  );
}
