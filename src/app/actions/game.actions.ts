import { Game } from '../models/game.model';

export namespace SelectedGamesAction {
  export class Add {
    static readonly type = '[SelectedGames] Add Game';
    constructor(public game: Game) {}
  }

  export class Remove {
    static readonly type = '[SelectedGames] Remove Game';
    constructor(public game: Game) {}
  }
}

export namespace GameListAction {
  // Note that in NGRX we had 2 actions: load and set. Here we only have one
  export class Load {
    static readonly type = '[GameList] Load Games';
  }
}

export namespace SimilaritiesAction {
  export class Load {
    static readonly type = '[Similarities] Load Similarities';
  }
}
