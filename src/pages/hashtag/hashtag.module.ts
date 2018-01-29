import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HashtagPage } from './hashtag';

@NgModule({
  declarations: [
    HashtagPage,
  ],
  imports: [
    IonicPageModule.forChild(HashtagPage),
  ],
})
export class HashtagPageModule {}
