import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

export type User = {
  nickname: string;
  id: string;
  password?: string;
};


export type Comment = {
  message: string;
  user: User;
  date: Date;
};

export type Feed = {
  id: string;
  creator: User;
  message: string;
  imageUrl: string;
  likes: User[];
  date: Date;
  comments: Comment[];
};


@Injectable({
  providedIn: 'root'
})
export class FeedService {
  headers;
  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.storage.create();
    this.storage.get('authorization').then(value => {
      this.headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', value);
    });
  }

  feeds({skip, limit}) {
    return this.httpClient.get<Feed[]>(`${environment.host}/feeds?skip=${skip}&limit=${limit}`).toPromise();
  }
  like(id: string) {
    return this.httpClient.post<Feed>(`${environment.host}/feeds/${id}/likes`, {like: true}, {headers: this.headers}).toPromise();
  }
  unlike(id: string) {
    return this.httpClient.post<Feed>(`${environment.host}/feeds/${id}/likes`, {like: false}, {headers: this.headers}).toPromise();
  }
  comment(id: string, {message, imageUrl}) {
    return this.httpClient.post<Feed>(`${environment.host}/feeds/${id}/likes`, {message, imageUrl}, {headers: this.headers}).toPromise();
  }


  // login(obj: Login): Promise<Token> {
  //   return this.httpClient.post(`${environment.host}/login`, obj, {headers: this.headers}).toPromise() as Promise<Token>;
  // }

}
