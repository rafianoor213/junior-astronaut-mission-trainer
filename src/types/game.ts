export type GameLevel = 'MENU' | 'MISSIONS' | 'HOW_TO_PLAY' | 'LEVEL_1' | 'LEVEL_2' | 'LEVEL_3' | 'SUMMARY';

export interface GameStats {
  score: number;
  missionTimeSeconds: number;
  waterCollected: number;
  mineralsCollected: number;
  emergenciesFixed: number;
  astronautHealth: number;
  spacecraftCondition: number;
  playerName: string;
}

export type EmergencyType = 'oxygen' | 'solar' | 'power' | 'rover' | 'greenhouse' | 'comm';

export interface EmergencyEvent {
  id: string;
  type: EmergencyType;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timerSeconds: number;
  repairActionName: string;
  mitigationTip: string;
}

export interface RocketRequirement {
  id: string;
  name: string;
  icon: string;
  required: number;
  current: number;
  unit: string;
  description: string;
  ready: boolean;
}

export interface NASAImageItem {
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
  nasaId?: string;
}
