import { Component } from '@angular/core';

import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';
import { AllGamesPage } from '../all-games/all-games';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = AllGamesPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
