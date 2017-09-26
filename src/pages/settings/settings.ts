import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  form: FormGroup;

  userId = <any>{};

  constructor(public navCtrl: NavController,public apollo: Angular2Apollo, public navParams: NavParams,public formBuilder: FormBuilder, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  logoutUser() {
    //If platform is browser
    // if (this.platform.is('core') || this.platform.is('mobileweb')) {
      localStorage.removeItem('user');
      localStorage.removeItem('graphcoolToken');
      // this.navCtrl.push(LoginPage);
      // this.app.getRootNav().setRoot(LoginPage);
      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
        content: 'Logging Out...'
      });
      this.loading.present();

      window.location.reload();
      // return;
    }
  // }

}
