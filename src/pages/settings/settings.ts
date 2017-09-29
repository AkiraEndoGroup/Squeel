import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';



@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  loading: any;
  user = <any>{};

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public apollo: Angular2Apollo) {
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
    })

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

      window.location.reload();
    }
  // }

}
