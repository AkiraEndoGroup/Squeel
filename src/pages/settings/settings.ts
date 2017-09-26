import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  loading: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {
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
