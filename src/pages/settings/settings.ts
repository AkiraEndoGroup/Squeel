import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  loading: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController) {
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
