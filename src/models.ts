export interface IGameState {
  players: IPlayer[];
  coins: ICoin[];
  fieldSize: {
    width: number;
    height: number;
  };
  eliminatedPlayers: Record<string, string>;
}

export interface IPlayer {
  id: string;
  name: string;
  score: number;
  x: number;
  y: number;
  lVel: number;
  rVel: number;
  uVel: number;
  dVel: number;
  rVelCounter: number;
  lVelCounter: number;
  uVelCounter: number;
  dVelCounter: number;
}

export interface ICoin {
  x: number;
  y: number;
  isDeadly?: boolean;
}

export type Command = 'left' | 'right' | 'up' | 'down' | 'qq' | 'upUp' | 'downUp' | 'rightUp' | 'leftUp';
export type Commands = Record<string, Command>;
