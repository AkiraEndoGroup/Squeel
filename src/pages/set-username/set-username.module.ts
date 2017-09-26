import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetUsernamePage } from './set-username';

@NgModule({
  declarations: [
    SetUsernamePage,
  ],
  imports: [
    IonicPageModule.forChild(SetUsernamePage),
  ],
})
export class SetUsernamePageModule {}
