import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-all-games',
  templateUrl: 'all-games.html',
})
export class AllGamesPage implements OnInit {

  gamesTag: any = "current";
  games = <any>[];
  pastGames = <any>[];
  now: any = new Date();





  constructor(public navCtrl: NavController, public apollo: Angular2Apollo, public alertCtrl: AlertController) {
  }

  ngOnInit() {
    let newDate: any;
    newDate = this.now.setDate(this.now.getDate()-1);
    this.now = new Date(newDate).toISOString();
    console.log(this.now);
    this.getCurrentGames().subscribe(({data}) => {
      this.games = data;
      this.games = this.games.allGames;
    });
    this.getPastGames().subscribe(({data}) => {
      this.pastGames = data;
      this.pastGames = this.pastGames.allGames;
    });
  }

  getCurrentGames() {
    return this.apollo.watchQuery({
      query: gql`
      query allGames($date: DateTime){
        allGames(orderBy: date_ASC, filter:{date_gte: $date}) {
          id
          oponent1
          oponent1color
          oponent1Score
          oponent1Image
          oponent1Trophies
          oponent2
          oponent2color
          oponent2Score
          oponent2Image
          oponent2Trophies
          date
        }
        user {
          id
        }
      }
      `, variables: {
        date: this.now
      },
    });
  }
  getPastGames() {
    return this.apollo.watchQuery({
      query: gql`
      query allGames($date: DateTime){
        allGames(orderBy: date_DESC, filter:{date_lte: $date}) {
          id
          oponent1
          oponent1color
          oponent1Score
          oponent1Image
          oponent1Trophies
          oponent2
          oponent2color
          oponent2Score
          oponent2Image
          oponent2Trophies
          date
        }
        user {
          id
        }
      }
      `, variables: {
        date: this.now
      }
    })
  }

  openHome(game) {
    this.navCtrl.push(HomePage, {game: game});
  }

  tellMore() {
    let alert = this.alertCtrl.create({
      title: 'Stay tuned! ',
      subTitle: 'More games and sports are coming soon!',
      buttons: ['OK']
    });
    alert.present();
  }

}
