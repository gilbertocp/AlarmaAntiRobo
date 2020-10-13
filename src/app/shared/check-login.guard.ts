import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckLoginGuard implements CanActivate {

  constructor(
    private authSvc: AuthService, 
    private router: Router
  ) { }

  canActivate(): boolean  {
    if(this.authSvc.isLogged()){
      this.router.navigate(['/home'])
      return false;
    }else {
      return true;
    }
  }
  
}
