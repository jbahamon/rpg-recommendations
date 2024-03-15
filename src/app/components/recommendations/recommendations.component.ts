import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import {
  BehaviorSubject,
  combineLatestWith,
  map,
  Observable,
  Subject,
  Subscription,
  withLatestFrom,
} from 'rxjs';
import { Game } from 'src/app/models/game.model';
import {
  FullGameListState,
  SelectedGamesState,
  SimilaritiesState,
} from 'src/app/state/games.state';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.sass'],
})
export class RecommendationsComponent implements OnInit, OnDestroy {
  @Select(SimilaritiesState) similarities$!: Observable<number[][]>;
  @Select(SelectedGamesState) currentlySelectedGames$!: Observable<Game[]>;
  @Select(FullGameListState) allGames$!: Observable<Game[]>;

  private subscriptions = new Subscription();
  private recommendationsSubject$ = new BehaviorSubject<
    { score: number; name: string }[]
  >([]);

  public recommendations$ = this.recommendationsSubject$.asObservable();
  constructor() {}

  ngOnInit(): void {
    const sub = this.allGames$
      .pipe(
        combineLatestWith(this.currentlySelectedGames$),
        withLatestFrom(this.similarities$),
        map(([[allGames, currentlySelectedGames], similarities]) => {
          const names = new Map<number, string>();

          const gamesToSkip = new Set(
            currentlySelectedGames.map((it) => it.id)
          );
          const scores = new Map<number, number>();

          allGames.forEach((game) => {
            names.set(game.id, game.name);
            if (gamesToSkip.has(game.id)) {
              return;
            } else {
              currentlySelectedGames.forEach((game2) => {
                scores.set(
                  game.id,
                  (scores.get(game.id) || 0) + similarities[game.id][game2.id]
                );
              });
            }
          });

          const result: { score: number; name: string }[] = Array.from(
            [...scores.entries()]
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10)
              .map(([id, score]) => ({
                score,
                name: names.get(id) || 'noname',
              }))
          );

          console.log(result);

          return result;
        })
      )
      .subscribe(this.recommendationsSubject$);

    this.subscriptions.add(sub);
  }

  public ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
