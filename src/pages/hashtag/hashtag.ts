import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { CommentsPage } from '../comments/comments';

@IonicPage()
@Component({
  selector: 'page-hashtag',
  templateUrl: 'hashtag.html',
})
export class HashtagPage {

  hashtag = <any>{};
  squeels = <any>[];
  user = <any>{};

  allSqueels = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo, public loadingCtrl: LoadingController) {
    this.hashtag = this.navParams.get('hashtag');

    let loading = this.loadingCtrl.create({
      content: 'Loading...',
      enableBackdropDismiss: true
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);


    this.apollo.query({
      query: gql`
        query allSqueels($id: ID) {
          allSqueels(filter: {hashtag: {id: $id}}) {
            id
            description
            createdAt
            upvotes {
              id
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
                profileUrl
              }
            }
          }
          user {
            id
          }
        }
      `, variables: {
        id: this.hashtag.id
      }
    }).toPromise().then(({data}) => {
      loading.dismiss();

      this.squeels = data;
      this.user = this.squeels.user;
      this.squeels = this.squeels.allSqueels;

      for (let squeel of this.squeels) {
        let voted = false;
        //Checking if user already voted on the squeel
        if (squeel.upvotes.find(item => item.id == this.user.id)){
          voted = true;
        }
        this.allSqueels.push({squeel: squeel, voted: voted, length: squeel.upvotes.length});
      }
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

  gotoComment(squeel) {
    this.navCtrl.push(CommentsPage, {squeel: squeel, user: this.user.id});
  }

}
