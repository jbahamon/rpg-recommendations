import { Injectable } from '@angular/core';
import {
  Action,
  NgxsAfterBootstrap,
  NgxsOnInit,
  Selector,
  State,
  StateContext,
} from '@ngxs/store';
import {
  SelectedGamesAction as SelectedGamesAction,
  GameListAction,
  SimilaritiesAction,
} from '../actions/game.actions';
import { Game } from '../models/game.model';
import { patch, removeItem, insertItem } from '@ngxs/store/operators';
import { GameListService } from '../services/game-list.service';
import { tap } from 'rxjs';
import { SimilaritiesService } from '../services/similarities.service';

@State<Game[]>({
  name: 'selectedGames', // This will create the property selectedGames in the state
  defaults: [], // The default value
})
@Injectable()
export class SelectedGamesState {
  @Selector() // A memoized selector
  static tropes(state: Game[]): Set<string> {
    return new Set(state.map((game) => Array.from(game.tropes)).flat());
  }

  @Action(SelectedGamesAction.Add) // States listen to actions directly; there's no concept of reducer
  public addGame(ctx: StateContext<Game[]>, action: SelectedGamesAction.Add) {
    ctx.setState(insertItem<Game>(action.game));
  }

  @Action(SelectedGamesAction.Remove)
  public removeGame(
    ctx: StateContext<Game[]>,
    action: SelectedGamesAction.Remove
  ) {
    // NGXS has operators to make this operation easier
    ctx.setState(removeItem<Game>((game) => game?.name === action.game.name));
  }
}

export interface GameListStateModel {
  games: Game[];
}

@State<Game[]>({
  name: 'fullGameList', // This will create the property selectedGames in the state
  defaults: [], // The default value
})
@Injectable()
export class FullGameListState implements NgxsOnInit {
  // State classes can participate in dependency injection automatically
  constructor(private gamesService: GameListService) {}

  public ngxsOnInit(ctx: StateContext<any>): void {
    ctx.dispatch(new GameListAction.Load());
  }

  @Selector()
  static tropes(state: GameListStateModel): Set<string> {
    return new Set(state.games.map((game) => Array.from(game.tropes)).flat());
  }

  @Action(GameListAction.Load)
  public loadGames(ctx: StateContext<Game[]>, action: GameListAction.Load) {
    // NGXS allows action handlers (the equivalent of NGRX's reducers) to be impure.
    // This reduces some boilerplate, but it's a tradeoff for some potential memoizations/caching

    return this.gamesService
      .getGameList()
      .pipe(tap((games) => ctx.setState(games)));
  }
}

@State<number[][]>({
  name: 'similarities',
  defaults: [],
})
@Injectable()
export class SimilaritiesState implements NgxsOnInit {
  constructor(private similaritiesService: SimilaritiesService) {}
  public ngxsOnInit(ctx: StateContext<number[][]>): void {
    ctx.dispatch(new SimilaritiesAction.Load());
  }

  @Action(GameListAction.Load)
  public loadSimilarities(
    ctx: StateContext<number[][]>,
    action: SimilaritiesAction.Load
  ) {
    return this.similaritiesService
      .getSimilarities()
      .pipe(tap((similarities) => ctx.setState(similarities)));
  }
}
