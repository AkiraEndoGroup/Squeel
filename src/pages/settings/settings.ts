import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';
import {App} from 'ionic-angular';

import { WelcomePage } from '../welcome/welcome';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  loading: any;
  user = <any>{};
  madeChanges: boolean = false;
  username: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, public apollo: Angular2Apollo, private app:App) {
    this.apollo.query({
      query: gql`
        query {
          user{
            id
            name
            username
          }
        }
      `
    }).toPromise().then(({data}) => {
      this.user = data;
      this.user = this.user.user;
      this.username = this.user.username;
    })

  }

  change() {
    if (this.username != this.user.username) {
      this.madeChanges = true;
    } else {
      this.madeChanges = false;
    }
  }

  save() {
    if (!this.username.match(/^[0-9a-zA-Z]+$/)) {
      let toast = this.toastCtrl.create({
        message: 'Username can only contain numbers and letters.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      console.log("alphanumeric");
    } else if (this.username.length>15) {
      let toast = this.toastCtrl.create({
        message: 'Username is too long. Max of 15 characters.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      console.log("too long");
    } else {
      console.log("valid");
      this.apollo.mutate({
        mutation: gql`
        mutation updateUser($id: ID!, $username: String!) {
          updateUser(id: $id, username: $username) {
            id
          }
        }
        `, variables: {
          id: this.user.id,
          username: this.username
        }
      }).toPromise().then(({data}) => {
        this.navCtrl.pop();
      },(errors) => {
        console.log(errors);
        if (errors == "Error: GraphQL error: A unique constraint would be violated on User. Details: Field name = username") {
          let toast = this.toastCtrl.create({
            message: 'Username is already taken. Try again.',
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      });
    }
  }

  logoutUser() {
    //If platform is browser
    // if (this.platform.is('core') || this.platform.is('mobileweb')) {
      localStorage.removeItem('user');
      localStorage.removeItem('graphcoolToken');
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Logging Out...'
      });
      this.loading.present();

      this.app.getRootNav().setRoot(WelcomePage);
      // window.location.reload();
    }
  // }

}
