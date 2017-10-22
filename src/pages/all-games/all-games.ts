import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

@IonicPage()
@Component({
  selector: 'page-all-games',
  templateUrl: 'all-games.html',
})
export class AllGamesPage {

  gamesTag: any = "current";
  games = <any>[];
  pastGames = <any>[];
  now = new Date().toISOString();

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.getCurrentGames().subscribe(({data}) => {
      console.log(data);
      this.games = data;
      this.games = this.games.allGames;
    });
    this.getPastGames().subscribe(({data}) => {
      console.log(data);
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
      }
    })
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

}
