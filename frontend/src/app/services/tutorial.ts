import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Tutorial } from '../models/tutorial.model';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:8080/api/tutorials';


  getAll(): Observable<Tutorial[]> {
    return this.http.get<Tutorial[]>(this.baseUrl);
  }


  get(id: number): Observable<Tutorial> {
    return this.http.get<Tutorial>(
      `${this.baseUrl}/${id}`
    );
  }


  create(tutorial: Tutorial): Observable<Tutorial> {
    return this.http.post<Tutorial>(
      this.baseUrl,
      tutorial
    );
  }


  update(
    id: number,
    tutorial: Tutorial
  ): Observable<Tutorial> {

    return this.http.put<Tutorial>(
      `${this.baseUrl}/${id}`,
      tutorial
    );
  }


  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }


  deleteAll(): Observable<void> {
    return this.http.delete<void>(
      this.baseUrl
    );
  }


  findByTitle(title: string): Observable<Tutorial[]> {

    const params = new HttpParams()
      .set('title', title);

    return this.http.get<Tutorial[]>(
      this.baseUrl,
      { params }
    );
  }
}