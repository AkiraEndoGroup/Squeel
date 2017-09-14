import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';

import { AddSqueelPage } from '../add-squeel/add-squeel';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-game-squeels',
  templateUrl: 'game-squeels.html',
})
export class GameSqueelsPage {

  game: any;
  userId: any;
  squeels = <any>[];
  team1Trophies: any = 0;
  team2Trophies: any = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo, public modalCtrl: ModalController) {
    this.apollo.query({
      query: gql`
      query {
        user{
          id
        }
      }
      `
    }).toPromise().then(({data}) => {
      this.userId = data;
      this.userId = this.userId.user.id
      this.game = this.navParams.get('game');
      for(let squeel of this.game.squeels) {
        let voted = false;
        for(let voters of squeel.upvotes) {
          if (voters.id == this.userId) {
            voted = true;
          }
        }
        let temp = {squeel: squeel, voted: voted, length: squeel.upvotes.length};
        squeel.team == 1 ? this.team1Trophies+=temp.length : this.team2Trophies+=temp.length;
        this.squeels.push(temp);
      }

    })
  }

  createSqueel() {
    let modal = this.modalCtrl.create(AddSqueelPage, {game: this.game});
    modal.present();
  }

}
