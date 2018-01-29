import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { HashtagPage } from '../hashtag/hashtag';

import { Angular2Apollo } from 'angular2-apollo';
import gql from 'graphql-tag';
import 'rxjs/add/operator/toPromise';

/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  hashtags = <any>[];
  queryList = <any>[];

  constructor(public navCtrl: NavController, public navParams: NavParams, public apollo: Angular2Apollo) {
    this.getAllHashtags().then(({data}) => {
      this.hashtags = data;
      this.hashtags = this.hashtags.allHashtags;
      this.initializeItems();
    });

  }

  initializeItems() {
     this.queryList = this.hashtags;
  }

  /**
   * Perform a service for the proper items.
   */
  getItems(searchbar) {
    // Reset items back to all of the items
    this.initializeItems();

    // set q to the value of the searchbar
    var q = searchbar.srcElement.value;

    // if the value is an empty string don't filter the items
    if (!q) {
      this.initializeItems();
      return;
    }

    this.queryList = this.queryList.filter((v) => {
      if(v.name && q) {
        if (v.name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          console.log(v);
          return true;
        }
        return false;
      }
    });

    console.log(q, this.queryList.length);
  }

  gotoHashtagPage(hashtag) {
    this.navCtrl.push(HashtagPage, {hashtag: hashtag});
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

}
