import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DeviceMotion } from '@ionic-native/device-motion/ngx';
import { AuthService } from '../../services/auth.service';
import { Howl, Howler } from 'howler';
import { AlertController, ToastController } from '@ionic/angular';
import { Vibration } from '@ionic-native/vibration/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  audio: Howl; 
  subscription: any;
  currentPosition = '';
  activated = false;

  audios = {
    'horizontal': 'assets/audios/horizontal.mp3',
    'left': 'assets/audios/left.mp3',
    'right': 'assets/audios/right.mp3',
    'vertical': 'assets/audios/vertical.mp3'
  }

  constructor(
    private deviceMotion: DeviceMotion,
    private authSvc: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private vibration: Vibration,
    private flashlight: Flashlight
  ) { }

  ngOnInit() {}

  logout() {
    this.deactivate();
    this.authSvc.logout();
    this.router.navigate(['/login']);
  }

  toggleAlarm() {
    !this.activated? this.activate(): this.presentAlertPrompt();
  }

  activate(): void {
    this.activated = true;

    this.subscription = this.deviceMotion.watchAcceleration({frequency: 150}).subscribe(data => {
      
      if((data.y > 8.9 || data.y < -8.9) &&  Math.round(Math.abs(data.x)) === 0  && Math.round(Math.abs(data.z)) === 0) {
        this.changePosition('vertical');
      }

      if( (data.x > 8.9 || data.x < -8.9) && Math.round(Math.abs(data.y)) === 0  && Math.round(Math.abs(data.z)) === 0) {
        this.changePosition('horizontal');
      }

      if(data.y > 1.5 && Math.round(Math.abs(data.x)) === 0 && Math.round(Math.abs(data.z)) >= 9) {
        this.changePosition('left');
      }

      if(data.y < -1.5 && Math.round(Math.abs(data.x)) === 0 && Math.round(Math.abs(data.z)) >= 9) {
        this.changePosition('right');
      }

    });
  }

  async deactivate(): Promise<void> {
    Howler.stop();
    this.activated = false;
    this.currentPosition = '';
    this.subscription.unsubscribe();
  }

  changePosition(position: string): void {
    if(position !== this.currentPosition) {
      this.currentPosition = position;
      this.playAudio(this.audios[this.currentPosition]);

      console.log('Se movió ' + this.currentPosition);

      if(this.currentPosition === 'vertical') {
        this.flashlight.switchOn();
        setTimeout(() => this.flashlight.switchOff(), 5000);
      }

      if(this.currentPosition === 'horizontal') {
        this.vibration.vibrate(5000);
      }
    }
  }

  playAudio(url: string): void {
    Howler.stop();
    this.audio = new Howl({
      src: [url],
      loop: true
    }); 
    this.audio.play();
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Ingrese Clave',
      inputs: [
        {
          name: 'pass',
          type: 'password',
          id: 'psswdModal'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.presentToast('No se ha ingresado ninguna clave')
          }
        }, {
          text: 'Ok',
          handler: () => {
            let psswd = (document.querySelector('#psswdModal') as HTMLInputElement).value;
            
            this.authSvc.user$.subscribe( (user:any) => {
              user.clave === psswd? this.deactivate(): this.presentToast('La clave ingresada es incorrecta');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(msj: string) {
    const toast = await this.toastController.create({
      message: msj,
      duration: 2000
    });
    toast.present();
  }
}
