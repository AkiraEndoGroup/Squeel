import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { ProfilePage } from '../pages/profile/profile';
import { AddSqueelPage } from '../pages/add-squeel/add-squeel';
import { SettingsPage } from '../pages/settings/settings';
import { SqueelpopoverPage } from '../pages/squeelpopover/squeelpopover';
import { SetUsernamePage } from '../pages/set-username/set-username';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { CreateAccountPage } from '../pages/create-account/create-account';
import { LoginPage } from '../pages/login/login';
import { AllGamesPage } from '../pages/all-games/all-games';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//Modules
import { Autosize } from '../components/autosize';
import { MomentModule } from 'angular2-moment';


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
    HomePage,
    TabsPage,
    WelcomePage,
    ProfilePage,
    AddSqueelPage,
    SettingsPage,
    SqueelpopoverPage,
    SetUsernamePage,
    TutorialPage,
    CreateAccountPage,
    LoginPage,
    AllGamesPage
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
    HomePage,
    TabsPage,
    WelcomePage,
    ProfilePage,
    AddSqueelPage,
    SettingsPage,
    SqueelpopoverPage,
    SetUsernamePage,
    TutorialPage,
    CreateAccountPage,
    LoginPage,
    AllGamesPage
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
