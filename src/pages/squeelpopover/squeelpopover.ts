import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';



@IonicPage()
@Component({
  selector: 'page-squeelpopover',
  templateUrl: 'squeelpopover.html',
})
export class SqueelpopoverPage {

  squeel: any;
  userId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.squeel = this.navParams.get('squeel');
    console.log(this.squeel);
    this.apollo.query({
      query: gql`
        query {
          user{
            id
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.userId = data;
      this.userId = this.userId.user.id;
    })
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

}
