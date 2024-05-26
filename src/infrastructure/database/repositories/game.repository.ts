import { Game } from '../../../domain/game/entities/game.entity';
import { GameDocument, TGameModel } from '../schemas/game.schema';
import {
  FindGamesFilter,
  GameRepository,
} from '../../../domain/game/repositories/game.repository';
import { Inject, Injectable } from '@nestjs/common';
import { PROVIDERS } from '../../../constants';

@Injectable()
export class MongooseGameRepository implements GameRepository {
  constructor(
    @Inject(PROVIDERS.GAME_MODEL) private readonly gameModel: TGameModel,
  ) {}

  async save(game: Game): Promise<void> {
    const existingGame = await this.gameModel.findById(game.id).exec();

    if (existingGame) {
      existingGame.playerX = game.playerX;
      existingGame.playerO = game.playerO;
      existingGame.size = game.size;
      existingGame.moves = game.moves;
      existingGame.status = game.status;
      existingGame.winner = game.winner;
      await existingGame.save();
    } else {
      await this.gameModel.create({ ...game, _id: game.id });
    }
  }

  async findById(id: string): Promise<Game | null> {
    const gameDoc = await this.gameModel.findById(id).exec();

    if (!gameDoc) {
      return null;
    }

    return this.mapDocumentToEntity(gameDoc);
  }

  async findGames(filter?: FindGamesFilter): Promise<Game[]> {
    const query: any = {};

    if (filter?.where?.status) {
      query.status = filter.where.status;
    }

    const gameDocs = await this.gameModel.find(query).exec();

    return gameDocs.map((doc) => this.mapDocumentToEntity(doc));
  }

  private mapDocumentToEntity(doc: GameDocument): Game {
    return new Game(
      doc._id.toString(),
      doc.playerX,
      doc.playerO,
      doc.size,
      doc.moves,
      doc.status,
      doc.winner,
    );
  }
}
