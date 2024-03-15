import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { filter, map, Observable, startWith, withLatestFrom } from 'rxjs';
import { SelectedGamesAction } from 'src/app/actions/game.actions';
import { Game } from 'src/app/models/game.model';
import {
  FullGameListState,
  SelectedGamesState,
} from 'src/app/state/games.state';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.sass'],
})
export class GamesListComponent {
  @Select(SelectedGamesState) currentlySelectedGames$!: Observable<Game[]>;
  @Select(FullGameListState) allGames$!: Observable<Game[]>;

  public filteredOptions$: Observable<Game[]>;

  public gameSelect = new FormControl<Game | string>('');
  public disableButton$ = this.gameSelect.valueChanges.pipe(
    startWith(null),
    map((game) => game != null && typeof game !== 'string')
  );

  constructor(private store: Store) {
    this.filteredOptions$ = this.gameSelect.valueChanges.pipe(
      filter((it): it is Game | string => it != null),
      startWith(''),
      withLatestFrom(this.allGames$),
      map(([value, allGames]: [Game | string, Game[]]) => {
        const name = typeof value === 'string' ? value : value.name;
        return name ? this._filter(allGames, name as string) : allGames;
      })
    );
  }

  public addGame() {
    const game = this.gameSelect.value;
    if (game == null || typeof game === 'string') {
      return;
    }
    this.store.dispatch(new SelectedGamesAction.Add(game));
  }

  public removeGame(game: Game) {
    this.store.dispatch(new SelectedGamesAction.Remove(game));
  }

  public displayFn(game: Game): string {
    return game && game.name ? game.name : '';
  }

  private _filter(games: Game[], name: string): Game[] {
    const filterValue = name.toLowerCase();

    return games.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
