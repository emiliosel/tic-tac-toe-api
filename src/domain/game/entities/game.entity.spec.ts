import { Game, Player, GameStatus } from './game.entity';

describe('Game', () => {
  let game: Game;

  beforeEach(() => {
    game = new Game('1', 'playerX', 'playerO', 3);
  });

  test('should initialize game correctly', () => {
    expect(game.id).toBe('1');
    expect(game.playerX).toBe('playerX');
    expect(game.playerO).toBe('playerO');
    expect(game.size).toBe(3);
    expect(game.moves).toEqual([]);
    expect(game.status).toBe(GameStatus.IN_PROGRESS);
    expect(game.winner).toBeNull();
  });

  test('should validate moves correctly', () => {
    expect(game.isMoveValid(0, 0)).toBe(true);
    game.makeMove(0, 0, Player.X);
    expect(game.isMoveValid(0, 0)).toBe(false);
    expect(game.isMoveValid(3, 3)).toBe(false);
    expect(game.isMoveValid(-1, -1)).toBe(false);
  });

  test('should make valid moves and update board', () => {
    game.makeMove(0, 0, Player.X);
    expect(game.moves).toEqual([{ player: Player.X, row: 0, column: 0 }]);
    expect(game.board[0][0]).toBe(Player.X);
    game.makeMove(1, 1, Player.O);
    expect(game.moves).toEqual([
      { player: Player.X, row: 0, column: 0 },
      { player: Player.O, row: 1, column: 1 },
    ]);
    expect(game.board[1][1]).toBe(Player.O);
  });

  test('should detect a winning move in a row', () => {
    game.makeMove(0, 0, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(0, 1, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(0, 2, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in a row 5*5', () => {
    const game = new Game('1', 'playerX', 'playerO', 5);
    game.makeMove(0, 0, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(0, 1, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(0, 2, Player.X);
    game.makeMove(1, 3, Player.O);
    game.makeMove(0, 3, Player.X);
    game.makeMove(1, 4, Player.O);
    game.makeMove(0, 4, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in a column', () => {
    game.makeMove(0, 0, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 0, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(2, 0, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in a column 5*5', () => {
    const game = new Game('1', 'playerX', 'playerO', 5);
    game.makeMove(0, 0, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 0, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(2, 0, Player.X);
    game.makeMove(2, 1, Player.O);
    game.makeMove(3, 0, Player.X);
    game.makeMove(3, 1, Player.O);
    game.makeMove(4, 0, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in a diagonal', () => {
    game.makeMove(0, 0, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 1, Player.X);
    game.makeMove(1, 0, Player.O);
    game.makeMove(2, 2, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in a diagonal 5*5', () => {
    const game = new Game('1', 'playerX', 'playerO', 5);
    game.makeMove(0, 0, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 1, Player.X);
    game.makeMove(1, 0, Player.O);
    game.makeMove(2, 2, Player.X);
    game.makeMove(1, 3, Player.O);
    game.makeMove(3, 3, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(4, 4, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in an anti-diagonal', () => {
    game.makeMove(0, 2, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 1, Player.X);
    game.makeMove(1, 0, Player.O);
    game.makeMove(2, 0, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a winning move in an anti-diagonal 5*5', () => {
    const game = new Game('1', 'playerX', 'playerO', 5);
    game.makeMove(0, 4, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(1, 3, Player.X);
    game.makeMove(1, 0, Player.O);
    game.makeMove(2, 2, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(3, 1, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(4, 0, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBe(Player.X);
  });

  test('should detect a draw', () => {
    game.makeMove(0, 0, Player.X);
    game.makeMove(0, 1, Player.O);
    game.makeMove(0, 2, Player.X);
    game.makeMove(1, 1, Player.O);
    game.makeMove(1, 0, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(2, 1, Player.X);
    game.makeMove(2, 0, Player.O);
    game.makeMove(2, 2, Player.X);
    expect(game.status).toBe(GameStatus.FINISHED);
    expect(game.winner).toBeNull();
  });

  test('should throw error for invalid move when game is finished', () => {
    game.makeMove(0, 0, Player.X);
    game.makeMove(1, 2, Player.O);
    game.makeMove(0, 1, Player.X);
    game.makeMove(1, 0, Player.O);
    game.makeMove(0, 2, Player.X); // X wins

    expect(() => game.makeMove(1, 1, Player.O)).toThrow(
      'Game is finished. No more moves are allowed.',
    );
  });

  test('should throw error for invalid move to an occupied cell', () => {
    game.makeMove(0, 0, Player.X);
    expect(() => game.makeMove(0, 0, Player.O)).toThrow('Invalid move');
  });

  test('should throw error for invalid move out of bounds', () => {
    expect(() => game.makeMove(3, 3, Player.X)).toThrow('Invalid move');
  });

  test("should throw error for invalid move not player's turn", () => {
    game.makeMove(0, 0, Player.X);
    expect(() => game.makeMove(3, 3, Player.X)).toThrow(
      "It is not player's turn to make move.",
    );
  });
});
