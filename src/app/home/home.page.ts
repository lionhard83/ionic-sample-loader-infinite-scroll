import { Component, OnInit, ViewChild } from '@angular/core';
import { Feed, FeedService, User } from '../services/feeds.service';
import { Storage } from '@ionic/storage';
import { IonInfiniteScroll } from '@ionic/angular';
interface RefresherEventDetail {
  complete(): void;
}
interface RefresherCustomEvent extends CustomEvent {
  detail: RefresherEventDetail;
  target: HTMLIonRefresherElement;
}
interface InfiniteScrollCustomEvent extends CustomEvent {
  target: HTMLIonInfiniteScrollElement;
}
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  skip = 0;
  limit = 10;
  feeds: Feed[] = [];
  myId: string;
  constructor(private feedsService: FeedService,  private storage: Storage) {}

  async ngOnInit() {
    this.myId = await this.storage.get('id');
    console.log('this.myId:', this.myId);
    this.feeds = await this.feedsService.feeds({skip: this.skip, limit: this.limit});
  }

  async doRefresh(ev: RefresherCustomEvent) {
    this.skip = 0;
    this.feeds = await this.feedsService.feeds({skip: this.skip, limit: this.limit});
    ev.target.complete();
  }

  hasLike(likes: User[]) {
    return likes.some(item => item.id === this.myId);
  }

  async like(feedId: string) {
    const response = await this.feedsService.like(feedId);
    console.log('response:', response);
  }
  async unlike(feedId: string) {
    const response = await this.feedsService.unlike(feedId);
    console.log('response:', response);
  }

  async loadData(event: InfiniteScrollCustomEvent) {
    this.skip = this.skip + 10;
    const count = this.feeds.length;
    this.feeds = [...this.feeds, ...await this.feedsService.feeds({skip: this.skip, limit: this.limit})];
    const countAfterCall = this.feeds.length;
    event.target.complete();
  }
  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
}
