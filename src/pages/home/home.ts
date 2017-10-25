import { Component } from '@angular/core';
import { NavController,NavParams, ModalController, PopoverController, AlertController, LoadingController } from 'ionic-angular';

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
  loading: any;
  squeelsLoaded: any;

  loadedGame = <any>{};
  loadedGameSqueels = <any>[];

  squeels = <any>[];
  squeelsData = <any>[];
  squeelsDataSliced = <any>[];
  squeelsTop = <any>[];
  squeelsTopSliced = <any>[];
  userId: any;

  isPastGame: boolean = false;
  filter: any = "Latest";

  team1: any = 0;
  team2: any = 0;
  team1Trophies: any = 0;
  team2Trophies: any = 0;


  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public navParams: NavParams, public apollo: Angular2Apollo,public alertCtrl: AlertController, public modalCtrl: ModalController, public popoverCtrl: PopoverController) {
    this.squeelsLoaded = 10;
    this.loadedGame = navParams.get('game');
    this.team1Trophies = this.loadedGame.oponent1Trophies;
    this.team2Trophies = this.loadedGame.oponent2Trophies;
    let now = new Date().toISOString();
    if (this.loadedGame.date < now) {
      this.isPastGame = true;
    }
    this.loading = this.loadingCtrl.create({
      content: 'Finding squeels...'
    });
    this.loading.present();
    this.getLoadedGameSqueels().subscribe(({data}) => {
      this.loadedGameSqueels = data;

      //Getting each team's trophies
      let trophies = <any>{};
      trophies = this.loadedGameSqueels.allGames[0];
      this.team1 = trophies.oponent1Trophies;
      this.team2 = trophies.oponent2Trophies;

      this.userId = this.loadedGameSqueels.user.id;

      this.loadedGameSqueels = this.loadedGameSqueels.allSqueels;

      this.squeelsData = [];
      this.squeelsTop = [];

      for(let squeel of this.loadedGameSqueels) {
        let voted = false;
        for(let voters of squeel.upvotes) {
          if (voters.id == this.userId) {
            voted = true;
          }
        }
        let temp = {squeel: squeel, voted: voted, length: squeel.upvotes.length};
        this.squeelsData.push(temp);
        this.squeelsTop.push(temp);
      }
      this.squeelsTop.sort(this.compare);
      this.squeelsDataSliced = this.squeelsData.slice(0, 10);
      this.squeelsTop = this.squeelsTop.slice(0, 30);
      this.loading.dismiss();
    });
  }

  getLoadedGameSqueels() {
    return this.apollo.watchQuery({
      query: gql`
      query allSqueels($id: ID!) {
        allSqueels(orderBy: createdAt_DESC, filter:{game:{id: $id}}){
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
        allGames(filter: {id: $id}) {
          id
          oponent1Trophies
          oponent2Trophies
        }
        user{
          id
        }
      }
      `, variables: {
        id: this.loadedGame.id
      }
    });
  }

  getSqueels() {
    return this.apollo.watchQuery({
      query: gql`
      query {
        allGames(orderBy: date_ASC, filter:{active: true}) {
          oponent1
          oponent1color
          oponent1Score
          oponent1Image
          oponent2
          oponent2color
          oponent2Score
          oponent2Image
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
            game {
              oponent1
              oponent1Image
              oponent1color
              oponent2
              oponent2Image
              oponent2color
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
      for(let squeel of this.games[0].squeels) {
        let voted = false;
        for(let voters of squeel.upvotes) {
          if (voters.id == this.userId) {
            voted = true;
          }
        }
        let temp = {squeel: squeel, voted: voted, length: squeel.upvotes.length};
        this.squeelsData.push(temp);
        this.squeelsTop.push(temp);
      }
      this.squeelsTop.sort(this.compare);
      this.squeelsDataSliced = this.squeelsData.slice(0, 10);
      this.squeelsTop = this.squeelsTop.slice(0, 30);
    })
  }

  createSqueel() {
    let modal = this.modalCtrl.create(AddSqueelPage, {game: this.loadedGame});
    modal.present();
    modal.onDidDismiss(squeel => {
      console.log(squeel);
      if (squeel) {
        let temp = {squeel: squeel.createSqueel, voted: false, length: 0};
        this.squeelsDataSliced.unshift(temp);
      }
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
        likesSqueelId: squeel.squeel.id,
        gameId: this.loadedGame.id
      }
    }).toPromise().then(({data}) => {
      if (squeel.squeel.team == 1) {
        this.team1Trophies++;
        this.apollo.mutate({
          mutation: gql`
          mutation updateGame($id: ID!, $oponent1Trophies: Int) {
            updateGame(id: $id, oponent1Trophies: $oponent1Trophies) {
              id
            }
          }
          `,variables: {
            id: this.loadedGame.id,
            oponent1Trophies: ++this.team1
          }
        }).toPromise();
      } else {
        this.team2Trophies++;
        this.apollo.mutate({
          mutation: gql`
          mutation updateGame($id: ID!, $oponent2Trophies: Int) {
            updateGame(id: $id, oponent2Trophies: $oponent2Trophies) {
              id
            }
          }
          `,variables: {
            id: this.loadedGame.id,
            oponent2Trophies: ++this.team2
          }
        }).toPromise();
      }
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
      if (squeel.squeel.team == 1) {
        this.team1Trophies--;
        this.apollo.mutate({
          mutation: gql`
          mutation updateGame($id: ID!, $oponent1Trophies: Int) {
            updateGame(id: $id, oponent1Trophies: $oponent1Trophies) {
              id
            }
          }
          `,variables: {
            id: this.loadedGame.id,
            oponent1Trophies: --this.team1
          }
        }).toPromise();
      } else {
        this.team2Trophies--;
        this.apollo.mutate({
          mutation: gql`
          mutation updateGame($id: ID!, $oponent2Trophies: Int) {
            updateGame(id: $id, oponent2Trophies: $oponent2Trophies) {
              id
            }
          }
          `,variables: {
            id: this.loadedGame.id,
            oponent2Trophies: --this.team2
          }
        }).toPromise();
      }
    });
  }

  doInfinite(infiniteScroll) {
    for (let i = this.squeelsLoaded; i < this.squeelsLoaded + 10; i++) {
      if (this.squeelsData[i]) {
        console.log(this.squeelsData[i]);
        this.squeelsDataSliced.push(this.squeelsData[i]);
      }
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

  report(squeel) {
    this.apollo.mutate({
      mutation: gql`
      mutation addToSqueelOnReport($reportsSqueelId: ID!, $reportsUserId: ID!) {
        addToSqueelOnReport(reportsSqueelId: $reportsSqueelId, reportsUserId: $reportsUserId) {
          reportsUser {
            id
          }
        }
      }
      `, variables: {
        reportsSqueelId: squeel.squeel.id,
        reportsUserId: this.userId
      }
    });
    let alert = this.alertCtrl.create({
      title: 'Report Submitted!',
      subTitle: 'Our team will keep an eye on that squeel!',
      buttons: ['OK']
    });
    alert.present();
  }
}
