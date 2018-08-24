import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  
  constructor(public navCtrl: NavController, private readonly platform: Platform) {

    this.platform.ready().then(async () => {
      console.log('async platform.ready()');
    });

    this.platform.ready().then(() => {
      console.log('platform.ready()');
    });
  }
    
  ngOnInit() {
    console.log('ngOnInit');
    this.platform.ready().then(() => {
      console.log('platform.ready() ngOnInit');
    });
  }
}
