import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HashtagPage } from './hashtag';

//Modules
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    HashtagPage,
  ],
  imports: [
    IonicPageModule.forChild(HashtagPage),
    MomentModule
  ],
})
export class HashtagPageModule {}
