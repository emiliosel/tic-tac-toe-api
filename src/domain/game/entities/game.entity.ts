export enum Player {
  X = 'X',
  O = 'O',
}

export enum GameStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export interface Move {
  player: Player;
  row: number;
  column: number;
}

export class Game {
  constructor(
    public readonly id: string,
    public readonly playerX: string,
    public readonly playerO: string,
    public readonly size: number,
    public readonly moves: Move[] = [],
    public status: GameStatus = GameStatus.IN_PROGRESS,
    public winner: Player | null = null,
  ) {}

  get board(): string[][] {
    const board = Array.from({ length: this.size }, () =>
      Array(this.size).fill(''),
    );
    for (const move of this.moves) {
      board[move.row][move.column] = move.player;
    }
    return board;
  }

  isMoveValid(row: number, column: number): boolean {
    return (
      row >= 0 &&
      column >= 0 &&
      row < this.size &&
      column < this.size &&
      !this.moves.find((move) => move.row === row && move.column === column)
    );
  }

  private canPlayerMakeMove(player: Player) {
    if (this.moves.length === 0) {
      return true;
    }

    const lastMove = this.moves[this.moves.length - 1];

    return lastMove.player !== player;
  }

  makeMove(row: number, column: number, player: Player): void {
    if (!this.canPlayerMakeMove(player)) {
      throw new Error(`It is not player's turn to make move.`);
    }
    if (this.status === GameStatus.FINISHED) {
      throw new Error('Game is finished. No more moves are allowed.');
    }
    if (!this.isMoveValid(row, column)) {
      throw new Error('Invalid move');
    }
    this.moves.push({ player, row, column });
    this.evaluateGameState();
  }

  private evaluateGameState(): void {
    const winner = this.checkWinner();

    if (winner) {
      this.status = GameStatus.FINISHED;
      this.winner = winner;
    } else if (this.size * this.size === this.moves.length) {
      this.status = GameStatus.FINISHED;
    }
  }

  private checkWinner(): Player | null {
    const size = this.size;
    const playerCounterStates = {
      [Player.X]: this.createPlayerCounterState(),
      [Player.O]: this.createPlayerCounterState(),
    };

    for (const move of this.moves) {
      const { row, column, player } = move;
      const state = playerCounterStates[player];

      state.row[row]++;
      state.col[column]++;
      if (row === column) state.diagonal++;
      if (row + column === size - 1) state.antiDiagonal++;

      if (
        state.row[row] === size ||
        state.col[column] === size ||
        state.diagonal === size ||
        state.antiDiagonal === size
      ) {
        return player;
      }
    }

    return null;
  }

  private createPlayerCounterState() {
    const initialState = {
      row: Array(this.size).fill(0),
      col: Array(this.size).fill(0),
      diagonal: 0,
      antiDiagonal: 0,
    };
    return initialState;
  }
}
