import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  subscription: any;
  activated: boolean = false;
  audio: any;

  audios = {
    horizontal: 'assets/audios/horizontal.mp3',
    left: 'assets/audios/left.mp3',
    right: 'assets/audios/right.mp3',
    vertical: 'assets/audios/vertical.mp3'
  };

  constructor(
    private deviceMotion: DeviceMotion,
    private authSvc: AuthService,
    private router: Router
  ) {
    this.audio = new Audio();
  }

  ngOnInit() {}

  logout() {
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  toggleAlarm() {
    !this.activated? this.activate(): this.deactivate();
    this.activated = !this.activated;
  }

  activate(): void {
    this.subscription = this.deviceMotion.watchAcceleration({frequency: 100}).subscribe(data => {
      console.log(data);
      
      // if(data.x > 1.5) {
      //   console.log('A la izquierda');
      // }

      // if(data.x < 1.5) {
      //   console.log('A la derecha');
      // }
    });
  }

  deactivate(): void {
    this.subscription.unsubscribe();
  }
}
