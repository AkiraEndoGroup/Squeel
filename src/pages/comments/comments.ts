import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TimeAgoPipe } from 'angular2-moment';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-comments',
  templateUrl: 'comments.html',
})
export class CommentsPage {

  squeel: any;
  comments = <any>[];
  loadedGame: any;
  userId: any;
  comment: any = "";
  createdComment: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.squeel = this.navParams.get('squeel');
    this.userId = this.navParams.get('user');
    for (let comment of this.squeel.squeel.comments) {
      this.comments.push(comment);
    }
  }

  sendMessage() {
    if (this.comment == "") {
      return;
    } else {
      this.apollo.mutate({
        mutation: gql`
        mutation createComment($squeelId: ID!, $comment: String, $userId: ID!){
          createComment(squeelId: $squeelId, comment: $comment, userId: $userId) {
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
        `, variables: {
          squeelId: this.squeel.squeel.id,
          comment: this.comment,
          userId: this.userId
        }
      }).toPromise().then(({data}) => {
        this.comment = "";
        this.createdComment = data;
        this.createdComment = this.createdComment.createComment;
        this.comments.push(this.createdComment);
      });
    }
  }

}
