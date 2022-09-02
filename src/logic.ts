import { Commands, IGameState, IPlayer } from './models';

const coinCount = 100;

export function getInitialState(): IGameState {
  return {
    players: [],
    coins: [],
    fieldSize: {
      width: 100,
      height: 100,
    },
    eliminatedPlayers: {},
  };
}

export function gameLogic(state: IGameState, commands: Commands): IGameState {
  evaluateCommands(state, commands);
  zoomPlayers(state);
  resolveCoinCollisions(state);
  resolvePlayerCollisions(state);
  addMoreCoins(state);
  return state;
}

function evaluateCommands(state: IGameState, commands: Commands) {
  Object.keys(commands).forEach((playerId) => {
    const player = state.players.find((p) => p.id === playerId);
    if (!player) {
      return;
    }
    const command = commands[playerId];
    if (command === 'up') {
      if (player.uVel< 3) {
        // SPEED LIMIT IS 3
        player.uVel++;
      } 
    } else if (command === 'down') {
        if (player.dVel < 3) {
          // SPEED LIMIT IS 3
          player.dVel++;
        }
    } else if (command === 'left') {
        if (player.lVel < 3) {
          // SPEED LIMIT IS 3
          player.lVel++;
        }
    } else if (command === 'right') {
        console.log("lmao you went right what an absolute scrub");
        if (player.rVel < 3) {
          // SPEED LIMIT IS 3
          player.rVel++;
        }
    } else if (command === 'qq') {
        const newX = player.x + 10;
        if (newX > state.fieldSize.width) {
          player.x = state.fieldSize.width;
        } else {
          player.x = newX;
        }
        console.log("qq");
    } else if (command === 'upUp') {
        // Reset uVel
        player.uVel = 0;
        console.log("UPUP HAS SUCCEEDED TO THE HEAVENS WE GO");
    } else if (command === 'downUp') {
        // Reset dVel
        player.dVel = 0;
        console.log("DOWNUP HAS SUCCEED TO THE HEAVENS WE GO (AGAIN)");
    } else if (command === 'rightUp') {
        // Reset rVel
        player.rVel = 0;
    } else if (command === 'leftUp') {
        // Reset lVel
        player.lVel = 0;
    }
  });
}

function zoomPlayers(state: IGameState) {
  const playersList = state.players;
  playersList.forEach(player => {
    if (player.uVel > 0) {
      // Idk why this is inverted (canvass shennanigans)
      const newY = player.y - player.uVel;
      if (newY < 0) {
        // lmao bounce them back
        console.log('git bounced Alexandre');
        player.dVel = player.uVel;
        player.uVel = 0;
      } else {
        player.y = newY;
      }
    }
    if (player.dVel > 0) {
      // Idk why this is inverted (canvass shennanigans)
      const newY = player.y + player.dVel;

      if (newY > state.fieldSize.height) {
        // lmao bounce them back
        player.uVel = player.dVel;
        player.dVel = 0;
      } else {
        player.y = newY;
      }

    }
    if (player.rVel > 0) {
      const newX = player.x + player.rVel;

      if (newX > state.fieldSize.width) {
        // lmao bounce them back
        player.lVel = player.rVel;
        player.rVel = 0;
      } else {
        player.x = newX;
      }

    }
    if (player.lVel > 0) {
      const newX = player.x - player.lVel;

      if (newX < 0) {
        // lmao bounce them back
        player.rVel = player.lVel;
        player.lVel = 0;
      } else {
        player.x = newX;
      }

      player.x = newX;
    }
  })
}


function resolveCoinCollisions(state: IGameState) {
  state.coins.slice().forEach((coin) => {
    const player = state.players.find((p) => p.x === coin.x && p.y === coin.y);
    if (player) {
      player.score++;
      state.coins = state.coins.filter((c) => c !== coin);
    }
  });
}

function resolvePlayerCollisions(state: IGameState) {
  state.players.slice().forEach((player) => {
    if (!state.players.includes(player)) {
      return;
    }
    const otherPlayer = state.players.find(
      (p) => p !== player && p.x === player.x && p.y === player.y
    );
    if (otherPlayer) {
      const pool = 2;
      const roll = Math.floor(Math.random() * pool);
      let winner: IPlayer;
      let loser: IPlayer;
      if (roll === 1) {
        winner = player;
        loser = otherPlayer;
      } else {
        winner = otherPlayer;
        loser = player;
      }
      winner.score += loser.score;
      state.players = state.players.filter((p) => p !== loser);
      state.eliminatedPlayers[loser.id] = winner.id;
    }
  });
}

function addMoreCoins(state: IGameState) {
  while (state.coins.length < coinCount) {
    const location = getUnoccupiedLocation(state);
    const isDeadly = Math.floor(Math.random() * 2) === 1;
    state.coins.push({ ...location, isDeadly });
  }
}

export function getUnoccupiedLocation(state: IGameState): {
  x: number;
  y: number;
} {
  let location = null;
  while (!location) {
    const x = Math.floor(Math.random() * state.fieldSize.width);
    const y = Math.floor(Math.random() * state.fieldSize.height);
    if (state.players.find((p) => p.x === x && p.y === y)) {
      continue;
    }
    if (state.coins.find((c) => c.x === x && c.y === y)) {
      continue;
    }
    location = { x, y };
  }
  return location;
}
