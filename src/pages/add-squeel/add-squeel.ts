import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, AlertController } from 'ionic-angular';
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
  inputHashtagId: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public alertCtrl: AlertController, public apollo: Angular2Apollo, public formBuilder: FormBuilder,public toastCtrl: ToastController) {
    this.game = this.navParams.get('game');

    this.currentUserInfo().then(({data}) => {
      this.currentUser = data;
      this.currentUser = this.currentUser.user;
    });
    this.getAllHashtags().then(({data}) => {
      this.hashtags = data;
      this.hashtags = this.hashtags.allHashtags;
      this.allHashtags = this.hashtags;
      this.hashtags = this.hashtags.slice(0,3);
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
   this.inputHashtagId = hashtag.id;
   let element = document.getElementsByClassName('searchbar-input')[0].style.color = "#4dc7ff";
 }

 //Reseting array
 initializeItems(): void {
   this.hashtags = this.allHashtags;
   this.hashtags = this.hashtags.slice(0,3);
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

 addHashtag() {
   let prompt = this.alertCtrl.create({
     title: 'Hashtag',
     message: 'Enter what you are talking about',
     inputs: [
        {
          name: 'hashtag',
          placeholder: '#msuvsuofm'
        },
      ],
     buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Create',
        handler: data => {
          console.log(data);
          this.createHashtag(data.hashtag);
        }
      }
    ]
  });
  prompt.present();
 }

 createHashtag(hashtag) {
   if (hashtag.startsWith("#")) {
     hashtag = hashtag.substr(1)
   }
   this.apollo.mutate({
    mutation: gql`
    mutation createHashtag($name: String!){
      createHashtag(name: $name){
                    id
                    name
                  }
                }
    `,
    variables: {
      name: hashtag,
    }
  }).toPromise().then(({data}) => {
    let returnedValue = <any>{};
    returnedValue = data;
    this.inputHashtagId = returnedValue.createHashtag.id;
    this.inputHashtag = "#" + hashtag;
    this.searching = false;
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
   } else if (!this.inputHashtag) {
     let toast = this.toastCtrl.create({
        message: 'Please select your hashtag',
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
                          $hashtagId: ID){
        createSqueel(description: $description, userId: $userId, team: $team, anonymous: $anonymous, hashtagId: $hashtagId){
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
                    }
                  }
      `,
      variables: {
        description: this.form.value.description,
        userId: this.currentUser.id,
        team: (this.team == "team1") ? 1 : 2,
        anonymous: this.form.value.anonymous,
        hashtagId: this.inputHashtagId
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
