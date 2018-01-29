import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { AllGamesPage } from '../all-games/all-games';
import { SearchPage } from '../search/search';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AllGamesPage;
  tab2Root = SearchPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
