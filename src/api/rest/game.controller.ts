import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CreateGameUseCase } from '../../application/use-cases/create-game.usecase';
import { MakeMoveUseCase } from '../../application/use-cases/make-move.usecase';
import { CreateGameInputDto } from '../../application/dtos/create-game.input.dto';
import { CreateGameOutputDto } from '../../application/dtos/create-game.output.dto';
import { MakeMoveInputDto } from '../../application/dtos/make-move.input.dto';
import { MakeMoveOutputDto } from '../../application/dtos/make-move.output.dto';
import { PROVIDERS } from '../../constants';
import { GetFinishedGamesUseCase } from '../../application/use-cases/get-finished-games.usecase';
import { GetFinishedGamesInputDto } from '../../application/dtos/get-finished-games.input.dto';
import { GetFinishedGamesOutputDto } from '../../application/dtos/get-finished-games.output.dto';

@ApiTags('games')
@Controller('games')
export class GameRestController {
  constructor(
    @Inject(PROVIDERS.GAME_CREATE_USECASE)
    private readonly createGameUseCase: CreateGameUseCase,

    @Inject(PROVIDERS.GAME_MAKEMOVE_USECASE)
    private readonly makeMoveUseCase: MakeMoveUseCase,

    @Inject(PROVIDERS.GAME_GET_FINISHED_USECASE)
    private readonly getFinishedGamesUseCase: GetFinishedGamesUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create game' })
  @ApiResponse({
    status: 201,
    description: 'Game created successfully.',
    type: CreateGameOutputDto,
  })
  async createGame(
    @Body() createGameDto: CreateGameInputDto,
  ): Promise<CreateGameOutputDto> {
    return await this.createGameUseCase.execute(createGameDto);
  }

  @Put('/move')
  @ApiOperation({ summary: 'Player make move on game' })
  @ApiResponse({
    status: 200,
    description: 'Move made successfully.',
    type: MakeMoveOutputDto,
  })
  async makeMove(
    @Body() makeMoveDto: MakeMoveInputDto,
  ): Promise<MakeMoveOutputDto> {
    return await this.makeMoveUseCase.execute(makeMoveDto);
  }

  @Get('/')
  @ApiOperation({ summary: 'Get games' })
  @ApiOkResponse({ type: [GetFinishedGamesOutputDto] })
  async getFinishedGames(
    @Query() filterOptions?: GetFinishedGamesInputDto,
  ): Promise<GetFinishedGamesOutputDto[]> {
    return this.getFinishedGamesUseCase.execute(filterOptions);
  }
}
