import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  email= "";
  password= ""

  userInfo = <any>{};

  constructor(public navCtrl: NavController, public navParams: NavParams, private apollo: Angular2Apollo, public toastCtrl: ToastController) {
  }

  login() {
    if (!this.email || !this.password) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      this.loginPromise().then(({data}) => {
        this.userInfo.data = data
        console.log(this.userInfo.data.signinUser.token);
        window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
        this.navCtrl.push(TabsPage);
      }, (errors) => {
          console.log(errors);
          if (errors == "Error: GraphQL error: No user found with that information") {
            let toast = this.toastCtrl.create({
              message: 'No user found with that information. Try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
    }

  }

  loginPromise(){
    return this.apollo.mutate({
      mutation: gql`
      mutation signinUser($email: String!,
                          $password: String!){
        signinUser(email: {email: $email, password: $password}){
          token
        }
      }
      `,
      variables: {
        email: this.email,
        password: this.password,
      }
    }).toPromise();
}



}
