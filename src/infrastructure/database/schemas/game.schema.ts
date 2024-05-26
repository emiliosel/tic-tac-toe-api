import { Schema, Document, Connection } from 'mongoose';
import { GameStatus, Move, Player } from 'src/domain/game/entities/game.entity';
import { v4 as uuidv4 } from 'uuid';

export interface GameDocument extends Document {
  playerX: string;
  playerO: string;
  size: number;
  moves: Move[];
  status: GameStatus;
  winner: Player | null;
}

export const MoveSchema = new Schema<Move>({
  player: { type: String, enum: Object.values(Player), required: true },
  row: { type: Number, required: true },
  column: { type: Number, required: true },
});

export const GameSchema = new Schema<GameDocument>({
  _id: { type: String, default: () => uuidv4() },
  playerX: { type: String, required: true },
  playerO: { type: String, required: true },
  size: { type: Number, required: true },
  moves: { type: [MoveSchema], default: [] },
  status: {
    type: String,
    enum: Object.values(GameStatus),
    default: GameStatus.IN_PROGRESS,
  },
  winner: { type: String, enum: Object.values(Player), default: null },
});

export class GameMongoooseModelFactory {
  public static create(connection: Connection) {
    return connection.model('Game', GameSchema);
  }
}

export type TGameModel = ReturnType<typeof GameMongoooseModelFactory.create>;
