import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SimilaritiesService {
  private _jsonURL = 'assets/similarities.json';
  constructor(private http: HttpClient) {}

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL).pipe(map((it: any) => it.sims));
  }

  public getSimilarities(): Observable<number[][]> {
    return this.getJSON();
  }
}
