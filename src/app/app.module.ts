import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProfilePage } from '../pages/profile/profile';
import { AddSqueelPage } from '../pages/add-squeel/add-squeel';
import { SettingsPage } from '../pages/settings/settings';
import { GameSqueelsPage } from '../pages/game-squeels/game-squeels';
import { SqueelpopoverPage } from '../pages/squeelpopover/squeelpopover';
import { SetUsernamePage } from '../pages/set-username/set-username';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Autosize } from '../components/autosize';

import { MomentModule } from 'angular2-moment';


//Apollo config
import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';


//Providers
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { NativeStorage } from '@ionic-native/native-storage';

@NgModule({
  declarations: [
    MyApp,
    Autosize,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    ProfilePage,
    AddSqueelPage,
    SettingsPage,
    GameSqueelsPage,
    SqueelpopoverPage,
    SetUsernamePage
  ],
  imports: [
    ApolloModule.withClient(provideClient),
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    WelcomePage,
    ProfilePage,
    AddSqueelPage,
    SettingsPage,
    GameSqueelsPage,
    SqueelpopoverPage,
    SetUsernamePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    TwitterConnect,
    NativeStorage
  ]
})
export class AppModule {}
