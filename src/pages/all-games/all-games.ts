import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController, ModalController } from 'ionic-angular';

import { HomePage } from '../home/home';
import { WelcomePage } from '../welcome/welcome';
import { AddSqueelPage } from '../add-squeel/add-squeel';
import { CommentsPage } from '../comments/comments';


import {App} from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-all-games',
  templateUrl: 'all-games.html',
})
export class AllGamesPage implements OnInit {

  gamesTag: any = "current";
  games = <any>[];
  pastGames = <any>[];
  now: any = new Date();

  user: any;
  userTrophies: any;
  squeels = <any>[];
  allSqueels = <any>[];
  allSqueelsSliced = <any>[];
  topSqueels = <any>[];
  topSqueelsSliced = <any>[];

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public alertCtrl: AlertController, public modalCtrl: ModalController, private app:App) {
  }

  ngOnInit() {
    let newDate: any;
    newDate = this.now.setDate(this.now.getDate()-1);
    this.now = new Date(newDate).toISOString();
    console.log(this.now);
    this.getSqueels().subscribe(({data}) => {
      this.squeels = data;
      this.user = this.squeels.user;
      //Sum of user trophies
      console.log(this.user);
      if (this.user.squeels.length != 0) {
        this.userTrophies = this.user.squeels.map(item => item._upvotesMeta.count).reduce((a,b) => a+b);
      } else {
        this.userTrophies = 0;
      }


      this.squeels = this.squeels.allSqueels;
      for (let squeel of this.squeels) {
        let voted = false;
        //Checking if user already voted on the squeel
        if (squeel.upvotes.find(item => item.id == this.user.id)){
          voted = true;
        }
        this.allSqueels.push({squeel: squeel, voted: voted, length: squeel.upvotes.length});
      }
      this.topSqueels = this.allSqueels.concat().sort(this.compare);

      //Limit to first 20 and load more with infinite scroll
      this.allSqueelsSliced = this.allSqueels.slice(0, 20);
      this.topSqueelsSliced = this.topSqueels.slice(0, 20);
    });
  }

  ionViewDidLoad() {
    this.apollo.query({
      query: gql`
        query {
          user {
            id
          }
        }
      `
    }).toPromise().then(({data}) => {
      let user = <any>{};
      user = data;
      user = user.user;
      if (!user) {
        let alert = this.alertCtrl.create({
          title: 'Ooops! ',
          subTitle: 'It looks like your session expired. Click OK to login again.',
          buttons: [{
            text: 'OK',
            handler: () => {
              localStorage.removeItem('graphcoolToken');
              this.app.getRootNav().setRoot(WelcomePage);
            }
          }]
        });
        alert.present();
      }
    });
  }

  getSqueels() {
    return this.apollo.watchQuery({
      query: gql`
        query allSqueels {
          allSqueels(orderBy: createdAt_DESC, first: 100) {
            id
            description
            createdAt
            team
            anonymous
            upvotes {
              id
            }
            hashtag {
              id
              name
            }
            user {
              id
              profileUrl
              username
            }
            comments {
              id
              comment
              createdAt
              user{
                id
                username
              }
            }
          }
          user {
            id
            squeels {
              _upvotesMeta {
                count
              }
            }
          }
        }
      `
    });
  }

  tellMore() {
    let alert = this.alertCtrl.create({
      title: 'Stay tuned! ',
      subTitle: 'More games and sports are coming soon!',
      buttons: ['OK']
    });
    alert.present();
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
        upvotesUserId: this.user.id,
        likesSqueelId: squeel.squeel.id
      }
    }).toPromise().then(() => console.log("upvoted success"));
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
        upvotesUserId: this.user.id,
        likesSqueelId: squeel.squeel.id
      }
    }).toPromise().then(() => console.log("downvoted success"));
  }

  createSqueel() {
    let modal = this.modalCtrl.create(AddSqueelPage);
    modal.present();
    modal.onDidDismiss(squeel => {
      console.log(squeel);
      if (squeel) {
        let temp = {squeel: squeel.createSqueel, voted: false, length: 0};
        // this.squeelsDataSliced.unshift(temp);
      }
    });
  }

  compare(a,b) {
    if (a.length > b.length)
      return -1;
    if (a.length < b.length)
      return 1;
    return 0;
  }

  doRefresh(refresher) {
    this.getSqueels().subscribe(({data}) => {

      this.squeels = data;
      this.user = this.squeels.user;
      this.squeels = this.squeels.allSqueels;

      this.allSqueels = [];


      for (let squeel of this.squeels) {
        let voted = false;
        //Checking if user already voted on the squeel
        if (squeel.upvotes.find(item => item.id == this.user.id)){
          voted = true;
        }
        this.allSqueels.push({squeel: squeel, voted: voted, length: squeel.upvotes.length});
      }

      this.topSqueels = this.allSqueels.concat().sort(this.compare);

      //Limit to first 20 and load more with infinite scroll
      this.allSqueelsSliced = this.allSqueels.slice(0, 20);
      this.topSqueelsSliced = this.topSqueels.slice(0, 20);
    });
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 1500);
  }

  gotoComment(squeel) {
    this.navCtrl.push(CommentsPage, {squeel: squeel, user: this.user.id});
  }

  doInfinite(infiniteScroll) {
    this.allSqueelsSliced = this.allSqueelsSliced.concat(this.allSqueels.slice(this.allSqueelsSliced.length, this.allSqueelsSliced.length+10));
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500)
  }
  doInfiniteTop(infiniteScroll) {
    this.topSqueelsSliced = this.topSqueelsSliced.concat(this.topSqueels.slice(this.topSqueelsSliced.length, this.topSqueelsSliced.length+10));
    setTimeout(() => {
      infiniteScroll.complete();
    }, 500)
  }
}
