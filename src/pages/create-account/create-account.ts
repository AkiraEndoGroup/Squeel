import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { SetUsernamePage } from '../set-username/set-username';

import { Camera, CameraOptions } from '@ionic-native/camera';

import { LoginPage } from '../login/login';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

/**
 * Generated class for the CreateAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-create-account',
  templateUrl: 'create-account.html',
})
export class CreateAccountPage {

  firstName: "";
  lastName: "";
  email: any = "";
  password: "";
  username: "";

  userInfo = <any>{};

  imageUri = "https://msudenver.edu/media/sampleassets/profile-placeholder.png";

  constructor(public navCtrl: NavController, public navParams: NavParams, private apollo: Angular2Apollo,
              private Camera: Camera, public toastCtrl: ToastController) {
  }

  createAccount() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    } else {
      this.createUser().then(({data}) => {
          if (data){
            this.login().then(({data}) => {
              this.userInfo.data = data
              console.log(this.userInfo.data.signinUser.token);
              window.localStorage.setItem('graphcoolToken', this.userInfo.data.signinUser.token);
              this.navCtrl.push(SetUsernamePage);
            }, (errors) => {
                console.log(errors);
                if (errors == "GraphQL error: No user found with that information") {
                  let toast = this.toastCtrl.create({
                    message: 'No user found with that information. Try again.',
                    duration: 3000,
                    position: 'top'
                  });
                  toast.present();
                }
              });
          }
        }, (errors) => {
          console.log(errors);
          if (errors == "Error: GraphQL error: User already exists with that information") {
            let toast = this.toastCtrl.create({
              message: 'User already exists with that information. Please try again.',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
        });
    }

  }

  //returns a promise that both creates the user and returns the user's auth token
  createUser(){
      return this.apollo.mutate({
        mutation: gql`
        mutation createUser($email: String!,
                            $password: String!,
                            $name: String!,
                            $profileUrl: String!){
          createUser(authProvider: { email: {email: $email, password: $password}},
                     name: $name,
                     profileUrl: $profileUrl){
            id
          }
        }
        `,
        variables: {
          email: this.email,
          password: this.password,
          name: this.firstName + " " + this.lastName,
          profileUrl: this.imageUri
        }
      }).toPromise();
  }

  login(){
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

  changePic() {
    let options: CameraOptions = {
      quality: 50,
      destinationType: 0,
      targetWidth: 500,
      targetHeight: 500,
      encodingType: 0,
      sourceType: 0,
      correctOrientation: true,
      allowEdit: true

    };
    this.Camera.getPicture(options).then((ImageData) => {
      let base64Image = "data:image/jpeg;base64," + ImageData;
      this.imageUri = base64Image;
    });
  }

  gotoLogin() {
    this.navCtrl.push(LoginPage);
  }
}
