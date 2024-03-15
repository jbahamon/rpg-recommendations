import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Game } from '../models/game.model';
import { games } from './games.data';

@Injectable({
  providedIn: 'root',
})
export class GameListService {
  public getGameList(): Observable<Game[]> {
    return of(
      games.map((game) => ({
        ...game,
        tropes: new Set<string>(game.tropes),
      }))
    );
  }
}
