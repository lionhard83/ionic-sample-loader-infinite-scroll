import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from './feeds.service';
import { Storage } from '@ionic/storage';

export type Login = {
  password: string;
  email: string;
};

export type Signin = Login & {
  name: string;
  surname: string;
  os: string;
};


export type Token = {
  accessToken: string;
  refreshToken: string;
  expiredIn: number;
  grantType: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  headers;
  constructor(private httpClient: HttpClient, private storage: Storage) {
    this.storage.create();
    this.storage.get('accessToken').then(value => {
      console.log('accessToken:', value);
      this.headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('authorization', `Bearer ${value}`);
    });
  }

  signin(obj: Signin) {
    return this.httpClient.post(`${environment.host}/signin`, obj).toPromise();
  }


  login(obj: Login): Promise<Token> {
    return this.httpClient.post(`${environment.host}/login`, obj).toPromise() as Promise<Token>;
  }

  me(): Promise<User> {
    return this.httpClient.get(`${environment.host}/me`, {headers: this.headers}).toPromise() as Promise<User>;
  }

}
