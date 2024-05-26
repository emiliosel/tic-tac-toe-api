import { Game, GameStatus } from '../entities/game.entity';

export interface FindGamesFilter {
  where?: {
    status?: GameStatus;
  };
}
export interface GameRepository {
  save(game: Game): Promise<void>;
  findById(id: string): Promise<Game | null>;
  findGames(filter?: FindGamesFilter): Promise<Game[]>;
}
