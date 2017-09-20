import { Component } from '@angular/core';
import { NavController, ModalController, PopoverController, AlertController } from 'ionic-angular';

import { AddSqueelPage } from '../add-squeel/add-squeel';
import { GameSqueelsPage } from '../game-squeels/game-squeels';
import { SqueelpopoverPage } from '../squeelpopover/squeelpopover';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  games = <any>[];

  squeelsLoaded: any;

  squeels = <any>[];
  squeelsData = <any>[];
  squeelsDataSliced = <any>[];
  squeelsTop = <any>[];
  squeelsTopSliced = <any>[];
  userId: any;
  team1Trophies: any = 0;
  team2Trophies: any = 0;
  oponent1Color: any;
  oponent2Color: any;

  filter: any = "latest";

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo,public alertCtrl: AlertController, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.squeelsLoaded = 10;
  }

  getSqueels() {
    return this.apollo.watchQuery({
      query: gql`
      query {
        allGames(orderBy: date_ASC, filter:{active: true}) {
          oponent1
          oponent1color
          oponent1Score
          oponent2
          oponent2color
          oponent2Score
          date
          squeels(orderBy: createdAt_DESC) {
            id
            description
            createdAt
            team
            anonymous
            upvotes {
              id
            }
            user {
              id
              profileUrl
              username
            }
          }
        }
        user {
          id
        }
      }
      `
    })
  }

  ionViewDidLoad() {
    this.getSqueels().subscribe(({data}) => {
      this.games = data;
      this.userId = this.games.user.id;
      this.games = this.games.allGames;
      this.oponent1Color = this.games[0].oponent1color;
      this.oponent2Color = this.games[0].oponent2color;
      this.squeelsData = [];
      this.squeelsTop = [];
      this.team1Trophies = 0;
      this.team2Trophies = 0;
      for(let squeel of this.games[0].squeels) {
        let voted = false;
        for(let voters of squeel.upvotes) {
          if (voters.id == this.userId) {
            voted = true;
          }
        }
        let temp = {squeel: squeel, voted: voted, length: squeel.upvotes.length};
        squeel.team == 1 ? this.team1Trophies+=temp.length : this.team2Trophies+=temp.length;
        this.squeelsData.push(temp);
        this.squeelsTop.push(temp);
      }
      this.squeelsTop.sort(this.compare);
      this.squeelsDataSliced = this.squeelsData.slice(0, 10);
      this.squeelsTopSliced = this.squeelsTop.slice(0,3);
    });
  }

  doRefresh(refresher) {
    this.refresh(refresher);
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
  }

  refresh(refresher) {
    this.getSqueels().refetch(({data})=> {
      this.games = data;
      this.userId = this.games.user.id;
      this.games = this.games.allGames;
      this.squeelsData = [];
      this.squeelsTop = [];
      this.team1Trophies = 0;
      this.team2Trophies = 0;
      for(let squeel of this.games[0].squeels) {
        let voted = false;
        for(let voters of squeel.upvotes) {
          if (voters.id == this.userId) {
            voted = true;
          }
        }
        let temp = {squeel: squeel, voted: voted, length: squeel.upvotes.length};
        squeel.team == 1 ? this.team1Trophies+=temp.length : this.team2Trophies+=temp.length;
        this.squeelsData.push(temp);
        this.squeelsTop.push(temp);
      }
      this.squeelsTop.sort(this.compare);
      this.squeelsDataSliced = this.squeelsData.slice(0, 10);
      this.squeelsTopSliced = this.squeelsTop.slice(0,3);
    })
  }

  createSqueel() {
    let modal = this.modalCtrl.create(AddSqueelPage);
    modal.present();
    modal.onDidDismiss(squeel => {
      console.log(squeel);
      let temp = {squeel: squeel.createSqueel, voted: false, length: 0};
      this.squeelsDataSliced.unshift(temp);
    });
  }

  upvote(squeel) {
    squeel.voted = true;
    squeel.length++;
    this.apollo.mutate({
      mutation: gql`
      mutation addToSqueelOnUpvote($upvotesUserId: ID!, $likesSqueelId: ID!) {
        addToSqueelOnUpvote(upvotesUserId: $upvotesUserId, likesSqueelId: $likesSqueelId) {
          upvotesUser {
            id
          }
        }
      }
      `,variables: {
        upvotesUserId: this.userId,
        likesSqueelId: squeel.squeel.id
      }
    }).toPromise().then(({data}) => {
    });
  }

  downvote(squeel) {
    squeel.voted = false;
    squeel.length--;
    this.apollo.mutate({
      mutation: gql`
      mutation removeFromSqueelOnUpvote($upvotesUserId: ID!, $likesSqueelId: ID!) {
        removeFromSqueelOnUpvote(upvotesUserId: $upvotesUserId, likesSqueelId: $likesSqueelId) {
          upvotesUser {
            id
          }
        }
      }
      `,variables: {
        upvotesUserId: this.userId,
        likesSqueelId: squeel.squeel.id
      }
    }).toPromise().then(({data}) => {
      //Nothing
    });
  }

  doInfinite(infiniteScroll) {
    for (let i = this.squeelsLoaded; i < this.squeelsLoaded + 10; i++) {
      if (this.squeelsData[i]) {
        console.log(this.squeelsData[i]);
        this.squeelsDataSliced.push(this.squeelsData[i]);
      }
      // else {
      //   this.squeelsLoaded+=10;
      //   infiniteScroll.complete();
      //   return;
      // }
    }
    this.squeelsLoaded+=10;
    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }
  doInfinite2(infiniteScroll) {
    for (let i = this.squeelsLoaded; i < this.squeelsLoaded + 10; i++) {
      if (this.squeelsData[i]) {
        console.log(this.squeelsData[i]);
        this.squeelsTopSliced.push(this.squeelsData[i]);
      }
    }
    this.squeelsLoaded+=10;
    setTimeout(() => {
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
  }

  compare(a,b) {
    if (a.length > b.length)
      return -1;
    if (a.length < b.length)
      return 1;
    return 0;
  }

  gotoGame(game) {
    this.navCtrl.push(GameSqueelsPage, {game: game});
  }
  openPopOver(squeel) {
    let popover = this.popoverCtrl.create(SqueelpopoverPage, {squeel: squeel}, { cssClass: 'custom-popover'});
    popover.present({

    });
  }

  report() {
    let alert = this.alertCtrl.create({
      title: 'Report Submitted!',
      subTitle: 'Our team will keep an eye on that squeel!',
      buttons: ['OK']
    });
    alert.present();
  }
}
