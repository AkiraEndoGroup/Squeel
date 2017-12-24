import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';


@IonicPage()
@Component({
  selector: 'page-add-squeel',
  templateUrl: 'add-squeel.html',
})
export class AddSqueelPage {

  form: FormGroup;
  game: any;
  currentUser = <any>{};
  team: any = "";
  posting: boolean = false;

  searching: boolean = false;

  hashtags = <any>[];
  allHashtags = <any>[];
  inputHashtag: String;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public apollo: Angular2Apollo, public formBuilder: FormBuilder,public toastCtrl: ToastController) {
    this.game = this.navParams.get('game');

    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
    });
    this.getAllHashtags().then(({data}) => {
      this.hashtags = data;
      this.hashtags = this.hashtags.allHashtags;
      this.allHashtags = this.hashtags;
      console.log(this.hashtags);
    });
    this.form = formBuilder.group({
     description: ['', Validators.required],
     category: ['', Validators.required],
     anonymous: false
    });
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  selectTeam1() {
    this.team = "team1";
  }

  selectTeam2() {
    this.team = "team2";
  }

  currentUserInfo(){
   return this.apollo.query({
     query: gql`
     query {
       user {
         id
         profileUrl
         username
       }
     }
     `
   }).toPromise();
 }

 getAllHashtags() {
   return this.apollo.query({
     query: gql`
      query {
        allHashtags {
          id
          name
          _squeelsMeta {
            count
          }
        }
      }
     `
   }).toPromise();
 }

 chooseHashtag(hashtag) {
   this.inputHashtag = "#" + hashtag.name;
 }

 //Reseting array
 initializeItems(): void {
   this.hashtags = this.allHashtags;
 }

 getItems(searchbar) {
   // Reset items back to all of the items
   this.initializeItems();

   // set q to the value of the searchbar
   var q = searchbar.srcElement.value;





   // if the value is an empty string don't filter the items
   if (!q) {
     this.initializeItems();
     this.searching = false;
     return;
   } else {
     this.searching = true;
     if (q.includes("#")) {
       let words = q.split(" ");
       for (let word of words) {
         if (word.startsWith("#")) {
           q = word.substr(1)
           console.log(word);
         }
       }
       searchbar.srcElement.style.color = "#4dc7ff";
     } else {
       searchbar.srcElement.style.color = "black";
     }

   }

   this.hashtags = this.allHashtags.filter((v) => {
     if(v.name && q) {
       if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
         return true;
       }
       return false;
     }
   });
 }

 squeel() {
   if (this.posting) {
     return;
   }
   if (!this.form.value.description) {
     let toast = this.toastCtrl.create({
        message: 'There is some information missing. Try again.',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
   } else if (!this.team) {
     let toast = this.toastCtrl.create({
        message: 'Please select your team',
        duration: 3000,
        position: 'top'
      });
      toast.present();
      return;
   } else {
     this.posting = true;
     this.apollo.mutate({
      mutation: gql`
      mutation createSqueel($description: String!,
                          $anonymous: Boolean,
                          $userId: ID!,
                          $team: Int,
                          $gameId: ID){
        createSqueel(description: $description, userId: $userId, team: $team, anonymous: $anonymous, gameId: $gameId){
                      id
                      description
                      createdAt
                      team
                      anonymous
                      upvotes {
                        id
                      }
                      user {
                        id
                        profileUrl
                        username
                      }
                      comments {
                        id
                        comment
                        createdAt
                        user{
                          id
                          username
                        }
                      }
                      game {
                        oponent1
                        oponent1Image
                        oponent1color
                        oponent2
                        oponent2Image
                        oponent2color
                      }
                    }
                  }
      `,
      variables: {
        description: this.form.value.description,
        userId: this.currentUser.id,
        team: (this.team == "team1") ? 1 : 2,
        anonymous: this.form.value.anonymous,
        gameId: this.game.id
      }
    }).toPromise().then(({data}) => {
      this.form.value.description = "";
      let toast = this.toastCtrl.create({
         message: 'Squeel created successfully!',
         duration: 3000,
         position: 'top'
       });
       toast.present();
       this.viewCtrl.dismiss(data);
    });
   }
 }

}
