import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';

import { AddSqueelPage } from '../add-squeel/add-squeel';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  squeelsLoaded: any;

  squeels = <any>[];
  squeelsData = <any>[];
  squeelsDataSliced = <any>[];
  squeelsTop = <any>[];
  squeelsTopSliced = <any>[];
  userId: any;
  team1Trophies: any = 0;
  team2Trophies: any = 0;

  filter: any = "latest";

  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public modalCtrl: ModalController) {
    this.squeelsLoaded = 10;
  }

  ionViewDidLoad() {
    this.apollo.watchQuery({
      query: gql`
      query {
        allSqueels(orderBy: createdAt_DESC) {
          id
          description
          createdAt
          team
          upvotes {
            id
          }
          user {
            id
            profileUrl
            name
          }
        }
        user {
          id
        }
      }
      `,
    }).subscribe(({data})=> {
      console.log(data);
      this.squeels = data;
      this.squeelsData = [];
      this.squeelsTop = [];
      this.team1Trophies = 0;
      this.team2Trophies = 0;
      this.userId = this.squeels.user.id;
      this.squeels = this.squeels.allSqueels;
      for(let squeel of this.squeels) {
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
      this.squeelsTopSliced = this.squeelsTop.slice(0, 10);
      console.log(this.squeelsTop);
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
    this.apollo.watchQuery({
      query: gql`
      query {
        allSqueels(orderBy: createdAt_DESC) {
          id
          description
          createdAt
          team
          upvotes {
            id
          }
          user {
            id
            profileUrl
            name
          }
        }
        user {
          id
        }
      }
      `,
    }).refetch(({data})=> {
      // refresher.complete();
      console.log(data);
      this.squeels = data;
      this.squeelsData = [];
      this.squeelsTop = [];
      this.team1Trophies = 0;
      this.team2Trophies = 0;
      this.userId = this.squeels.user.id;
      this.squeels = this.squeels.allSqueels;
      for(let squeel of this.squeels) {
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
      this.squeelsTopSliced = this.squeelsTop.slice(0, 10);
      console.log(this.squeelsTop);
    })
  }

  createSqueel() {
    let modal = this.modalCtrl.create(AddSqueelPage);
    modal.present();
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
}
