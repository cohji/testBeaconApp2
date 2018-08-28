import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Platform } from 'ionic-angular';

import { IBeacon, IBeaconPluginResult } from '@ionic-native/ibeacon';
import { LocalNotifications } from '@ionic-native/local-notifications';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IBeacon,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
  private uuid: string = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';

  constructor(platform: Platform, private localNotifications: LocalNotifications, private readonly ibeacon: IBeacon) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.startBleFun();
      
    });
  }
  
  public startBleFun(): void {
    console.log('startBleFun');

    // Request permission to use location on iOS
    this.ibeacon.requestAlwaysAuthorization();
    // create a new delegate and register it with the native layer
    let delegate = this.ibeacon.Delegate();
    
    // Subscribe to some of the delegate's event handlers
    delegate.didRangeBeaconsInRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => console.log('didRangeBeaconsInRegion: ', pluginResult),
      (error: any) => console.error(`Failure during ranging: `, error)
    );
    
    delegate.didStartMonitoringForRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => console.log('didStartMonitoringForRegion: ', pluginResult),
      (error: any) => console.error(`Failure during starting of monitoring: `, error)
    );

    delegate.didEnterRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didEnterRegion: ', pluginResult);
        var date = new Date().getTime().toString();
        this.localNotifications.schedule({
          id: 1,
          title: "didEnterRegion",
          text: date,
          trigger: {at: new Date(new Date().getTime() + (1 * 1000))}
        });
      }
    );

    delegate.didExitRegion().subscribe(
      (pluginResult: IBeaconPluginResult) => {
        console.log('didExitRegion: ', pluginResult);
        var date = new Date().getTime().toString();
        this.localNotifications.schedule({
          id: 1,
          title: "didExitRegion",
          text: date,
          trigger: {at: new Date(new Date().getTime() + (1 * 1000))}
        });
      }
    );

    console.log('Creating BeaconRegion with UUID of: ', this.uuid);
    const beaconRegion = this.ibeacon.BeaconRegion('nullBeaconRegion', this.uuid, 0, 0, true);

    this.ibeacon.enableDebugNotifications

    this.ibeacon.startMonitoringForRegion(beaconRegion).then(
      () => console.log('Native layer recieved the request to monitoring'),
      (error: any) => console.error('Native layer failed to begin monitoring: ', error)
    );
  }
}
