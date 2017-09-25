import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Platform } from 'ionic-angular';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { NativeStorage } from '@ionic-native/native-storage';

import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {
  user: any;
  loading: any;

  FB_APP_ID: number = 117061515679147;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public platform: Platform,
              public apollo: Angular2Apollo,
              public fb: Facebook,
              public tw: TwitterConnect,
              public loadingCtrl: LoadingController,
              public nativeStorage: NativeStorage) {

    this.fb.browserInit(this.FB_APP_ID, "v2.8");
  }

  loginFacebook() {
    let env = this;

    //If platform is browser
    if (this.platform.is('core') || this.platform.is('mobileweb')) {
      this.user = { name: 'Gustavo Fulton', gender: 'Male', email: "gugafflu@gmail.com", picture: "https://graph.facebook.com/10212157223859147/picture?type=large" };
      console.log(this.user);
      this.loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      this.loading.present();

      this.createUser().then(({data}) => {
        console.log(data);
        if (data){
          let token = <any>{};
          token = data;
          localStorage.setItem('graphcoolToken', token.signinUser.token);
          this.loading.dismiss();
          this.navCtrl.push(TabsPage);
        }
      }, (errors) => {
        //In case user already exists, only do signIn
        if (errors == "Error: GraphQL error: User already exists with that information") {
          this.signInUser().then(({data}) => {
            if (data) {
              let token = <any>{};
              token = data;
              localStorage.setItem('graphcoolToken', token.signinUser.token);
              this.loading.dismiss();
              this.navCtrl.push(TabsPage);
            }
          });
        }
      });
      return;
    } else {
      let permissions = new Array<string>();
      let that = this;

      //The permissions your facebook app needs from the user
      permissions = ["public_profile", "email"];

      this.loading = this.loadingCtrl.create({
        content: 'Logging in...'
      });
      this.loading.present();

      this.fb.login(permissions)
      .then(function(response) {
        let userId = response.authResponse.userID;
        let params = new Array<string>();

        //Getting name and gender properties
        that.fb.api("/me?fields=name,gender,email", params)
        .then(function(user) {
          console.log("user");
          console.log(user);
          user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
          that.user = user;
          that.createUser().then(({data}) => {
            console.log("create");
            console.log(data);
            let token = <any>{};
            token = data;
            localStorage.setItem('graphcoolToken', token.signinUser.token);
            that.loading.dismiss();
            that.navCtrl.push(TabsPage);
            // this.appCtrl.getRootNav().push(TabsPage);
            // env.nativeStorage.setItem('user',
            // {
            //   name: this.user.name,
            //   email: this.user.email,
            //   profileUrl: this.user.picture
            // })
            // .then(function(){
            //   env.loading.dismiss();
            //   env.navCtrl.push(TabsPage);
            // }, function (error) {
            //   console.log(error);
            // });
          }, (errors) => {
            if (errors == "Error: GraphQL error: User already exists with that information") {
              that.signInUser().then(({data}) => {
                console.log("login");
                console.log(data);
                let token = <any>{};
                token = data;
                localStorage.setItem('graphcoolToken', token.signinUser.token);
                that.loading.dismiss();
                that.navCtrl.push(TabsPage);
                // env.nativeStorage.setItem('user',
                // {
                //   name: this.user.name,
                //   email: this.user.email,
                //   profileUrl: this.user.picture
                // })
                // .then(function(){
                //   env.loading.dismiss();
                //   env.navCtrl.push(TabsPage);
                // }, function (error) {
                //   console.log(error);
                // });
              });
            }
          });
        }), function(error){
          this.loading.dismiss();
          console.log(error);
        }
      }, function(error){
        this.loading.dismiss();
        console.log(error);
      });
    }
  }

  loginTwitter() {
    let that = this;
    this.loading = this.loadingCtrl.create({
      content: 'Logging in...'
    });
    this.loading.present();
    this.tw.login().then(function(result) {
      //Get user data
      that.tw.showUser().then(function(user){
        console.log(user);
        let biggerPic = user.profile_image_url_https.replace('_normal', '');
        that.user = {picture: biggerPic, name: user.name, email: user.id_str};
        that.createUser().then(({data}) => {
          console.log("create");
          let token = <any>{};
          token = data;
          localStorage.setItem('graphcoolToken', token.signinUser.token);
          that.loading.dismiss();
          that.navCtrl.push(TabsPage);
        }, (errors) => {
            console.log(errors);
          if (errors == "Error: GraphQL error: User already exists with that information") {
            that.signInUser().then(({data}) => {
              console.log("login");
              let token = <any>{};
              token = data;
              localStorage.setItem('graphcoolToken', token.signinUser.token);
              that.loading.dismiss();
              that.navCtrl.push(TabsPage);
            });
          }
        });
      }), function(error){
        this.loading.dismiss();
        console.log(error);
      }
    }, function(error){
        that.loading.dismiss();
    });
  }
  //Creating graph.cool user
  createUser() {
    return this.apollo.mutate({
      mutation: gql`
      mutation ($name: String!, $email: String!, $profileUrl: String!) {
        createUser(authProvider: {
            email: {
              email: $email,
              password: $name,
            }
          },
          profileUrl: $profileUrl,
          name: $name) {
          id
        }
        signinUser(email: {
          email: $email
          password: $name
        }) {
          token
        }
      }
    `,
      variables: {
        name: this.user.name,
        email: this.user.email,
        profileUrl: this.user.picture
      }
    }).toPromise();
  }
  signInUser() {
    return this.apollo.mutate({
      mutation: gql`
      mutation ($name: String!, $email: String!) {
        signinUser(email: {
          email: $email
          password: $name
        }) {
          token
        }
      }
    `,
      variables: {
        name: this.user.name,
        email: this.user.email
      }
    }).toPromise();

  }

}
