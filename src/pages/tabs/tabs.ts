import { Component } from '@angular/core';

import { AddSqueelPage } from '../add-squeel/add-squeel';
import { ProfilePage } from '../profile/profile';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AddSqueelPage;
  tab3Root = ProfilePage;

  constructor() {

  }
}
