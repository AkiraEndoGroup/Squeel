import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { SettingsPage } from '../settings/settings';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  user: any;
  squeels = <any>[];
  trophies: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.getUserInfo().subscribe(({data}) => {
      console.log(data);
      this.trophies = 0;
      this.user = data;
      this.user = this.user.user;
      for (let squeel of this.user.squeels) {
        this.trophies+=squeel.upvotes.length;
      }
    });
  }
  ionViewDidEnter() {
    this.getUserInfo().refetch(({data}) => {
      this.trophies = 0;
      console.log(data);
      this.user = data;
      this.user = this.user.user;
      for (let squeel of this.user.squeels) {
        this.trophies+=squeel.upvotes.length;
      }
    });
  }

  getUserInfo() {
    return this.apollo.watchQuery({
      query: gql`
      query{
        user{
          id
          name
          email
          profileUrl
          username
          squeels(orderBy: createdAt_DESC) {
            id
            description
            createdAt
            upvotes {
              id
            }
          }
        }
      }
      `
    })
  }

  deleteSqueel(squeel) {
    this.apollo.mutate({
      mutation: gql`
        mutation deleteSqueel($id: ID!) {
          deleteSqueel(id: $id) {
            id
          }
        }
      `, variables: {
        id: squeel.id
      }
    }).toPromise().then(({data})=> {
      this.ionViewDidEnter();
    });
  }

  goToSettingsPage() {
    this.navCtrl.push(SettingsPage);
  }

}
