import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

import { TutorialPage } from '../tutorial/tutorial'


@IonicPage()
@Component({
  selector: 'page-set-username',
  templateUrl: 'set-username.html',
})
export class SetUsernamePage {
  form: FormGroup;

  userId = <any>{};

  constructor(public navCtrl: NavController,public apollo: Angular2Apollo, public navParams: NavParams,public formBuilder: FormBuilder, public toastCtrl: ToastController) {
        this.form = formBuilder.group({
            username: ['',  Validators.compose([Validators.maxLength(15), Validators.pattern('[a-zA-Z0-9]*'), Validators.required])],
        });
        this.getUserInfo().then(({data}) => {
          this.userId = data;
          this.userId = this.userId.user.id;
        })
  }

  getUserInfo() {
    return this.apollo.query({
      query: gql`
      query{
        user{
          id
        }
      }
      `
    }).toPromise();
  }

  createUsername() {
    if (this.form.valid) {
      console.log("valid");
      this.apollo.mutate({
        mutation: gql`
        mutation updateUser($id: ID!, $username: String!) {
          updateUser(id: $id, username: $username) {
            id
          }
        }
        `, variables: {
          id: this.userId,
          username: this.form.value.username
        }
      }).toPromise().then(({data}) => {
        this.navCtrl.push(TutorialPage);
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
    } else {
      if (!this.form.value.username.match(/^[0-9a-z]+$/)) {
        let toast = this.toastCtrl.create({
          message: 'Username can only contain numbers and letters.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        console.log("alphanumeric");
      } else if (this.form.value.username.length>15) {
        let toast = this.toastCtrl.create({
          message: 'Username is too long.',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        console.log("too long");
      } else {
        console.log("invalid");
      }

    }
  }

}
