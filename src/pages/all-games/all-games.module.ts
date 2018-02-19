import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllGamesPage } from './all-games';

//Modules
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    AllGamesPage,
  ],
  imports: [
    IonicPageModule.forChild(AllGamesPage),
    MomentModule
  ],
})
export class AllGamesPageModule {}
