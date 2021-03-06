import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProfilePage } from '../pages/profile/profile';
import { AddSqueelPage } from '../pages/add-squeel/add-squeel';
import { SettingsPage } from '../pages/settings/settings';
import { SetUsernamePage } from '../pages/set-username/set-username';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { LoginPage } from '../pages/login/login';
import { AllGamesPage } from '../pages/all-games/all-games';
import { CommentsPage } from '../pages/comments/comments';
import { SearchPage } from '../pages/search/search';
import { HashtagPage } from '../pages/hashtag/hashtag';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Modules
import { MomentModule } from 'angular2-moment';


//Components
import { Autosize } from '../components/autosize';

//Apollo config
import { provideClient } from './client';
import { ApolloModule } from 'angular2-apollo';


//Providers
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { NativeStorage } from '@ionic-native/native-storage';
import { Camera } from '@ionic-native/camera';

@NgModule({
  declarations: [
    MyApp,
    Autosize,
    TabsPage,
    // WelcomePage,
    // ProfilePage,
    // AddSqueelPage,
    // SettingsPage,
    // SetUsernamePage,
    // TutorialPage,
    // CreateAccountPage,
    // LoginPage,
    // AllGamesPage,
    // CommentsPage,
    // SearchPage,
    // HashtagPage
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
    TabsPage,
    WelcomePage,
    ProfilePage,
    AddSqueelPage,
    SettingsPage,
    SetUsernamePage,
    TutorialPage,
    CreateAccountPage,
    LoginPage,
    AllGamesPage,
    CommentsPage,
    SearchPage,
    HashtagPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Facebook,
    TwitterConnect,
    NativeStorage,
    Camera
  ]
})
export class AppModule {}
